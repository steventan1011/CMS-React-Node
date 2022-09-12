const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(
  // Implement on-demand packaging for Antd: package according to import (using babel-plugin-import)
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),

  // Use less-loader to redesignate Less variables in the code
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {'@primary-color': '#1DA57A'},
    }
  }),
)