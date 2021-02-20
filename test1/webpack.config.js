//所有构建工具(webpack)都是基于nodejs平台运行的~模块化默认采用commonjs

// resolve:用来拼接绝对路径的方法
const {resolve} = require('path');
const webpack = require('webpack');

//loader: 1.下载 2.使用(配置loader)
//plugins: 1.下载 2.引入 3.使用
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

//设置nodejs的环境变量
const isProd = process.env.NODE_ENV === 'production'

// 封装CSS-Loader
const commonCssLoader = [
  //要使用的loader，执行顺序：从右到左，从下到上，依次执行
  // 'style-loader',//创建style标签，将js中的样式资源插入head标签
  //MiniCssExtractPlugin.loader,//取代style-loader，提取js中的CSS成单独文件
  isProd ?
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../../'// publicPath 是资源相对于上下文的相对路径
      }
    } :
    'style-loader',
  'css-loader',//将css文件变成commonjs模块加载js中，里面内容是样式字符串
  // CSS兼容性处理,postcss找到package.json中browserslist里面的配置加载(默认为生产模式，通过设置node环境变量：process.env.NODE_ENV = development)
  'postcss-loader',//使用默认配置或使用postcss.config.js
  /*{
    loader:'postcss-loader',//也可使用此自定义配置 https://webpack.docschina.org/loaders/postcss-loader/
    options:{
      postcssOptions: {
        plugins: [
          ["postcss-preset-env"]
        ]
      }
    }
  }*/
]

