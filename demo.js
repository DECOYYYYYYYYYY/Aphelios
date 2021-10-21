document.getElementById('calc').addEventListener('click',()=>{
  // todo 补全类型检测，start截取后三位字符串，target需求五位
  // todo 不可长时间保有同一把枪（）
  // todo 给出所有长度相同的解法
  const start = document.querySelector('#now').value
  let target = document.querySelector('#target').value
  // console.log(typeof start,target)
  let process_arr = [[start]]
  let flag = false
  let result = ''
  function getNext(str){
    // 0:绿刀通碧，1：红刀断魄，2：紫刀坠明，3：蓝刀荧焰，4:白刀折镜
    let arr1 = "01234".split("")
    let arr2 = []
    for (const e of arr1) {
      if (str.indexOf(e) === -1) arr2.push(e)
    }
    return [str.substr(1)+arr2[0], str.substr(1)+arr2[1]]
  }
  // console.log(getNext('134'));
  while(!flag) {
    let new_arr = []
    process_arr[process_arr.length-1].forEach((e)=>{
      for (let subStr of getNext(e)){
        if(target=== subStr){

          flag = true
          result = subStr
          // todo 补全收尾
        }
        new_arr.push(subStr)
      }
      // console.log(str1, str2);
    })
    process_arr.push(new_arr)
  }

  console.log(process_arr)
  console.log(result)
})
