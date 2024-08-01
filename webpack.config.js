const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // ...
  entry: "./js/test.js",
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            unused: true,
            dead_code: true,
          },
        },
      }),
    ],
  },
  mode: "production"
};