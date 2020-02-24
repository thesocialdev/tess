// webpack.functions.js
module.exports = {
  optimization: { minimize: false },
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".tsx", ".js", ".json"],
    symlinks: true
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: "javascript/auto"
      }
    ]
  }
};