/*
* dist文件夹结构
*  dist
*   |-assets文件夹(源码/非编译)
*     |-模块依赖
*   |-static文件夹(资源)
*     |-js
*     |-css
*     |-img
*     |-media
*   |-favicon.ico
*   |-index.html
* */

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: 'source-map',
  //单页面应用
  // entry:'./src/index.js',
  // entry: ['./src/index.js',//'./src/index.html'],
  // 多页面应用
  entry: {
    index: './src/index.js',
    test: './src/test.js',
  },
  output: {
    publicPath: isProd ? './' : '/',//所有资源引入公共路径前缀
    filename: 'static/js/[name]_[contenthash:10].bundle.js',//文件名称（指定名称+目录)
    chunkFilename: 'static/js/[name]_chunk_[contenthash:10].bundle.js',//非入口chunk的文件名称
    path: resolve(__dirname, 'dist'),//输出文件目录（将来所有资源输出的公共目录)
    assetModuleFilename: 'assets/[name]_[contenthash:10][ext][query]',//非编译文件自定义输出文件名
  },
  //优化
  optimization: {
    //可以将node_modules中代码单独打包一个chunk最终输出,自动分析多入口Chunk中有无公共文件，如果有将单独打包成一个Chunk
    splitChunks: {
      chunks: 'all',
      /*minSize: 30*1024,//分割的chunk最小为30kb
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
      }*/
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
  //外部扩展，从CDN获取，拒绝|忽略包
  /*externals: {
    //包名:变量名
    jquery: 'jQuery',
  },*/
  //loader的配置
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        // enforce: 'pre',//优先执行
        use: [
          // 'thread-loader',//开启多进程打包
          /*{
            loader: "thread-loader",
            options: {
              worker: 2//进程数
            }
          },*/
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,// 缓存
              rootMode: "upward",// 使用配置文件babel.config.json
              // 使用此处配置
              /*presets: [],*/
            }
          }
        ]
      },
      {
        //oneOf下的loader只会匹配一个，提高性能，注意:不能有两个配置处理同一种类型文件
        oneOf: [
          {
            test: /\.css$/i, //正则匹配文件
            // exclude: /iconfont\.css$/i,
            use: [...commonCssLoader]
          },
          {
            test: /\.less$/i,
            use: [
              ...commonCssLoader,
              'less-loader'//将less文件编译成css文件
            ]
          },
          // 5.x+ 旧版
          /*{
            test: /\.(png|jpg|gif|jpeg)$/i,
            //如需从 asset loader 中排除来自新 URL 处理的 asset，请添加 dependency: { not: ['url'] } 到 loader 配置中。
            dependency: { not: ['url'] },
            //当在 webpack 5 中使用旧的 asset loader（如 file-loader/url-loader/raw-loader 等）和 asset 模块时，你可能想停止当前 asset 模块的处理，并再次启动处理，这可能会导致 asset 重复，你可以通过将 asset 模块的类型设置为 'javascript/auto' 来解决。
            type: 'javascript/auto',
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 16 * 1024,
                  name: '[name]_[contenthash:10].[ext]',
                  outputPath: 'static/img',
                  // esModule:false
                },
              },
            ],
          },*/
          // 5.x+ 新版 推荐
          {
            test: /\.(png|jpg|gif|jpeg)$/i,
            type: 'asset',//通用资源类型,resource 和 inline(Base64)
            parser: {
              dataUrlCondition: {
                maxSize: 16 * 1024 // 16kb
              }
            },
            generator: {
              filename: 'static/img/[name]_[contenthash:10][ext][query]'
            },
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
            generator: {
              filename: 'static/fonts/[name]_[contenthash:10][ext][query]'
            },
          },
          {
            test: /\.(svg)$/i,
            type: 'asset/inline',
          },
          /*{
            test: /\.html$/i,
            loader: 'html-loader',
          },*/
          /*{
            test: /\.ejs$/i,
            loader: 'ejs-loader',
            options: {
              esModule: false
            }
          },*/
        ]
      }
    ],
  },
  //插件
  plugins: [
    // 创建一个html文件，自动引入打包输出的所有资源(js/css)
    new CleanWebpackPlugin(),
    new CssMinimizerPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name]_[contenthash:10].css',
    }),
    new HtmlWebpackPlugin({
      title: isProd ? 'Webpack-生产模式' : 'Webpack-开发模式',
      template: './src/index.html', //模板
      minify: {
        collapseWhitespace: true,//移除空格,默认true
        removeComments: true,//移除注释,默认true
      }
    }),
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 删除“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
    //告诉webpack哪些库不参与打包，同时使用时的名称也得变~
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json'),
    }),
    new CopyPlugin({
      patterns: [
        {from: "dll/jquery.js", to: 'assets/jquery'}
      ]
    }),
    new HtmlWebpackTagsPlugin({
      scripts: [
        {
          path: 'assets/jquery/jquery.js',
          append: false //head前面插入
        },
      ]
    }),
    new ESLintPlugin({
      fix: true
    }),
  ],
  //解析模块规则
  resolve: {
    //解析模块路径别名
    alias: {
      $css: resolve(__dirname, 'src/style'),
      '@': resolve(__dirname, 'src')
    },
    // 省略文件路径的后缀名,越前越优先
    extensions: ['.js', '.json', '.jsx', '.css'],
    // 告诉 webpack 解析模块是去找哪个目录,越前越优先
    modules: [resolve(__dirname, '../node_modules'), 'node_modules']
  },
  //解决热更新问题
  target: isProd ? "browserslist" : "web",
  devServer: {
    contentBase: resolve(__dirname, 'dist'),//运行代码的目录
    compress: true,//启用gzip压缩
    port: 3000, //端口
    host: 'localhost',//域名
    disableHostCheck: true,//禁用域名检查
    hot: true,//开启HMR
    hotOnly: true,// hot 和 hotOnly 的区别是在某些模块不支持热更新的情况下，前者会自动刷新页面，后者不会刷新页面，而是在控制台输出热更新失败
    watchContentBase: true,//监视contentBase目录下的所有文件，一旦文件变化就会reload
    watchOptions: {
      ignore: /node_modules/,//忽略监视文件
    },
    clientLogLevel: 'info',//日志输出等级 none | error | warning | info(默认)
    quiet: false,//除了一些基本启动信息以外，其他内容都不要显示
    overlay: false, //出错了不要全屏提示
    proxy: {//代理服务器
      '/api': {  //反向代理
        target: 'http://localhost:3000', //目标服务器
        changeOrigin: true,//允许不同源跨域
        pathRewrite: {
          '^/api': ''//发送请求时，请求路径重写:将/api/xxx -->/xxx(去掉/api)
        }
      }
    },
  }
}