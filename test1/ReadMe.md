### Webpack命令全局安装：

    npm i webpack webpack-cli -g

### 添加到开发依赖： 

    npm i webpack webpack-cli -D

### 运行指令 

    * 开发环境： webpack ./src/index.js -o ./build --mode=development
        webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到./build/built.js整体打包环境，是开发环境

    * 生产环境： webpack ./src/index.js -o ./build --mode=production
        webpack会以 ./src/index.js为入口文件开始打包，打包后输出到./build/built.js整体打包环境，是生产环境

### 结论 
    
    1.webpack能处理js/json资源，不能处理css/img等其他资源
    2.生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化~
    3.生产模式比开发环境多了压缩

### 引入资源 

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

### devServer 

    * 作用：开发服务器 devServer ：自动编译，打开浏览器，刷新浏览器...
    * 只会在内存中编译打包
    * 安装： npm install -D webpack-dev-server
    * 升级： npm update
    * 运行：
        webpack //将打包结果输出
        npx webpack-dev-server //只会在内存中编译打包，没有输出
        webpack serve  (5.x)

### 清理dist文件夹 

    * 采用CleanWebpackPlugin插件 
    * npm install --save-dev clean-webpack-plugin

### 提取样式文件 

    * 使用mini-css-extract-plugin插件
    * npm i mini-css-extract-plugin -D

### CSS兼容性处理 
    
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

### CSS压缩处理 

    * 4.x使用optimize-css-assets-webpack-plugin
    * 5.x使用css-minimizer-webpack-plugin
        https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/

### 代码检查EsLint 

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

### JS兼容性处理 

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

### JS压缩处理 

    * 生产模式自动压缩
    * 更多选择：
        * UglifyjsWebpackPlugin (4.x)
            https://webpack.docschina.org/plugins/uglifyjs-webpack-plugin/
            npm install uglifyjs-webpack-plugin --save-dev

        * BabelMinifyWebpackPlugin(弃用 不推荐)

        * TerserWebpackPlugin（5.x自带，不兼容 IOS10）
            https://webpack.docschina.org/plugins/terser-webpack-plugin/

### html压缩处理 
    
    *配置HtmlWebpackPlugin

### 性能优化 

    # webpack性能优化
        * 开发模式
            - 优化打包构建速度
                * HMR
            - 优化代码调试
                * source-map
        * 生产模式
            - 优化打包构建速度
                * oneOf
                * babel缓存
                * 多进程打包
                * CDN加速 | externals
                * dll
            - 优化代码运行性能
                * 资源缓存
                * tree shaking
                * 代码分割 | splitChunks
                * 懒加载 预加载
                * PWA 离线访问

### HMR 

    HMR：hot module replacement 热模块替换
        作用：一个模块发生变化，只会重新打包这一个模块，而不是重新打包所有模块
        极大提升构建速度

    5.x只编译不更新：
        https://github.com/webpack/webpack-dev-server/issues/2758

    CSS样式文件：
        开发用style-loader,内部实现了，生产用MiniCssExtractPlugin
    js文件：默认不能用HMR，会全部重新加载，需要修改js代码，添加支持HMR功能的代码
        HMR功能对js处理，只能处理非入口js文件的其他文件
    html文件：默认不能用HMR，不会重新加载，同时导致html文件不能热更新，不用做HMR
        解决：修改entry入口，将html文件引入(未解决：需要html-loader，但html-loader与HtmlWebpackPlugin的冲突)

### Source Map 

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

### oneOf 

    oneOf下的loader只会匹配一个，提高性能
    注意:不能有两个配置处理同一种类型文件

### 缓存 

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

### tree shaking 

    https://webpack.docschina.org/guides/tree-shaking/
    * 去除无用代码，减少体积
    * 前提：1.必须使用ES6模块化 2.开启production环境
    * 将文件标记为 side-effect-free(无副作用)
        通过 package.json 的 "sideEffects" 属性
        "sideEffects": true 或
        "sideEffects": ["./src/some-side-effectful-file.js"]

### 代码分割 | splitChunks 

    * 可以将node_modules中代码单独打包一个chunk最终输出,自动分析多入口Chunk中有无公共文件，如果有将单独打包成一个Chunk

### 懒加载 
    
    * 正常加载可以认为是并行加载（同一时间加载多个文件)
    * 懒加载：当文件需要使用才加载（import）
        https://webpack.docschina.org/guides/lazy-loading/
    * 预加载webpackPrefetch:会在使用之前，提前加载js文件，预加载prefetch:等其他资源加载完毕，浏览器空闲了，再偷偷加载资源，兼容性较差
        https://webpack.docschina.org/guides/code-splitting/#prefetchingpreloading-modules

### PWA 

    * 渐进式网络开发应用程序（离线可访问）
        https://webpack.docschina.org/guides/progressive-web-application/#root

    * Workbox
        npm install workbox-webpack-plugin --save-dev

    * 必须运行在服务器上
        快速服务器：npm i serve -g
            serve -s dist

### 多进程打包 

    * npm i -D thread-loader
    * 给babel使用thread-loader
    * 进程启动大概为60oms，进程通信也有开销，只有工作消耗时间比较长，才需要。

### CDN加速 | externals 

    * 拒绝|忽略包
        https://webpack.docschina.org/configuration/externals/#root
    * html标签插入CDN

