const fs = require('fs')
const path = require('path')

/**
* @description: 参数配置
*/
// 目标js位置
let jsurl = 'output.js'
// 导出数据的文件夹
let dir = './exports'
// 生成的js文件的变量名
let jsvar = 'var dataJson='

/**
 * @description: 提取json
 */

let file = []
try {
  let res = fs.readFileSync(jsurl)
  res = res.toString().split('=')[1]
  file.push(...JSON.parse(res))
} catch (error) {
}

fs.readdirSync(dir).forEach((res) => {
  if (res.match(/Export/)) {
    let dir1 = path.join(dir, res)
    fs.readdirSync(dir1).forEach((res1) => {
      if (res1.match(/\.json/)) {
        let dir2 = path.join(dir, res, res1)
        let data = JSON.parse(fs.readFileSync(dir2))
        // 处理json
        data = data?.messages.filter((item) => item.photo).map((item) => {
          let oldPath = path.join(dir1, item.photo)
          let newPath = path.join(item.photo)
          renameFile(oldPath, newPath)
          return { from: item.from, photo: item.photo }
        })
        file.push(...data)
      }
    })
  }
})
fs.writeFileSync(jsurl, `${jsvar}${JSON.stringify(file)}`)

// 移动图片
function renameFile(oldPath, newPath) {
  try {
    fs.renameSync(oldPath, newPath)
  } catch (error) {
  }
}
