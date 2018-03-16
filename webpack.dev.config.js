const path = require('path')
const configs = require('./src/config/base')
const webpack = require('webpack')
const glob = require("glob");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

    // const GenerateAssetPlugin = require('generate-asset-webpack-plugin');
    //css压缩
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//提取css
const extract = new ExtractTextPlugin({
    filename: 'css/[name].css'
    //allChunks: true  /* 没有引用公共的css样式时 这个属性不能带 */
})
const autoprefixer = require('autoprefixer')({ browsers: ['iOS >= 7', 'Android >= 4.1'] })
const IS_ENV = process.env.NODE_ENV == 'production';
let jsName = 'js/[name].js';
let publicPath = configs.devServerPath;

// 提供公共代码块 CommonsChunkPlugin
// 实现作用域提升 ModuleConcatenationPlugin  webpack3新增
//根据路径生成唯一的module_id    HashedModuleIdsPlugin
//minChunks:Infinity 只会被打包到对应的name中，其他chunk不会被打包  [hash:8]
let plugins = [ extract,new webpack.optimize.CommonsChunkPlugin({name:'verdor',minChunks:Infinity}),new webpack.optimize.CommonsChunkPlugin({ names: ['common' /* ,'components' */  ], minChunks: 2 }), new webpack.optimize.ModuleConcatenationPlugin(),
new webpack.DefinePlugin({'process.env.ASSET_PATH': JSON.stringify(publicPath)})];




function ExtractCssOrJs(regStr,fl,sourceArr){
    
    let fileTotal = glob.sync(regStr);
    fileTotal.forEach(function(f,index){
      let same = false;
      for(let item of fl){
  
        if(f.split("/").indexOf(item)>-1){
          same = true;
          break;
        }
      }
      if(!same) sourceArr[sourceArr.length] = f;
    });
    
  }
  
  let components = [];
  let filterList = ["area_cn.js","lazyload.js","swiper.min.js","base.js"];
  let filesCom = './src/@(verdor|manager|config)/*.js';
  ExtractCssOrJs(filesCom,filterList,components);



module.exports = {
    target: 'web',
    entry: {"main":"./src/main.js? ",verdor:["vue","vuex","vue-router",'babel-polyfill']},
    output: {
        filename: jsName,
        path: path.resolve(__dirname, `${configs.dest}static`),
        publicPath,
        chunkFilename: 'js/async/[name].js'
            // libraryExport: 'default'// 新配置  异步导入时就不需要使用.default再取一层了
    },
    module: {
        rules: [{
                test: /\.js$/,
                // use: ['babel-loader', 'eslint-loader']
                use: ['babel-loader'],
                // exclude: /node_modules/  
            },
            {
                test: /\.vue$/,
                use: [{
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                css: ExtractTextPlugin.extract({
                                    use: ['css-loader'], //需要什么样的loader去编译文件
                                    fallback: 'vue-style-loader' //编译后用什么loader来提取css文件
                                }),
                                less: ExtractTextPlugin.extract({
                                    use: ['css-loader', 'less-loader'],
                                    fallback: 'vue-style-loader'
                                }),
                                sass: ExtractTextPlugin.extract({
                                    use: ['css-loader', 'sass-loader'],
                                    fallback: 'vue-style-loader'
                                })
                            },
                            postcss: [autoprefixer] //工具,autoprefixer插件:CSS补全浏览器前缀
                        }
                    },
                    // 'eslint-loader'
                ]
            },
            {
                test: /\.css$/,
                use: extract.extract([
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer]
                        }
                    }
                ])
            },
            {
                test: /\.less$/,
                use: extract.extract([
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer]
                        }
                    },
                    'less-loader'
                ])
            },
            {
                test: /\.(sass|scss)$/,
                use: extract.extract([
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer]
                        }
                    },
                    'sass-loader'
                ])
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2|)(\?|$)/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'iconfont/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 2000,
                        name:  function(...args){
                            // 如果不用args出来的路径是错误的
                            //str 为全路径名字  防止引用不同目录下图片名相同,打包之后重叠的问题
                            let path = args[0].split("\\").slice(-2,-1) + "";
                            return "images/"+path+"/[name].[ext]";
                        }
                    }
                }]
            },
            {
                test: /\.json$/,
                use: [{
                    loader: 'json-loader',
                    options: {
                        name: 'json/[name].json'
                    }
                }]
            }
        ]
    },
    plugins: plugins,
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'configs$': path.resolve(__dirname, 'src/config/base.js'), //程序的一些基本配置
            'src': path.resolve(__dirname, 'src')
        },
        extensions: ['.js', '.vue', '.json']
    },
    devtool: IS_ENV ? false : 'source-map'
        // devtool: IS_ENV ? false : '#cheap-module-eval-source-map'
}






