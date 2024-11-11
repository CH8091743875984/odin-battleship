const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

//consider Terser plugin if we must retain class names

module.exports = {
  mode: "development", //change back to production when ready, to minify the names
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      title: "YOUR NAME HERE - TEMPLATE",
      template: "src/index.html",
    }),
  ],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.gif$/,
        type: 'asset/inline',
      },
      {
        test: /\.(ttf|eot|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {
      config$: './configs/app-config.js',
      react: './vendor/react-master',
    },
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
      'bower_components',
      'shared',
      '/shared/vendor/modules',
    ],
  }
};
