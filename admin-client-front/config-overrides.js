const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(
  // Implement on-demand packaging for Antd: package according to import (using babel-plugin-import)
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,  // 自动打包相关的样式
  }),

  // Use less-loader to redesignate Less variables in the code
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#1DA57A'},
  }),
)