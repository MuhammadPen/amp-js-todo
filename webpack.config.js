const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/app.js",
    auth: "./src/auth.js",
    todo: "./src/todo.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    contentBase: "./dist",
    overlay: true,
    hot: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: ["index.html", "auth.html"],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
