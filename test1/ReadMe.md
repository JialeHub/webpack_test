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
                type: 'assets/resource',
            },
    
    4.打包其他资源
    
        * 字体 阿里巴巴

        * 5.x:
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'assets/resource',
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
    "browserslist": {
        "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
        ],
        "production": [
            ">0.01%",
            "not dead",
            "not op_mini all"
        ]
    }
    * 或用.browserslistrc文件
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

        * BabelMinifyWebpackPlugin(弃用 不推荐)

        * TerserWebpackPlugin（5.x自带，不兼容 IOS10）
            https://webpack.docschina.org/plugins/terser-webpack-plugin/

**html压缩处理**
    
    *配置HtmlWebpackPlugin


**性能优化**

    # webpack性能优化
        * 开发模式
            - 优化打包构建速度
            - 优化代码调试
        * 生产模式
            - 优化打包构建速度
            - 优化代码运行性能


**HMR**

    HMR：hot module replacement 热模块替换
        作用：一个模块发生变化，只会重新打包这一个模块，而不是重新打包所有模块
        极大提升构建速度

    5.x只编译不更新：
        https://github.com/webpack/webpack-dev-server/issues/2758

    样式文件：可以使用HMR，因为style-loader内部实现了
    js文件：默认不能用HMR，会全部重新加载，需要修改js代码，添加支持HMR功能的代码
        HMR功能对js处理，只能处理非入口js文件的其他文件
    html文件：默认不能用HMR，不会重新加载，同时导致html文件不能热更新，不用做HMR
        解决：修改entry入口，将html文件引入(未解决：需要html-loader，但html-loader与HtmlWebpackPlugin的冲突)


**Source Map**

    source-map:一种提供源代码到构建后代码映射技术（如果构建后代码出错了，通过映射可以追踪源代码错误)
    https://webpack.docschina.org/guides/development/#using-source-maps
    https://webpack.docschina.org/configuration/devtool/

    [inline-|hidden-|eval-|nosources-|] [cheap-[module-]] source-map

    Source-map:外部
        错误代码准确信息和源代码的错误位置
    inline-source-map:内联
        只生成一个内联source-map
        错误代码准确信息和源代码的错误位置
    hidden-source-map:外部
        错误代码错误原因，但是没有错误位置
        不能追踪源代码错误，只能提示到构建后代码的错误位置
    eval-source-map:内联
        每一个文件都生成对应的source-map，都在eval错误代码准确信息和源代码的错误位置
    nosources-source-map:外部
        错误代码准确信息，但是没有任何源代码信息cheap-source-map:外部
        错误代码准确信息和源代码的错误位置只能精确的行
    cheap-source-map:外部
        错误代码准确信息和源代码的错误位置只能精确的行
    cheap-module-source-map:外部
        错误代码准确信息和源代码的错误位置module会将loader的source map加入

    内联和外部的区别:1．外部生成了文件，内联没有2．内联构建速度更快

    开发环境：速度快/调试友好
        速度快：eval>inline>cheap>...
            eval-cheap-source-map
            eval-source-map
        调试更友好
            source-map
            cheap-module-source-map
            cheap-source-map

    生产模式：源码保密/调试友好
        内联让代码变大，生产模式通常不用
        源码保密：
            nosources-source-map    全部隐藏
            hidden-source-map   只隐藏构建后代码

        调试更友好：
            source-map
            cheap-module-source-map
    
**oneOf**

    oneOf下的loader只会匹配一个，提高性能
    注意:不能有两个配置处理同一种类型文件

**缓存**

    * Babel缓存 让第二次打包构建速度更快
        cacheDirectory: true
        https://webpack.docschina.org/loaders/babel-loader/#babel-loader-is-slow

    * 文件资源缓存 让代码上线运行缓存更好使用
        文件名上加hash：
            问题：js和css同时使用一个hash值，重新打包缓存将全部失效
        文件名上加chunkhash：
            根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
            问题：因为css是在js中被引入的，所以同属于一个chunk，js和css的hash值还是一样的
        文件名上加contenthash：
            根据文件的内容生成hash值。不同文件hash值一定不一样


**tree shaking**

    https://webpack.docschina.org/guides/tree-shaking/
    * 去除无用代码，减少体积
    * 前提：1.必须使用ES6模块化 2.开启production环境
    * 将文件标记为 side-effect-free(无副作用)
        通过 package.json 的 "sideEffects" 属性
        "sideEffects": true 或
        "sideEffects": ["./src/some-side-effectful-file.js"]


**splitChunks**

    * 可以将node_modules中代码单独打包一个chunk最终输出,自动分析多入口Chunk中有无公共文件，如果有将单独打包成一个Chunk



**未解决的问题**
    
    1.html-loader与HtmlWebpackPlugin的冲突
        问题：不能在html直接使用src资源、不能配合使用<%= %>
        临时方法：取消html-loader,改为index.ejs为模板

