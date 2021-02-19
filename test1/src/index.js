//webpack入口文件
import './style/index.css'
import './style/test1.less'

//Symbol 引用
import './font/font_0xas4kzb5juk/iconfont.js'
//font-class 引用
import './font/font_0xas4kzb5juk/iconfont.css'
//Symbol、Unicode 引用
import './style/iconfont.css'

import data from "./json/data.json"
console.log(data)

function add(x, y) {
  return x + y;
}

console.log(add(1,2))