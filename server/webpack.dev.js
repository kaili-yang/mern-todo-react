
module.exports = {
 mode: 'development',
 entry: __dirname + "/src/index.js", // 唯一入口文件
 output: {
     path: __dirname + "/dist", // 打包后的文件存放的路径
     filename: "bundle.js" // 打包后输出文件的文件名
 },
 module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        } 
      }
    },
  ]
}
};
