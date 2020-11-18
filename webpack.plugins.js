const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const path = require('path');

const plugins = ({
  dev,
  name,
  ejsEntry,
  outputName,
  inject,
  isFavicon
}) => {
  const pluginsArray = [
    new MiniCssExtractPlugin({
      filename:  `${name}.css`,
    }),
    new HtmlWebpackPlugin({
      filename: outputName,
      inject: !!inject,
      template: path.resolve(__dirname, ejsEntry),
    })
  ];

  if (!!isFavicon) pluginsArray.push(
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, './app/logo.png'),
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
  );
  return pluginsArray;
}

module.exports = plugins;
