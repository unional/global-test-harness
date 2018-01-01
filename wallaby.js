module.exports = function (wallaby) {
  return {
    "files": [
      { pattern: 'tsconfig.*', instrument: false },
      { pattern: 'fixtures/**', instrument: false },
      "src/**/*.ts",
      "!src/**/*.spec.ts",
      { pattern: 'node_modules/color-map/**', instrument: false },
      { pattern: 'node_modules/lower-case/**', instrument: false },
      { pattern: 'node_modules/global-store/**', instrument: false },
      { pattern: 'node_modules/ts-loader/**', instrument: false },
      { pattern: 'node_modules/aurelia-logging/**', instrument: false },
      { pattern: 'node_modules/aurelia-logging-color/**', instrument: false }
    ],
    "tests": [
      "src/**/*.spec.ts"
    ],
    "env": {
      "type": "node"
    },
    compilers: {
      'src/**/*.ts': wallaby.compilers.typeScript({ module: 'commonjs' }),
    },
    testFramework: 'ava'
  }
}
