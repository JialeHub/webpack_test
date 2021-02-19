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

//设置nodejs的环境变量
process.env.NODE_ENV = 'production'

module.exports = {
  mode: 'development',
  // mode:'production',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'dist'),
    assetModuleFilename: 'asset/[hash:10][ext][query]'//自定义输出文件名
  },
  //loader的配置
  module: {
    rules: [
      {
        test: /\.css$/i, //正则匹配文件
        exclude: /iconfont\.css$/i,
        //要使用的loader，执行顺序：从右到左，从下到上，依次执行
        use: [
          // 'style-loader',//创建style标签，将js中的样式资源插入head标签
          MiniCssExtractPlugin.loader,//取代style-loader，提取js中的CSS成单独文件
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
      },
      {
        test: /iconfont\.css$/i,
        use: [
          'style-loader',//创建style标签，将js中的样式资源插入head标签
          'css-loader'
        ]
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          // MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'//将less文件编译成css文件
        ]
      },
      // 5.x前
      /*{
        test: /\.(jpg|png|gif)$/i,
        loader: 'url-loader',//需要下载url-loader file-loader
        options: {
          limit: 16 * 1024, // 图片大小小于16Kb，被base64处理，减少请求数量减轻服务器压力，但文件体积更大文件请求速度更慢
          name: '[hash:10].[ext]', // 图片重命名 [hash:10]取hash前十位，[ext]原扩展名
          // 4.x 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs处理，解析会出现[object Module]
          // esModel:false, //解决：关闭esModel，采用commonjs
        }
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',//处理html文件的img图片（负责引入img,从而被url-loader处理）
      },
      //打包其他资源(除了css/js/html/less)
      {
        //排除css/js/html资源
        exclude: /\.(js|html|css|less|jpg|png|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
        }
      }*/
      // 5.x+
      {
        test: /\.(woff|woff2|eot|ttf|otf|jpeg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(svg)$/i,
        type: 'asset/inline'
      },
      {
        test: /\.(png|jpg|gif)$/i,
        //如需从 asset loader 中排除来自新 URL 处理的 asset，请添加 dependency: { not: ['url'] } 到 loader 配置中。
        dependency: { not: ['url'] },
        //当在 webpack 5 中使用旧的 assets loader（如 file-loader/url-loader/raw-loader 等）和 asset 模块时，你可能想停止当前 asset 模块的处理，并再次启动处理，这可能会导致 asset 重复，你可以通过将 asset 模块的类型设置为 'javascript/auto' 来解决。
        type: 'javascript/auto',
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 16 * 1024,
              name: '[hash:10].[ext]',
              outputPath: 'img'
            },
          },
        ],
      },
      /*{
        test: /\.html$/i,
        type: 'javascript/auto',
        use: [
          {
            loader: 'html-loader',//https://webpack.docschina.org/loaders/html-loader/
          },
        ],
      },*/
      /*
      {
        test: /\.html/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash:10][ext][query]'//所有 html 文件都将被发送到输出目录中的 static 目录中
        }
      }*/
    ],
  },
  //插件
  plugins: [
    // 创建一个html文件，自动引入打包输出的所有资源(js/css)
    new CleanWebpackPlugin(),
    new CssMinimizerPlugin(),
    new MiniCssExtractPlugin({
      filename:'css/[name].css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html' //模板
    }),
    new ESLintPlugin(options),
  ],

  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    compress: true,//启用gzip压缩
    port: 3000, //端口
  }
}