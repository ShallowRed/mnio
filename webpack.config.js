const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

  target: "web",

  mode: 'production',
  // mode: 'none',
  // mode: 'development',

  entry: {
    main: ["./src/index.js"]
  },

  output: {
    filename: '[name].js',
    path: path.resolve('./dist'),
    publicPath: '/dist/'
  },

  module: {
    rules: [{
        test: /\.ejs$/,
        use: ['ejs-loader']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: "src/index.ejs"
    })
  ]

}
