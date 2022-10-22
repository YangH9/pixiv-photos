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
// 图片导出的位置 '' => 'photos/photo……'
let imgurl = './'

/**
 * @description: 提取json
 */
// 文件json数据
let file = []
try {
  // 获取旧导出数据，如果有则读取旧数据
  let res = fs.readFileSync(jsurl)
  res = res.toString().split('=')[1]
  file.push(...JSON.parse(res))
} catch (error) {
}
// 读取导出的全部文件目录
fs.readdirSync(dir).forEach((res) => {
  if (res.match(/Export/)) {
    let dir1 = path.join(dir, res)
    // 获取导出的json文件
    fs.readdirSync(dir1).forEach((res1) => {
      if (res1.match(/\.json/)) {
        // 拼接路径
        let dir2 = path.join(dir, res, res1)
        let data = JSON.parse(fs.readFileSync(dir2))
        // 处理json
        data = data?.messages.filter((item) => item.photo).map((item) => {
          // 拼接新旧路径，移动图片位置
          let oldPath = path.join(dir1, item.photo)
          let newPath = path.join(imgurl, item.photo)
          renameFile(oldPath, newPath)
          return { from: item.from, photo: item.photo }
        })
        file.push(...data)
      }
    })
  }
})
// 写入目标js文件
fs.writeFileSync(jsurl, `${jsvar}${JSON.stringify(file)}`)

// 移动图片
function renameFile(oldPath, newPath) {
  try {
    fs.renameSync(oldPath, newPath)
  } catch (error) {
  }
}