### dll 

    * 使用dll技术，对某些库（第三方库: jquery、react、vue.. .）进行单独打包
        https://webpack.docschina.org/plugins/dll-plugin/#root

    * 需要配置webpack.dll.js的DllPlugin插件、webpack.config.js的DllReferencePlugin插件

    * 当你运行webpack 时，默认查找webpack.config.js 配置文件
        需求:需要运行webpack.dll.js 文件
            webpack --config webpack.dll.js
        生成dll文件夹

    * 4.x: npm i add-asset-html-webpack-plugin -D
    * 5.x: copy-webpack-plugin复制 + html-webpack-deploy-plugin引入
        npm install copy-webpack-plugin html-webpack-tags-plugin --D
        https://webpack.docschina.org/plugins/copy-webpack-plugin/

### webpack配置详解介绍

    entry: 入口起点
        1.string '...' 
            单入口，打包形成一个chunk,输出一个bundle文件,默认名称为main
        2.Array [...] 
            多入口，所有入口文件最终只会形成一个chunk，输出出去只有一个bundle文件。
            一般用于HMR功能让html热更新生效
        3.Object {...} 
            多入口，有几个入口文件就形成几个chunk，输出几个bundle文件
            此时chunk的名称是key

    //输出
    output:  
        {
            filename:文件名称（指定名称+目录)
            path:输出文件目录（将来所有资源输出的公共目录)
            publicPath:所有资源引入公共路径前缀  '' | '/' | './' ==> 'imgs/a.jpg' | '/imgs/a.jpg' | './imgs/a.jpg'
            chunkFilename:非入口chunk的名称
            library:整个库向外暴露的变量名
            libraryTarget:变量名添加到哪里  'window' | 'global' | commonjs | ... ==> browser | node | ...
            assetModuleFilename:非编译文件自定义输出文件名
        }

    module:{
        rules:[
            //loader配置
            {
                test: /\.css$/i  正则匹配
                exclude: /node_modules/  //正则排除
                include: resolve(__dirname, 'src ' ) //只检查某个路径
                enforce: 'pre',//执行优先级 pre优先 post延后
                loader: '单个loader'
                options: {...配置}
            },
            {
                test: 正则匹配
                //多个loader用use
                use:[]
            },
            {
                //以下配置只用一个
                oneOf:[]
            }
        ]
    }

    //配置解析模块规则
    resolve:{
        
        alias:{}//配置解析模块路径别名
        extensions:[]//配置省略文件路径的后缀名
        modules:[]//告诉 webpack 解析模块是去找哪个目录
    }

    开发服务器
    devServer: {
        contentBase: resolve(__dirname, 'dist'),//运行代码的目录
        compress: true,//启用gzip压缩
        port: 3000, //端口
        host: 'localhost',//域名
        disableHostCheck: true,//禁用域名检查
        hot: true,//开启HMR
        hotOnly: true,// hot 和 hotOnly 的区别是在某些模块不支持热更新的情况下，前者会自动刷新页面，后者不会刷新页面，而是在控制台输出热更新失败
        watchContentBase: true,//监视contentBase目录下的所有文件，一旦文件变化就会reload
        watchOptions:{
          ignore:/node_modules/,//忽略监视文件
        },
        clientLogLevel: 'none',//不要显示启动服务器日志信息
        quiet:true,//除了一些基本启动信息以外，其他内容都不要显示
        overlay:false, //出错了不要全屏提示
        proxy:{//代理服务器
          '/api':{  //反向代理
            target:'http://localhost:3000', //目标服务器
            changeOrigin: true,//允许不同源跨域
            pathRewrite:{
              '^/api':''//发送请求时，请求路径重写:将/api/xxx -->/xxx(去掉/api)
            }
          }
        },
    }

    //优化
    optimization: {
        //可以将node_modules中代码单独打包一个chunk最终输出,自动分析多入口Chunk中有无公共文件，如果有将单独打包成一个Chunk
        splitChunks: {
            chunks: 'all',
            /* 以下配置为默认，可忽略 */
            minSize: 30*1024,//分割的chunk最小为30kb
            maxSize: 0,//最大没有限制
            minChunks: 1,//要提耿的chunk最少被引用1次
            maxAsyncRequests: 5,//按需加载时并行加载的文件的最大数量
            maxInitialRequests: 3,//入口js文件最大并行请求数量
            automaticNameDelimiter: '~',//名称连接符
            // name: true,//可以使用命名规则
            cacheGroups: { //分割chunk的组
                //node_modules文件会被打包到 vendors 组的chunk中。--> vendors~xxx.js
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10 //优先级
                },
                default: {
                    //要提取的chunk最少被引用2次
                    minChunks: 2,
                    priority: -20, //优先级
                    reuseExistingChunk:true,//如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包模块
                }
            }
        },
        //将当前模块的记录其他模块的hash单独打包为一个文件runtime，解决了：修改a文件导致引用它的b文件的contenthash变化（缓存持久化）
        runtimeChunk: {
          name: entrypoint => `runtime-${entrypoint.name}`
        },
        minimize: true,
        minimizer: [
          //生产环境的压缩方案：js和css
          new TerserPlugin({
            parallel: true,//多线程
            terserOptions: {
              compress: {
                drop_console: false//去除console
              }
            }
          })
        ],
    },


### 未解决的问题 
    
    1.html-loader与HtmlWebpackPlugin的冲突
        问题：不能在html直接使用src资源、不能配合使用<%= %>
        临时方法：取消html-loader,改为index.ejs为模板

