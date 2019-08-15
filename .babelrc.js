module.exports = {
  presets: [
    require('@babel/preset-env')
  ],
  plugins: [
    'transform-async-to-promises'
  ],
  ignore: [
    'dist/*.js',
    'packages/**/*.js'
  ]
}
