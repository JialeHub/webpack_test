if(!self.define){const t=t=>{"require"!==t&&(t+=".js");let e=Promise.resolve();return s[t]||(e=new Promise((async e=>{if("document"in self){const s=document.createElement("script");s.src=t,document.head.appendChild(s),s.onload=e}else importScripts(t),e()}))),e.then((()=>{if(!s[t])throw new Error(`Module ${t} didn’t register its module`);return s[t]}))},e=(e,s)=>{Promise.all(e.map(t)).then((t=>s(1===t.length?t[0]:t)))},s={require:Promise.resolve(e)};self.define=(e,i,n)=>{s[e]||(s[e]=Promise.resolve().then((()=>{let s={};const r={uri:location.origin+e.slice(1)};return Promise.all(i.map((e=>{switch(e){case"exports":return s;case"module":return r;default:return t(e)}}))).then((t=>{const e=n(...t);return s.default||(s.default=e),s}))})))}}define("./service-worker.js",["./workbox-224ec2e5"],(function(t){"use strict";self.skipWaiting(),t.clientsClaim(),t.precacheAndRoute([{url:"./assets/jquery/jquery.js",revision:"cb61d2c8151684c989320a8361277f74"},{url:"./assets/jquery/jquery.js.LICENSE.txt",revision:"0c9d021adf77a110c7f9cfb736d11277"},{url:"./index.html",revision:"577a7a435fde49fc3ca86dc5c643abf5"},{url:"./static/css/index_cbe77ed663.css",revision:null},{url:"./static/fonts/iconfont_1d5cb2a072.eot",revision:null},{url:"./static/fonts/iconfont_1d5cb2a072.eot?t=1613640462608",revision:null},{url:"./static/fonts/iconfont_522926cf10.ttf",revision:null},{url:"./static/fonts/iconfont_522926cf10.ttf?t=1613640462608",revision:null},{url:"./static/fonts/iconfont_ccacf2e07b.woff2",revision:null},{url:"./static/fonts/iconfont_d8eb12c2b5.woff",revision:null},{url:"./static/fonts/iconfont_d8eb12c2b5.woff?t=1613640462608",revision:null},{url:"./static/img/b_1d09f6f1b0.jpg",revision:null},{url:"./static/img/c_7a43f23cde.png",revision:null},{url:"./static/js/722_b218c5b61c.bundle.js",revision:null},{url:"./static/js/index_c6149377a0.bundle.js",revision:null},{url:"./static/js/myMath_8c0f8c66a4.bundle.js",revision:null},{url:"./static/js/test_4e271bc7f6.bundle.js",revision:null}],{})}));
//# sourceMappingURL=service-worker.js.map