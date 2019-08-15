import clear from 'rollup-plugin-clear'
import progress from 'rollup-plugin-progress'
import { eslint } from 'rollup-plugin-eslint'

import externals from 'rollup-plugin-node-externals'
import replace from 'rollup-plugin-replace'

import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'

import pkg from './package.json'

const isProd = process.env.NODE_ENV === 'production'

const banner =
  '/*!\n' +
  ` * ${pkg.name}.js v${pkg.version}\n` +
  ` * (c) 2019-${new Date().getFullYear()} ${pkg.author}\n` +
  ` * Released under the ${pkg.license} License.\n` +
  ' */'

function mergeConfig(baseConfig, configs) {
  const merge = function (config) {
    config.output = Object.assign({}, baseConfig.output, config.output)
    config.external = baseConfig.external
    config.plugins = baseConfig.plugins.concat(config.plugins || [])
    return config
  }

  return Array.isArray(configs) ? configs.map(merge) : merge(configs)
}

const baseConfig = {
  output: {
    banner,
    name: 'ImgResize',
    sourcemap: isProd
  },
  plugins: [
    clear({
      targets: ['dist']
    }),
    progress({
      clearLine: false
    }),
    eslint(),
    replace({
      __VERSION__: `"${pkg.version}"`,
      NODE_ENV: `"${process.env.NODE_ENV}"`
    }),
    externals(),
    resolve(),
    commonjs(),
    json(),
    babel({
      exclude: 'node_modules/**'
    }),
    isProd && filesize()
  ],
  watch: {
    include: 'src/**'
  }
}

export default mergeConfig(baseConfig, [
  {
    input: 'src/index.js',
    output: {
      banner,
      file: `dist/${pkg.name}.esm.js`,
      format: 'es'
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: `dist/${pkg.name}.common.js`,
      format: 'cjs'
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: `./dist/${pkg.name}${isProd ? '.min' : ''}.js`,
      format: 'umd'
    },
    plugins: [
      isProd && terser()
    ]
  }
])
