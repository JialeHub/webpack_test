**Webpack命令全局安装：**

    npm i webpack webpack-cli -g

**添加到开发依赖：**

    npm i webpack webpack-cli -D

**运行指令**

    * 开发环境： webpack ./src/index.js -o ./build --mode=development
        webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到./build/built.js整体打包环境，是开发环境

    * 生产环境： webpack ./src/index.js -o ./build --mode=production
        webpack会以 ./src/index.js为入口文件开始打包，打包后输出到./build/built.js整体打包环境，是生产环境


**结论**
    
    1.webpack能处理js/json资源，不能处理css/img等其他资源
    2.生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化~
    3.生产模式比开发环境多了压缩


**引入资源**

    1.打包样式资源
    
        * CSS: npm i css-loader style-loader -D
    
        * less: 
            npm install -g less
            npm i css-loader style-loader less-loader -D
    
        * 配置webpack.config.js
    
        * 执行 webpack

    2.打包html资源
        
        * html-webpack-plugin: npm i html-webpack-plugin -D
    
    3.打包图片资源
        
        * url-loader file-loader

        * 5.x:
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
    
    4.打包其他资源
    
        * 字体 阿里巴巴

        * 5.x:
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
          },

    5.总结

        https://webpack.docschina.org/guides/asset-modules/#resource-assets

        在 webpack 5 之前，通常使用：
            raw-loader 将文件导入为字符串
            url-loader 将文件作为 data URI 内联到 bundle 中
            file-loader 将文件发送到输出目录

        资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：
            asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
            asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
            asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
            asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
            
        5.x后可用资源模块(asset module)无需配置额外loader
        5.x之前通常使用loader

        当在 webpack 5 中使用旧的 assets loader（如 file-loader/url-loader/raw-loader 等）和 asset 模块时，
        你可能想停止当前 asset 模块的处理，并再次启动处理，这可能会导致 asset 重复，你可以通过将 asset 模块的类型设置为 'javascript/auto' 来解决。

        排除：如需从 asset loader 中排除来自新 URL 处理的 asset，请添加 dependency: { not: ['url'] } 到 loader 配置中。


**devServer**

    * 作用：开发服务器 devServer ：自动编译，打开浏览器，刷新浏览器...
    * 只会在内存中编译打包
    * 安装： npm install -D webpack-dev-server
    * 升级： npm update
    * 运行：
        webpack //将打包结果输出
        npx webpack-dev-server //只会在内存中编译打包，没有输出
        webpack serve  (5.x)


**清理dist文件夹**

    * 采用CleanWebpackPlugin插件 
    * npm install --save-dev clean-webpack-plugin

**提取样式文件**

    * 使用mini-css-extract-plugin插件
    * npm i mini-css-extract-plugin -D

**CSS兼容性处理**
    
    * 使用postcss --> postcss-loader postcss-preset-env postcss
    * npm i postcss-loader postcss-preset-env -D
    * 帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式
    https://webpack.docschina.org/loaders/postcss-loader/

**CSS压缩处理**

    * 4.x使用optimize-css-assets-webpack-plugin
    * 5.x使用css-minimizer-webpack-plugin
        https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/

**代码检查EsLint**

    loader(废弃)：npm install eslint-loader eslint --D
    插件(推荐)：EslintWebpackPlugin
        npm install eslint --global
        npm install eslint-webpack-plugin eslint --D
        https://webpack.docschina.org/plugins/eslint-webpack-plugin/
    
    使用airbnb风格
        https://www.npmjs.com/package/eslint-config-airbnb-base
        5.x：npx install-peerdeps --dev eslint-config-airbnb-base

    配置文件：
        .eslintrc.js(运行eslint --init可生成)
        .eslintignore

    忽略下一行
        eslint-disable-next-line

**JS兼容性处理**

    babel
        https://www.babeljs.cn/setup#installation
        https://webpack.docschina.org/loaders/babel-loader/
        npm install --save-dev babel-loader @babel/core @babel/preset-env
    
    基本JS兼容处理：@babel/preset-env(Promise不兼容)

    全部js兼容性处理：
        旧版且庞大不推荐 npm i @babel/polyfill -D

    按需js兼容性处理
        新版推荐(Babel 7.4+)  
            npm i core-js regenerator-runtime -S
            import "core-js/stable";
            import "regenerator-runtime/runtime";
        
    使用配置文件：babel.config.json
        https://babeljs.io/docs/en/config-files#root-babelconfigjson-file


**JS压缩处理**

    * 生产模式自动压缩
    * 更多选择：
        * UglifyjsWebpackPlugin (4.x)
            https://webpack.docschina.org/plugins/uglifyjs-webpack-plugin/
            npm install uglifyjs-webpack-plugin --save-dev

        * BabelMinifyWebpackPlugin(Beta 不推荐)

**html压缩处理**
    
    *配置HtmlWebpackPlugin


    