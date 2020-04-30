const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

const dev = process.env.NODE_ENV ? true : false;

let config = {
  target: "web",
  mode: dev ? 'development' : 'production',
  watch: dev,
  optimization: {
    minimize: !dev,
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
  },
  entry: {
    main: ["./app/index.js"]
  },
  output: {
    filename: '[name].js',
    // filename: dev ? '[name].js' : '[name].[hash].js',
    // chunkFilename: dev ? '[id].js' : '[id].[hash].js',
    path: path.resolve('./dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [{
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            emitWarning: true,
          }
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: 'babel-loader'
      },
      {
        test: /\.ejs$/,
        use: ['ejs-loader']
      },
      {
        test: /\.css$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: dev,
              reloadAll: true
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
          }
        ],
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      // filename: dev ? '[name].css' : '[name].[hash].css',
      // chunkFilename: dev ? '[id].css' : '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: "app/index.ejs"
    }),
    new FaviconsWebpackPlugin({
      logo: './app/logo.png',
      favicons: {
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          appleStatusBarStyle: "black",
          coast: true,
          favicons: true,
          firefox: true,
          windows: true,
          yandex: true
        }
      }
    })
    // ,
    // new WorkboxPlugin.GenerateSW({
    //   clientsClaim: true,
    //   skipWaiting: true,
    // })
  ]
}

module.exports = config
