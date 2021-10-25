// todo 本地存储
let weaponFrom = '21034'
// fixme 若输入不合法，修改
let weaponTo = '01234'
const weaponMap = {0: '通碧', 1: '断魄', 2: '坠明', 3: '荧焰', 4: '折镜'}
let inputs = document.querySelectorAll('.input span')
let imgs = document.querySelectorAll('.select img')
let selectedInputIndex = 0
// 切换到指定输入框
function inputTurnTo(num){
  selectedInputIndex = num
  inputs.forEach(e => {
    e.className = e.className.replace(/ active/g, '')
  })
  inputs[selectedInputIndex].className += ' active'
}
// 切换到空输入框
function turnToEmpty() {
  let str = weaponFrom + weaponTo
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '#') {
      inputTurnTo(i)
      return
    }
  }
}
// 输入框内容解析
function updateInput() {
  for (let i = 0; i < weaponFrom.length + weaponTo.length; i++) {
    let weaponStr = i < weaponFrom.length ? weaponFrom[i] : weaponTo[i - weaponFrom.length]
    if (weaponStr === '#') {
      inputs[i].className = inputs[i].className.replace(/ show/g, '')
    } else if (Number(weaponStr) >= 0 && Number(weaponStr) <= 4) {
      inputs[i].innerHTML = weaponMap[weaponStr]
      inputs[i].className += ' show'
    }
  }
}
// 点击输入框切换到该输入框
inputs.forEach((value, key) => {
  value.addEventListener('click', function () {
    inputTurnTo(key)
  })
})
// 武器图片点击功能
imgs.forEach((value, key) => {
  value.addEventListener('click', function () {
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
    if ((weaponFrom.match(/#/g) ?? '') .length === 1) {
      let all = '01234'
      for (let char of weaponFrom) {
        all = all.replace(char, '')
      }
      weaponFrom = weaponFrom.replace('#', all)
    }
    if ((weaponTo.match(/#/g) ?? '') .length === 1) {
      let all = '01234'
      for (let char of weaponTo) {
        all = all.replace(char, '')
      }
      weaponTo = weaponTo.replace('#', all)
    }
    turnToEmpty()
    updateInput()
  })
})
// 清空按钮
document.getElementById('clearNow').addEventListener('click', () => {
  weaponFrom = '#####'
  turnToEmpty()
  updateInput()
})
document.getElementById('clearTarget').addEventListener('click', () => {
  weaponTo = '#####'
  turnToEmpty()
  updateInput()
})
// 计算按钮
// fixme
document.getElementById('calc').addEventListener('click', () => {
  // todo 补全类型检测，start和target需求五位数字组成的字符串
  const resultUl = document.getElementById('result')
  const start = document.querySelector('#now').value
  let target = document.querySelector('#target').value
  // const start = '01234'
  // let target = '20143'
  // console.log(typeof start,target)
  let heap = [null, start]
  let result = []
  let isFinish = false
  let isStrict = true // 是否允许长时间保有同一把枪（经历两次换枪后下一次必须换枪）
  let index = 1
  let depth = 1

  while (!isFinish) {
    // 每次while循环，都会对指定深度的所有结点创建子节点
    for (let _ = 0; _ < 2 ** (depth - 1); _++) {
      addChildren(index++)
    }
    depth++
  }
  getResult()
  console.log(heap)
  console.log(result)

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
      } else if (e.substr(2, 3) === target.substr(2, 3)) {
        // 匹配成功
        heap.push(e)
        result.push(heap.indexOf(e))
        isFinish = true
      } else {
        heap.push(e)
      }
    }
  }

  function getResult() {
    resultUl.innerHTML = ''
    let resStrings = []
    for (let resIndex of result) {
      let res = []
      let p = resIndex
      while (p !== 1) {
        res.unshift(weaponMap[heap[p].slice(-1)])
        p = getParentIndex(p)
      }
      let resStr = res.join(' → ')
      if (resStrings.indexOf(resStr) !== -1) {
        resStrings.push(resStr)
        continue
      }
      resStrings.push(resStr)
      resultUl.innerHTML += `<li>${res.join(' → ')}</li>`
    }
  }
})
updateInput()
turnToEmpty()
