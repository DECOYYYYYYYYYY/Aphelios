let weaponFrom = '#####'
let weaponTo = localStorage.getItem('weaponTo') ?? '#####'
if (!isWeaponLegal(weaponTo)) weaponTo = '#####'
const weaponMap = {0: '通碧', 1: '断魄', 2: '坠明', 3: '荧焰', 4: '折镜'}
let inputs = document.querySelectorAll('.input span')
let imgs = document.querySelectorAll('.select img')
let saveUl = document.getElementById('save')
let saveBtn = document.getElementById('addSave')
let calculateBtn = document.getElementById('calc')
let selectedInputIndex = 0

// 点击输入框切换到该输入框
inputs.forEach((value, key) => {
  value.addEventListener('click', function () {
    inputTurnTo(key)
  })
})
// 武器图片点击功能
imgs.forEach((el, key) => {
  el.addEventListener('click', function () {
    if (selectedInputIndex < weaponFrom.length) {
      let i = selectedInputIndex
      // 若重复，将重复者清空
      if (weaponFrom.indexOf(key.toString()) !== -1) {
        weaponFrom = weaponFrom.replace(key.toString(), '#')
      }
      weaponFrom = weaponFrom.substring(0, i) + key + weaponFrom.substring(i + 1)
    } else {
      let i = selectedInputIndex - weaponFrom.length
      if (weaponTo.indexOf(key.toString()) !== -1) {
        weaponTo = weaponTo.replace(key.toString(), '#')
      }
      weaponTo = weaponTo.substring(0, i) + key + weaponTo.substring(i + 1)
    }
    // 自动补全
    if ((weaponFrom.match(/#/g) ?? '').length === 1) {
      let all = '01234'
      for (let char of weaponFrom) {
        all = all.replace(char, '')
      }
      weaponFrom = weaponFrom.replace('#', all)
    }
    if ((weaponTo.match(/#/g) ?? '').length === 1) {
      let all = '01234'
      for (let char of weaponTo) {
        all = all.replace(char, '')
      }
      weaponTo = weaponTo.replace('#', all)
    }
    turnInputToEmpty()
    updateInput()
  })
})
// 初始按钮
document.getElementById('initial').addEventListener('click', initializeWeaponFrom)
// 清空按钮
document.getElementById('clearNow').addEventListener('click', () => {
  clear(0)
})
document.getElementById('clearTarget').addEventListener('click', () => {
  clear(1)
})
// 保存按钮
saveBtn.addEventListener('click', addSave)
// 计算按钮
calculateBtn.addEventListener('click', calculate)

updateInput()
turnInputToEmpty()
updateSave()
updateBtnEnable()

function isWeaponLegal(str) {
  return /^[0-4]{5}$/.test(str) && new Set(str).size === 5
}

function checkBeforeSave() {
  if (!isWeaponLegal(weaponTo)) return false
  let saveArr = getSaveArr()
  let key = weaponTo.substr(2)
  for (let str of saveArr) {
    if (key === str.substr(2)) return false
  }
  return true
}

function addClassName(el, className) {
  if (el.className.indexOf(className) === -1) {
    el.className += ' ' + className
  }
}

function removeClassName(el, className) {
  el.className = el.className.replace(new RegExp(className, 'g'), '')
}

// 获取localStorage中的save，转换为数组返回
function getSaveArr() {
  let saveArr = JSON.parse(localStorage.getItem('save') ?? '[]')
  if (!saveArr instanceof Array) saveArr = []
  return saveArr
}

// 切换到指定输入框
function inputTurnTo(num) {
  selectedInputIndex = num
  inputs.forEach(e => {
    e.className = e.className.replace(/ active/g, '')
  })
  inputs[selectedInputIndex].className += ' active'
}

// 切换到空输入框
function turnInputToEmpty() {
  let str = weaponFrom + weaponTo
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '#') {
      inputTurnTo(i)
      return
    }
  }
}

function addWeaponToToStorage() {
  if (isWeaponLegal(weaponTo)) localStorage.setItem('weaponTo', weaponTo)
}

// 将weaponFrom和weaponTo的内容解析到输入框
function updateInput() {
  for (let i = 0; i < weaponFrom.length + weaponTo.length; i++) {
    let weaponStr = i < weaponFrom.length ? weaponFrom[i] : weaponTo[i - weaponFrom.length]
    if (/[0-4]/.test(weaponStr)) {
      inputs[i].innerHTML = weaponMap[weaponStr]
    } else {
      inputs[i].innerHTML = '&nbsp;'
    }
  }
  addWeaponToToStorage()
  updateBtnEnable()
}

// 读取save的内容并解析生成html
function updateSave() {
  let saveArr = getSaveArr()
  saveUl.innerHTML = ''
  saveArr.forEach((str, index) => {
    if (!isWeaponLegal(str)) str = '#####'
    let tempArr = []
    for (let char of str) tempArr.push(weaponMap[char])
    let li = document.createElement('li')
    li.innerHTML += `存档${index + 1}：${tempArr.join('，')}`
    li.className = 'clearfix'

    let applyBtn = document.createElement('button')
    applyBtn.innerHTML = '应用'
    applyBtn.addEventListener('click', () => {
      weaponTo = str
      updateInput()
      turnInputToEmpty()
    })

    let deleteBtn = document.createElement('button')
    deleteBtn.innerHTML = '删除'
    deleteBtn.className = 'danger'
    deleteBtn.addEventListener('click', () => {
      saveArr.splice(index, 1)
      localStorage.setItem('save', JSON.stringify(saveArr))
      updateSave()
      updateBtnEnable()
    })
    li.appendChild(deleteBtn)
    li.appendChild(applyBtn)
    saveUl.appendChild(li)
  })
}

function updateBtnEnable() {
  if (isWeaponLegal(weaponFrom) && isWeaponLegal(weaponTo)) {
    removeClassName(calculateBtn, 'disable')
  } else {
    addClassName(calculateBtn, 'disable')
  }
  if (checkBeforeSave()) {
    removeClassName(saveBtn, 'disable')
  } else {
    addClassName(saveBtn, 'disable')
  }
}

// 清空
function clear(which) {
  if (which === 0) {
    weaponFrom = '#####'
  } else if (which === 1) {
    weaponTo = '#####'
    localStorage.setItem('weaponTo','')
  }
  turnInputToEmpty()
  updateInput()
}

// 将weaponFrom初始化为游戏开局时的顺序
function initializeWeaponFrom() {
  weaponFrom = '01234'
  updateInput()
  turnInputToEmpty()
}

// 添加需要刀序至save
function addSave() {
  if (!checkBeforeSave()) return
  let saveArr = getSaveArr()
  saveArr.push(weaponTo)
  localStorage.setItem('save', JSON.stringify(saveArr))
  updateSave()
  updateBtnEnable()
}

// 计算并添加结果到列表
function calculate() {
  if (!isWeaponLegal(weaponTo) || !isWeaponLegal(weaponFrom)) return
  let shortest = document.getElementById('shortest')
  let recommend = document.getElementById('recommend')
  shortest.innerHTML = ''
  recommend.innerHTML = ''
  let strict = solve(true)
  let notStrict = solve(false)

  strict.sort((a, b) => a.length - b.length)
  let minLengthInStrict = strict[0].length
  notStrict = notStrict.filter(e => e.length < minLengthInStrict)
  notStrict.sort((a, b) => a.length - b.length)

  strict = parse(strict)
  notStrict = parse(notStrict)

  if (strict.length > 0) {
    recommend.parentNode.style.display = 'block'
  } else {
    recommend.parentNode.style.display = 'none'
  }

  if (notStrict.length > 0) {
    shortest.parentNode.style.display = 'block'
  } else {
    shortest.parentNode.style.display = 'none'
  }

  strict.forEach((value) => {
    recommend.innerHTML += `<li>${value}</li>`
  })
  notStrict.forEach((value) => {
    shortest.innerHTML += `<li>${value}</li>`
  })

  function solve(isStrict) {
    // isStrict:是否允许长时间保有同一把枪（经历两次换枪后下一次必须换枪）
    let heap = [null, weaponFrom]
    let result = [] // 每个元素代表一种解法，元素值为该解法的最后一位在堆中的索引
    let isFinish = false
    let index = 1
    let depth = 1

    while (!isFinish) {
      // 每次while循环，都会对指定深度的所有结点创建子节点
      for (let _ = 0; _ < 2 ** (depth - 1); _++) {
        addChildren(index++)
      }
      depth++
    }
    return getResult()

    function getParentIndex(i) {
      return Math.floor(i / 2)
    }

    function getGrandparentIndex(i) {
      return getParentIndex(getParentIndex(i))
    }

    function addChildren(index) {
      let mustChange = ''
      // 判断是否长时持有某武器
      let allWeaponsNow = heap[index]
      if (allWeaponsNow === '') {
        heap.push('', '')
        return
      }
      if (isStrict && depth > 2) {
        let weaponsNow = allWeaponsNow.substr(0, 2)
        let weaponsGrandparent = heap[getGrandparentIndex(index)].substr(0, 2)
        for (let char of weaponsNow) {
          if (weaponsGrandparent.indexOf(char) !== -1) {
            mustChange = char
          }
        }
      }
      let allWeaponsNext
      if (mustChange === '') {
        allWeaponsNext = [allWeaponsNow.substr(1) + allWeaponsNow[0]
          , allWeaponsNow[0] + allWeaponsNow.substr(2) + allWeaponsNow[1]]
      } else {
        allWeaponsNext = [allWeaponsNow.replace(mustChange, '') + mustChange, ""]
      }
      for (let e of allWeaponsNext) {
        if (e === "") {
          heap.push("")
        } else if (e.substr(2, 3) === weaponTo.substr(2, 3)) {
          // 匹配成功
          heap.push(e)
          result.push(heap.indexOf(e))
          isFinish = true
        } else {
          heap.push(e)
        }
      }
    }

    // 返回数组，数组内各元素为字符串，代表多种不同解法，字符串从前往后表示使用武器的顺序
    function getResult() {
      let resList = []
      for (let resIndex of result) {
        let res = []
        let p = resIndex
        while (p !== 1) {
          res.unshift(heap[p].slice(-1))
          p = getParentIndex(p)
        }
        let resStr = res.join('')
        if (resList.indexOf(resStr) === -1) {
          resList.push(resStr)
        }
      }
      return resList
    }
  }

  function parse(arr) {
    let res = []
    arr.forEach((str) => {
      let charArr = []
      for (let char of str) {
        charArr.push(weaponMap[char])
      }
      res.push(charArr.join(' → '))
    })
    return res
  }
}
