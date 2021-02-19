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

// eslint-disable-next-line
console.log(data);

const add = (x, y) => x + y;

// eslint-disable-next-line
console.log(add(1, 2));

const PromiseTest = new Promise((resolve) => {
  setTimeout(() => {
    // eslint-disable-next-line
    console.log('定时器1秒');
    resolve();
  }, 1000);
});

// eslint-disable-next-line
console.log(PromiseTest);
