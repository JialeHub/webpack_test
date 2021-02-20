//所有构建工具(webpack)都是基于nodejs平台运行的~模块化默认采用commonjs

// resolve:用来拼接绝对路径的方法
const {resolve} = require('path');

//loader: 1.下载 2.使用(配置loader)
//plugins: 1.下载 2.引入 3.使用
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

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
  entry:{
    index:'./src/index.js',
    test:'./src/test.js',
  },
  output: {
    publicPath: isProd ? './' : '/',
    filename: 'static/js/[name]_[contenthash:10].bundle.js',
    path: resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name]_[contenthash:10][ext][query]'//非编译文件自定义输出文件名
  },
  //优化
  optimization: {
    //可以将node_modules中代码单独打包一个chunk最终输出,自动分析多入口Chunk中有无公共文件，如果有将单独打包成一个Chunk
    splitChunks:{
      chunks:'all'
    },
    minimize: true,
    minimizer: [new TerserPlugin({
      parallel: true,//多线程
      terserOptions: {
        compress: {
          drop_console: false//去除console
        }
      }
    })],
  },
  //loader的配置
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        // enforce: 'pre',//优先执行
        use: {
          loader: "babel-loader",
          options: {
            // 缓存
            cacheDirectory: true,
            // 使用配置文件babel.config.json
            rootMode: "upward",
            // 使用此处配置
            /*presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',//按需加载
                  corejs:{
                    version: 3
                  },
                  targets: {
                    chrome: '60',
                    firefox:'60',
                    ie: '9',
                    safari: '11',
                    edge:'17'
                  }
                }
              ]
            ],*/
          }
        }
      },
      {
        //oneOf下的loader只会匹配一个，提高性能，注意:不能有两个配置处理同一种类型文件
        oneOf:[
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
      title: isProd?'Webpack-生产模式':'Webpack-开发模式',
      template: './src/index.html', //模板
      minify: {
        collapseWhitespace: true,//移除空格,默认true
        removeComments: true,//移除注释,默认true
      }
    }),
    new ESLintPlugin({
      fix: true
    }),
  ],
  //解决热更新问题
  target: isProd ? "browserslist" : "web",
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    compress: true,//启用gzip压缩
    port: 3000, //端口
    hot: true,//开启HMR
  }
}