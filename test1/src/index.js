/* eslint-disable */
// 全部js兼容 (按需js兼容:配置babel-loader即可)
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// webpack入口文件
import './style/index.css';
import './style/test1.less';

// Symbol 引用
import './font/font_0xas4kzb5juk/iconfont';
// font-class 引用
import './font/font_0xas4kzb5juk/iconfont.css';
// Symbol、Unicode 引用
import './style/iconfont.css';

import data from './json/data.json';

import {print} from './js/print';
import $ from 'jQuery'
console.log($)
console.log(process.env.NODE_ENV)

console.log(data);

const add = (x, y) => x + y;

console.log(add(1, 2));

const PromiseTest = new Promise((resolve) => {
  setTimeout(() => {
    console.log('定时器1秒');
    resolve();
  }, 1000);
});

print();
console.log(PromiseTest);

if (module.hot) {
  // 一旦 module.hot为true，说明开启了HMR功能。-->让HMR功能代码生效
  module.hot.accept('./js/print', () => {
    // 方法会监听print.js 文件的变化，一旦发生变化，其他模块不会重新打包构建。
    // 会执行后面的回调函数
    print();
  });
}
