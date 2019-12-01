import React, { useState } from 'react'
import '../index.scss'
import Board from './Board'
import {
  addRole,
  circlesDefault,
  deleteRole,
  gameBackgroundImages,
  getNotCompleteRoles,
  updateBoardCirclesLayout
} from '../utils'
import SelectTheme from './operate-area/SelectTheme'
import SelectRoles from './operate-area/SelectRoles'
import NextPlayer from './operate-area/NextPlayer'
import ConfirmBtn from './operate-area/ConfirmBtn'
import _ from 'lodash'


function Game () {
  // 布局、棋子半径
  let [layout, setLayout] = useState({
    r: 20, // 棋子半径
    a: 20, // 棋子与同轴线上相邻棋子边缘的最短距离
  })
  
  // 主题
  let [theme, setTheme] = useState(0)
  
  // 已选择的角色 selectedRoles
  let [selectedRoles, setSelectedRoles] = useState([])
  
  // 当前步骤（大步的步骤）
  let [currentStep, setCurrentStep] = useState(0)
  
  // 历史记录
  let initialHistory = [{circles: circlesDefault}]
  let [history, setHistory] = useState(initialHistory)
  
  // 当前选中的棋子的位置坐标
  let [currentSelectedCell, setCurrentSelectedCell] = useState({})
  
  // 已经完成游戏的玩家排名
  let [ranking, setRanking] = useState([])
  
  // 当前角色
  let [currentRole, setCurrentRole] = useState(null)
  
  // 当前这一大步
  let [cashCirclesArr, setCashCirclesArr] = useState([circlesDefault])
  
  // 落子点
  let [ableReceiveCells, setAbleReceiveCells] = useState([])
  
  /**
   * 处理选择主题
   * @param index ：选择的主题的索引
   */
  function handleSelectTheme (index) {
    if (theme !== index) {
      setTheme(index)
      setSelectedRoles([])
      setHistory([{circles: circlesDefault}])
      setCurrentSelectedCell({})
      setCurrentRole(null)
      setCashCirclesArr([circlesDefault])
      setAbleReceiveCells([])
    }
  }
  
  
  /**
   * 处理选择角色
   * @param roleIndex : 选择的角色的索引
   */
  function handleSelectRole (roleIndex) {
    // 1、更新已选择的角色
    let new_selectedRoles = selectedRoles.slice()
    if (new_selectedRoles.includes(roleIndex)) { // 取消一个角色
      new_selectedRoles = deleteRole(new_selectedRoles, roleIndex)
    } else { // 增加一个角色
      if (new_selectedRoles.length < 6) {
        new_selectedRoles = addRole(new_selectedRoles, roleIndex)
      }
    }
    setSelectedRoles(new_selectedRoles)
    
    // 2、更新棋盘棋子布局
    let circlesOrigin = updateBoardCirclesLayout(theme, new_selectedRoles)
    setHistory([{circles: circlesOrigin}])
    setCashCirclesArr([circlesOrigin])
    
    // 3、设置当前选中棋子为空
    setCurrentSelectedCell({})
    
    // 4、更新 当前玩家 的角色
    let new_currentRole = new_selectedRoles.length > 0 ? new_selectedRoles[0] : null
    setCurrentRole(new_currentRole)
    
    // 5、设置 当前落子点 为空
    setAbleReceiveCells([])
    
  }
  
  /**
   * 处理点击一个格子
   *  @param circleData : 点击的格子（棋子或者空格）的数据
   */
  function handleClickCircle (circleData, ableReceive) {
    // 点击了棋子
    if (circleData.role !== null) {
      // 只能点击当前玩家的棋子
      if (circleData.role !== currentRole) return
      // 已经有当前玩家的棋子走出了一小步了，就不能点击其他的当前玩家的棋子
      if (cashCirclesArr.length > 1) return
      
      // 1、改变棋子的样式 为 选中样式
      setCurrentSelectedCell(circleData)
      // 2、找落子点
      let ableReceiveCells = findAbleReceiveCells(cashCirclesArr, circleData)
      setAbleReceiveCells(ableReceiveCells)
    }
    // 点击了落子点
    else if (ableReceive) {
      // 1、更新 cashCirclesArr
      let new_cashCirclesArr = getNewCashCirclesArr(cashCirclesArr, currentSelectedCell, circleData)
      setCashCirclesArr(new_cashCirclesArr)
      // 2、更新选中样式
      setCurrentSelectedCell({...circleData, role: currentSelectedCell.role})
      // 3、更新落子点
      let ableReceiveCells = findAbleReceiveCells(new_cashCirclesArr, {...circleData, role: currentSelectedCell.role})
      setAbleReceiveCells(ableReceiveCells)
    }
  }
  
  
  /**
   * 返回 当前选中的棋子 的 落子点
   * @param cashCirclesArr :当前的一大步
   * @param selectedCircle :当前选中的棋子
   */
  function findAbleReceiveCells (cashCirclesArr, selectedCircle) {
    let ableReceiveCells = [] // 当前选中的棋子所有可以落子的点
    // 落子点 分为两种：可以跳到的落子点（简称：跳落子点） 和 可以通过移动一步而达到的落子点（这样的落子点就在选择点的紧挨着的位置，简称：移落子点）
    // 我们知道，一个棋子的一步是可以跳到多个落子点的。
    // 我们称一个棋子从开始走 到 走到 最后的落子点 的这个过程叫做这个棋子的“一大步”，
    // 这一大步中的第一小步叫“首步”，后边的所有次小步叫“非首步”。
    // a) 对于棋子的 首步，它的 落子点 包括 跳落子点 和 移落子点
    // b) 对于棋子的 非首步，如果它的前一小步是 跳过来 的，那么它的落子点只包括 跳落子点；
    // c) 对于棋子的 非首步，如果它的前一小步是 移过来 的，那么它的落子点只包括一个：它原来的位置；
    
    let cashCircles = cashCirclesArr[cashCirclesArr.length - 1] // 当前棋子布局
    
    // 首步
    if (cashCirclesArr.length === 1) {
      let jumpToCells = findJumpToCells(cashCircles, selectedCircle)  // 拿到跳落子点
      let moveToCells = findMoveToCells(cashCircles, selectedCircle)  // 拿到移落子点
      
      ableReceiveCells = ableReceiveCells.concat(jumpToCells, moveToCells)
    }
    // 非首步
    else if (cashCirclesArr.length > 1) {
      // 判断当前棋子是不是移过来的
      let isMoveHere = isMoveHereOrNot(cashCirclesArr, selectedCircle)
      if (isMoveHere) { // 是移过来的，isMoveHere 是 原来移过来的位置对象
        ableReceiveCells.push(isMoveHere)
      } else { // 是跳过来的，isMoveHere 是 false
        let jumpToCells = findJumpToCells(cashCircles, selectedCircle)  // 拿到跳落子点
        ableReceiveCells = ableReceiveCells.concat(jumpToCells)
      }
    }
    
    return ableReceiveCells
  }
  
  /**
   * 返回 当前选中棋子 的 跳落子点
   * @param currentCashCircles : 当前棋子布局
   * @param selectedCircle : 当前选中的棋子
   */
  function findJumpToCells (currentCashCircles, selectedCircle) {
    let jumpToCells = [] // 要返回的 当前选中棋子 的 跳落子点
    
    let axes = ['x', 'y', 'z']
    for (let axisIndex = 0; axisIndex < axes.length; axisIndex++) {
      
      let nextAxisIndex = (axisIndex + 1) % axes.length // 当前处理的轴后面的轴，如果当前处理轴是z，那么它后面的轴是x
      
      let circlesLeft = [] // 与选择的棋子 在同一条当前处理轴上的  在它左边的 棋子
      let circlesRight = [] // 与选择的棋子 在同一条当前处理轴上的  在它右边的 棋子
      
      for (let i = 0; i < currentCashCircles.length; i++) {
        for (let j = 0; j < currentCashCircles[i].length; j++) {
          if (currentCashCircles[i][j][axes[axisIndex]] === selectedCircle[axes[axisIndex]] && currentCashCircles[i][j].role !== null) {
            
            // 在选择点 左边的棋子
            if (currentCashCircles[i][j][axes[nextAxisIndex]] < selectedCircle[axes[nextAxisIndex]]) {
              circlesLeft.push(currentCashCircles[i][j])
            }
            // 在选择点 右边的棋子
            else if (currentCashCircles[i][j][axes[nextAxisIndex]] > selectedCircle[axes[nextAxisIndex]]) {
              circlesRight.push(currentCashCircles[i][j])
            }
          }
        }
      }
      
      // 找棋子左边的 跳落子点
      if (circlesLeft.length > 0) {
        // a) 找到左边的桥点
        let circlesLeftNearest = circlesLeft[circlesLeft.length - 1]
        
        // b) 计算基于 桥点 向左边跳的话，下一步会跳到哪个位置（简称：基于 桥点 找 目标点）
        let distance = selectedCircle[axes[nextAxisIndex]] - circlesLeftNearest[axes[nextAxisIndex]]
        let goalNextAxis = circlesLeftNearest[axes[nextAxisIndex]] - distance  // 目标点的 另外一个轴的值（取的是轴数组中当前处理轴的后面那个轴）
        let goalCurrentAxis = selectedCircle[axes[axisIndex]] // 目标点的 当前处理轴的 值
        
        // c) 判断目标点是否可以落子
        for (let i = 0; i < currentCashCircles.length; i++) {
          for (let j = 0; j < currentCashCircles[i].length; j++) {
            if (
              currentCashCircles[i][j][axes[axisIndex]] === goalCurrentAxis &&
              currentCashCircles[i][j][axes[nextAxisIndex]] === goalNextAxis &&
              currentCashCircles[i][j].role === null
            ) {
              // 棋盘中存在这个点，并且这个点是一个空格
              // 判断这个 目标点 和 桥点 之间是否还有棋子
              let exist = false // 默认 目标点 和 桥点 之间没有棋子
              for (let i = 0; i < circlesLeft.length - 1; i++) {
                if (circlesLeft[i][axes[nextAxisIndex]] > goalNextAxis &&
                  circlesLeft[i][axes[nextAxisIndex]] < circlesLeftNearest[axes[nextAxisIndex]]) {
                  exist = true
                  break
                }
              }
              if (!exist) { // 目标点 和 桥点 之间没有棋子，那么这个目标点就是一个 跳落子点
                jumpToCells.push(currentCashCircles[i][j])
              }
            }
          }
        }
      }
      
      // 找棋子右边的 跳落子点
      if (circlesRight.length > 0) {
        // a) 找右边的桥点
        let circlesRightNearest = circlesRight[0]
        
        // b) 基于 桥点 找 目标点
        let distance = circlesRightNearest[axes[nextAxisIndex]] - selectedCircle[axes[nextAxisIndex]]
        let goalNextAxis = circlesRightNearest[axes[nextAxisIndex]] + distance  // 目标点的 另外一个轴的值（取的是轴数组中当前处理轴的后面那个轴）
        let goalCurrentAxis = selectedCircle[axes[axisIndex]] // 目标点的 当前处理轴的 值
        
        // c) 判断目标点是否可以落子
        for (let i = 0; i < currentCashCircles.length; i++) {
          for (let j = 0; j < currentCashCircles[i].length; j++) {
            if (
              currentCashCircles[i][j][axes[axisIndex]] === goalCurrentAxis &&
              currentCashCircles[i][j][axes[nextAxisIndex]] === goalNextAxis &&
              currentCashCircles[i][j].role === null
            ) {
              // 棋盘中存在这个点，并且这个点是一个空格
              // 判断这个 目标点 和 桥点 之间是否还有棋子
              let exist = false // 默认 目标点 和 桥点 之间没有棋子
              for (let i = 1; i < circlesRight.length; i++) {
                if (
                  circlesRight[i][axes[nextAxisIndex]] > circlesRightNearest[axes[nextAxisIndex]] &&
                  circlesRight[i][axes[nextAxisIndex]] < goalNextAxis
                ) {
                  exist = true
                  break
                }
              }
              if (!exist) { // 目标点 和 桥点 之间没有棋子，那么这个目标点就是一个 跳落子点
                jumpToCells.push(currentCashCircles[i][j])
              }
            }
          }
        }
      }
      
    }
    
    return jumpToCells
  }
  
  /**
   * 返回 当前选中棋子 的 移落子点
   * @param currentCashCircles : 当前棋子布局
   * @param selectedCircle : 当前选中的棋子
   */
  function findMoveToCells (currentCashCircles, selectedCircle) {
    let moveToCells = [] // 要返回的 当前选中棋子的 所有 移落子点
    
    let axes = ['x', 'y', 'z']
    for (let axisIndex = 0; axisIndex < axes.length; axisIndex++) {
      
      let nextAxisIndex = (axisIndex + 1) % axes.length // 当前处理的轴后面的轴，如果当前处理轴是z，那么它后面的轴是x
      
      for (let i = 0; i < currentCashCircles.length; i++) {
        for (let j = 0; j < currentCashCircles[i].length; j++) {
          if (
            currentCashCircles[i][j][axes[axisIndex]] === selectedCircle[axes[axisIndex]] &&   // 跟选择点在同一个 当前处理轴 上
            currentCashCircles[i][j].role === null &&   // 是一个空格
            Math.abs(currentCashCircles[i][j][axes[nextAxisIndex]] - selectedCircle[axes[nextAxisIndex]]) === 1  // 在选择点相邻的格子
          ) { // 那么这一个点 就是 移落子点
            moveToCells.push(currentCashCircles[i][j])
          }
        }
      }
    }
    
    return moveToCells
  }
  
  /**
   * 判断 当前正在下的棋子 是 移过来的 还是 跳过来的 （是通过 移 还是 跳 到现在这一步的）
   * @param currentCashCirclesArr : 当前这一大步的数据（是一个包含这一大步中每一小步的棋子布局的数组）
   * @param selectedCircle ： 当前选中的棋子（当前正在下的棋子，即当前正在走这一大步的棋子）
   * @return : 如果是移过来的，返回移过来的位置点对象，如果不是移过来的，返回 false
   */
  function isMoveHereOrNot (currentCashCirclesArr, selectedCircle) {
    let isMoveHere = false // 当前棋子是否是 移过来 的，默认不是移过来的（是跳过来的）
    let preStepCircles = currentCashCirclesArr[currentCashCirclesArr.length - 2] // 上一步的棋子布局
    let currentStepCircles = currentCashCirclesArr[currentCashCirclesArr.length - 1] // 当前的棋子布局
    
    let axes = ['x', 'y', 'z']
    for (let axisIndex = 0; axisIndex < axes.length; axisIndex++) {
      
      let nextAxisIndex = (axisIndex + 1) % axes.length // 当前处理的轴后面的第一个轴，如果当前处理轴是z，那么它后面的轴是x
      let nextTwoAxisIndex = (axisIndex + 2) % axes.length // 当前处理的轴后面的第二个轴，如果当前处理轴是y，那么它后面的轴是x
      
      for (let i = 0; i < preStepCircles.length; i++) {
        for (let j = 0; j < preStepCircles[i].length; j++) {
          if (
            preStepCircles[i][j].role !== null && // 上一步中，有这么一个 棋子
            preStepCircles[i][j][axes[axisIndex]] === selectedCircle[axes[axisIndex]] && // 这个棋子 与 当前棋子 同在某一条轴上
            Math.abs(preStepCircles[i][j][axes[nextAxisIndex]] - selectedCircle[axes[nextAxisIndex]]) === 1 && // 这个棋子 与 当前棋子 在另外一条轴上的 坐标值相差1
            Math.abs(preStepCircles[i][j][axes[nextTwoAxisIndex]] - selectedCircle[axes[nextTwoAxisIndex]]) === 1 && // 这个棋子 与 当前棋子 在另外第二条轴上的 坐标值相差1
            currentStepCircles[i][j].role === null  // 在上一步中，这个位置是一个棋子，但是在这一步中，这个位置是一个空格
          ) {
            isMoveHere = currentStepCircles[i][j] // 是移过来的，返回 原来移过来的位置
            break
          }
        }
        if (isMoveHere) {
          break
        }
      }
      if (isMoveHere) {
        break
      }
    }
    
    return isMoveHere
  }
  
  /**
   * 返回点击当前的落子点后，新的一大步的数据 new_cashCirclesArr
   * @param cashCirclesArr : 当前的一大步
   * @param currentSelectedCell : 当前的选择点
   * @param circleData : 当前点击的落子点
   * @returns {*}
   */
  function getNewCashCirclesArr (cashCirclesArr, currentSelectedCell, circleData) {
    let new_cashCirclesArr = _.cloneDeep(cashCirclesArr) // 最后要返回的新的 cashCirclesArr
    let cashCircles = _.cloneDeep(cashCirclesArr[cashCirclesArr.length - 1])
    // 1、把当前选中棋子 变为 空格
    let selectedToBlankComplete = false // 把选择点 变为 空格 是否已完成
    for (let i = 0; i < cashCircles.length; i++) {
      for (let j = 0; j < cashCircles[i].length; j++) {
        if (
          cashCircles[i][j].x === currentSelectedCell.x &&
          cashCircles[i][j].y === currentSelectedCell.y
        ) {
          cashCircles[i][j].role = null
          selectedToBlankComplete = true
          break
        }
      }
      if (selectedToBlankComplete) {
        break
      }
    }
    // 2、把 落子点 变成 当前选中棋子的角色
    let blankToSelectedComplete = false // 落子点 变 已选择点 是否已完成
    for (let i = 0; i < cashCircles.length; i++) {
      for (let j = 0; j < cashCircles[i].length; j++) {
        if (cashCircles[i][j].x === circleData.x && cashCircles[i][j].y === circleData.y) {
          cashCircles[i][j].role = currentSelectedCell.role
          blankToSelectedComplete = true
          break
        }
      }
      if (blankToSelectedComplete) {
        break
      }
    }
    // 3、更新 new_cashCirclesArr
    if (new_cashCirclesArr.length === 1) { // 如果是这个棋子的 首步，那么这一步（cashCircles）肯定跟初始状态不同，应该直接push进 小步状态数组（cashCirclesArr）
      new_cashCirclesArr.push(cashCircles)
    } else { // 这个棋子至少走出过1步了，那么这时应该判断 这一步 是否跟它在这一大步中走过的位置有重复，如果有重复，就相当于它又回退到了这一步
      let hasDuplicateSmallStep = false
      for (let i = new_cashCirclesArr.length - 2; i >= 0; i--) {
        if (isBoardLayoutTheSame(new_cashCirclesArr[i], cashCircles)) {
          new_cashCirclesArr = new_cashCirclesArr.slice(0, i + 1)
          hasDuplicateSmallStep = true
          break
        }
      }
      if (!hasDuplicateSmallStep) {
        new_cashCirclesArr.push(cashCircles)
      }
    }
    
    return new_cashCirclesArr
  }
  
  /**
   * 判断两次棋子布局是否完全一样，完全一样返回 true
   * @param circlesOne : 一个棋子布局
   * @param circlesTwo : 另一个棋子布局
   */
  function isBoardLayoutTheSame (circlesOne, circlesTwo) {
    let isTheSame = true // 先假设两次棋子布局完全一样
    for (let i = 0; i < circlesOne.length; i++) {
      for (let j = 0; j < circlesOne[i].length; j++) {
        if (circlesOne[i][j].role !== circlesTwo[i][j].role) {
          isTheSame = false
          break
        }
      }
      if (!isTheSame) {
        break
      }
    }
    
    return isTheSame
  }
  
  /**
   * 处理点击“确定”按钮
   */
  function handleConfirm () {
    let newest_circles = cashCirclesArr[cashCirclesArr.length - 1]
    // 1、更新 history
    let new_history = _.cloneDeep(history)
    new_history.push({circles: newest_circles})
    setHistory(new_history)
    // 2、更新 cashCirclesArr
    setCashCirclesArr([newest_circles])
    // 3、更新当前步骤（大步）
    setCurrentStep(currentStep + 1)
    // 4、更新当前选中的棋子
    setCurrentSelectedCell({})
    // 5、更新落子点
    setAbleReceiveCells([])
    // 6、更新 ranking
    let new_ranking = getNewRanking(newest_circles, ranking)
    setRanking(new_ranking)
    // 7、更新 currentRole
    let new_currentRole = getNewCurrentRole(ranking, new_ranking, currentRole)
    setCurrentRole(new_currentRole)
  }
  
  /**
   * 返回新的 已经完成游戏的角色
   * @param circles : 当前的棋子布局
   * @param ranking : 老的 已经完成游戏的角色
   */
  function getNewRanking (circles, ranking) {
    let cashRanking = ranking.slice()  // 已经完成的
    
    // 当前有 1 个玩家
    if (selectedRoles.length === 1) {
      if (!cashRanking.includes(selectedRoles[0])) {
        if (northTenAreTheSameGivenRole(selectedRoles[0], circles)) {
          cashRanking.push(selectedRoles[0])
        }
      }
    }
    // 当前有 2 个玩家
    else if (selectedRoles.length === 2) {
      if (!cashRanking.includes(selectedRoles[0])) { // 如果第 1 个角色没有完成
        if (northTenAreTheSameGivenRole(selectedRoles[0], circles)) {
          cashRanking.push(selectedRoles[0])
        }
      }
      if (!cashRanking.includes(selectedRoles[1])) { // 如果第 2 个角色没有完成
        if (southTenAreTheSameGivenRole(selectedRoles[1], circles)) {
          cashRanking.push(selectedRoles[1])
        }
      }
    }
    // 当前有 3 个玩家
    else if (selectedRoles.length === 3) {
      if (!cashRanking.includes(selectedRoles[0])) { // 如果第 1 个角色没有完成
        if (northTenAreTheSameGivenRole(selectedRoles[0], circles)) {
          cashRanking.push(selectedRoles[0])
        }
      }
      if (!cashRanking.includes(selectedRoles[1])) { // 如果第 2 个角色没有完成
        if (eastSouthTenAreTheSameGivenRole(selectedRoles[1], circles)) {
          cashRanking.push(selectedRoles[1])
        }
      }
      if (!cashRanking.includes(selectedRoles[2])) { // 如果第 3 个角色没有完成
        if (westSouthTenAreTheSameGivenRole(selectedRoles[2], circles)) {
          cashRanking.push(selectedRoles[2])
        }
      }
    }
    // 当前有 4 个玩家
    else if (selectedRoles.length === 4) {
      if (!cashRanking.includes(selectedRoles[0])) { // 如果第 1 个角色没有完成
        if (northTenAreTheSameGivenRole(selectedRoles[0], circles)) {
          cashRanking.push(selectedRoles[0])
        }
      }
      if (!cashRanking.includes(selectedRoles[1])) { // 如果第 2 个角色没有完成
        if (eastNorthTenAreTheSameGivenRole(selectedRoles[1], circles)) {
          cashRanking.push(selectedRoles[1])
        }
      }
      if (!cashRanking.includes(selectedRoles[2])) { // 如果第 3 个角色没有完成
        if (southTenAreTheSameGivenRole(selectedRoles[2], circles)) {
          cashRanking.push(selectedRoles[2])
        }
      }
      if (!cashRanking.includes(selectedRoles[3])) { // 如果第 4 个角色没有完成
        if (westSouthTenAreTheSameGivenRole(selectedRoles[3], circles)) {
          cashRanking.push(selectedRoles[3])
        }
      }
    }
    // 当前有 5 个玩家
    else if (selectedRoles.length === 5) {
      if (!cashRanking.includes(selectedRoles[0])) { // 如果第 1 个角色没有完成
        if (northTenAreTheSameGivenRole(selectedRoles[0], circles)) {
          cashRanking.push(selectedRoles[0])
        }
      }
      if (!cashRanking.includes(selectedRoles[1])) { // 如果第 2 个角色没有完成
        if (eastNorthTenAreTheSameGivenRole(selectedRoles[1], circles)) {
          cashRanking.push(selectedRoles[1])
        }
      }
      if (!cashRanking.includes(selectedRoles[2])) { // 如果第 3 个角色没有完成
        if (eastSouthTenAreTheSameGivenRole(selectedRoles[2], circles)) {
          cashRanking.push(selectedRoles[2])
        }
      }
      if (!cashRanking.includes(selectedRoles[3])) { // 如果第 4 个角色没有完成
        if (southTenAreTheSameGivenRole(selectedRoles[3], circles)) {
          cashRanking.push(selectedRoles[3])
        }
      }
      if (!cashRanking.includes(selectedRoles[4])) { // 如果第 5 个角色没有完成
        if (westSouthTenAreTheSameGivenRole(selectedRoles[4], circles)) {
          cashRanking.push(selectedRoles[4])
        }
      }
    }
    // 当前有 6 个玩家
    else if (selectedRoles.length === 6) {
      if (!cashRanking.includes(selectedRoles[0])) { // 如果第 1 个角色没有完成
        if (northTenAreTheSameGivenRole(selectedRoles[0], circles)) {
          cashRanking.push(selectedRoles[0])
        }
      }
      if (!cashRanking.includes(selectedRoles[1])) { // 如果第 2 个角色没有完成
        if (eastNorthTenAreTheSameGivenRole(selectedRoles[1], circles)) {
          cashRanking.push(selectedRoles[1])
        }
      }
      if (!cashRanking.includes(selectedRoles[2])) { // 如果第 3 个角色没有完成
        if (eastSouthTenAreTheSameGivenRole(selectedRoles[2], circles)) {
          cashRanking.push(selectedRoles[2])
        }
      }
      if (!cashRanking.includes(selectedRoles[3])) { // 如果第 4 个角色没有完成
        if (southTenAreTheSameGivenRole(selectedRoles[3], circles)) {
          cashRanking.push(selectedRoles[3])
        }
      }
      if (!cashRanking.includes(selectedRoles[4])) { // 如果第 5 个角色没有完成
        if (westSouthTenAreTheSameGivenRole(selectedRoles[4], circles)) {
          cashRanking.push(selectedRoles[4])
        }
      }
      if (!cashRanking.includes(selectedRoles[5])) { // 如果第 6 个角色没有完成
        if (westNorthTenAreTheSameGivenRole(selectedRoles[5], circles)) {
          cashRanking.push(selectedRoles[5])
        }
      }
    }
    
    return cashRanking
  }
  
  /**
   * 判断 北边10子 是否都是给定的角色
   * @param role : 给定的角色
   * @param circles : 当前布局
   * @returns {boolean}
   */
  function northTenAreTheSameGivenRole (role, circles) {
    let allIsThisRole = true // 假设这10个点都是给定的角色
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < circles[i].length; j++) {
        if (circles[i][j].role !== role) {
          allIsThisRole = false
          break
        }
      }
      if (!allIsThisRole) {
        break
      }
    }
    return allIsThisRole
  }
  
  /**
   * 判断 当前布局中，南边10子 是否都是给定的角色
   * @param role : 给定的角色
   * @param circles : 当前布局
   * @return : 返回 是或否
   */
  function southTenAreTheSameGivenRole (role, circles) {
    let allIsThisRole = true // 假设这10个点都是给定的角色
    for (let i = circles.length - 4; i < circles.length; i++) {
      for (let j = 0; j < circles[i].length; j++) {
        if (circles[i][j].role !== role) {
          allIsThisRole = false
          break
        }
      }
      if (!allIsThisRole) {
        break
      }
    }
    
    return allIsThisRole
  }
  
  /**
   * 判断 东南边10子 是否都是给定的角色
   * @param role : 给定的角色
   * @param circles : 当前角色
   * @returns {boolean}
   */
  function eastSouthTenAreTheSameGivenRole (role, circles) {
    let allIsThisRole = true // 假设这10个点都是给定的角色
    for (let i = 9; i < 13; i++) {
      for (let j = 9; j < i + 1; j++) {
        if (circles[i][j].role !== role) {
          allIsThisRole = false
          break
        }
      }
      if (!allIsThisRole) {
        break
      }
    }
    return allIsThisRole
  }
  
  
  /**
   * 判断 西南方10子 是否都是给定的角色
   * @param role : 给定的角色
   * @param circles : 当前布局
   * @returns {boolean} : 如果都是给定的角色，返回 true
   */
  function westSouthTenAreTheSameGivenRole (role, circles) {
    let allIsThisRole = true // 假设这10个点都是给定的角色
    for (let i = 9; i < 13; i++) {
      for (let j = 0; j < i - 8; j++) {
        if (circles[i][j].role !== role) {
          allIsThisRole = false
          break
        }
      }
      if (!allIsThisRole) {
        break
      }
    }
    return allIsThisRole
  }
  
  /**
   * 判断 东北边10子 是否都是给定的角色
   * @param role : 给定的角色
   * @param circles : 当前布局
   * @returns {boolean}
   */
  function eastNorthTenAreTheSameGivenRole (role, circles) {
    let allIsThisRole = true // 假设这10个点都是给定的角色
    for (let i = 4; i < 8; i++) {
      for (let j = 9; j < 17 - i; j++) {
        if (circles[i][j].role !== role) {
          allIsThisRole = false
          break
        }
      }
      if (!allIsThisRole) {
        break
      }
    }
    return allIsThisRole
  }
  
  
  /**
   * 判断 西北10子 是否都是给定的角色
   * @param role : 给定的角色
   * @param circles : 当前布局
   * @returns {boolean}
   */
  function westNorthTenAreTheSameGivenRole (role, circles) {
    let allIsThisRole = true // 假设这10个点都是给定的角色
    for (let i = 4; i < 8; i++) {
      for (let j = 0; j < 8 - i; j++) {
        if (circles[i][j].role !== role) {
          allIsThisRole = false
          break
        }
      }
      if (!allIsThisRole) {
        break
      }
    }
    return allIsThisRole
  }
  
  /**
   * 找到新的 下一步玩家角色 ，返回
   * @param oldRanking : 老的已完成游戏的角色
   * @param newRanking : 新的已完成游戏的角色
   * @param oldCurrentRole ： 老的当前玩家角色
   */
  function getNewCurrentRole (oldRanking, newRanking, oldCurrentRole) {
    let newCurrentRole = null
    
    // 如果没有新的角色完成游戏
    if (oldRanking.length === newRanking.length) {
      let notCompleteRoles = getNotCompleteRoles(selectedRoles, oldRanking)  // 没有完成游戏的角色
      // 找到老的当前玩家角色所在的索引
      let oldCurrentRoleIndex = notCompleteRoles.findIndex(role => role === oldCurrentRole)
      let newCurrentRoleIndex = (oldCurrentRoleIndex + 1) % notCompleteRoles.length
      newCurrentRole = notCompleteRoles[newCurrentRoleIndex]
    }
    // 如果有新的角色完成游戏
    else if (oldRanking.length < newRanking.length) {
      let newCompleteRole = newRanking[newRanking.length - 1] // 新完成游戏的角色
      let oldNotCompleteRoles = getNotCompleteRoles(selectedRoles, oldRanking)  // 老的还没有完成游戏的角色
      
      // 找到 新完成游戏的角色 在老的还没有完成游戏的角色数组 中 的索引
      let newCompleteRoleIndexInOldNotComplete = oldNotCompleteRoles.findIndex(role => role === newCompleteRole)
      if (oldNotCompleteRoles.length === 1) { // 最后一个未完成的也完成了
        newCurrentRole = null
      } else if (oldNotCompleteRoles.length > 1) {
        let newCurrentRoleIndex = (newCompleteRoleIndexInOldNotComplete + 1) % oldNotCompleteRoles.length
        newCurrentRole = oldNotCompleteRoles[newCurrentRoleIndex]
      }
    }
    
    return newCurrentRole
  }
  
  
  return (
    <div className="game">
      <div
        className="show-theme"
        style={{
          backgroundImage: gameBackgroundImages[theme]
        }}
      >
      </div>
      <Board
        r={layout.r}
        a={layout.a}
        circles={cashCirclesArr[cashCirclesArr.length - 1]}
        theme={theme}
        handleClickCircle={handleClickCircle}
        currentSelectedCell={currentSelectedCell}
        ableReceiveCells={ableReceiveCells}
      />
      <div className="btns-area">
        {/*选择主题*/}
        <SelectTheme
          theme={theme}
          history={history}
          handleSelectTheme={(index) => handleSelectTheme(index)}
        />
        {/*选择角色*/}
        <SelectRoles
          theme={theme}
          history={history}
          selectedRoles={selectedRoles}
          handleSelectRole={(roleIndex) => handleSelectRole(roleIndex)}
        />
        {/*下一步*/}
        <NextPlayer
          theme={theme}
          selectedRoles={selectedRoles}
          ranking={ranking}
          currentRole={currentRole}
        />
        {/*  确定按钮*/}
        <ConfirmBtn
          cashCirclesArr={cashCirclesArr}
          handleConfirm={handleConfirm}
        />
      </div>
    </div>
  )
}

export default Game