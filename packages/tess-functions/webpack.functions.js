// webpack.functions.js
module.exports = {
  optimization: { minimize: false },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: "javascript/auto"
      }
    ]
  }
};
