const _ = require('lodash');
const appConfig = require('./config/main.js');
const appConfigDev = require('./config/dev.js');
const appConfigProduction = require('./config/production.js');
var webpack = require('webpack');
var path = require('path');
require('babel-polyfill');
const ENV = process.env.NODE_ENV || 'dev';

function composeConfig(env) {
  if (env === 'dev') {
    return _.merge({}, appConfig, appConfigDev);
  }

  if (env === 'production') {
    return _.merge({}, appConfig, appConfigProduction);
  }
  console.log(env + 'env');
}

var DIST_DIR = path.resolve(__dirname,'dist');
var SRC_DIR = path.resolve(__dirname,'src');

var config = {
    entry:['babel-polyfill',SRC_DIR+'/app/index.js'],
    output:{
        path:DIST_DIR+"/app",
        filename:"bundle.js",
        publicPath:"/app"
    },
    plugins: [
    new webpack.DefinePlugin({
      __APP_CONFIG__: JSON.stringify(composeConfig(ENV))
    })
  ],
  module:{
        loaders:[
            {
                test:/\.js$/,
                include:SRC_DIR,
                exclude:/node_modules/,
                loader:'babel-loader',
                query:{
                    presets:['react','es2015','stage-2']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
            }
        ]

    },

    node:{
      fs: 'empty',
       child_process: "empty"

    }
}


module.exports= config;
