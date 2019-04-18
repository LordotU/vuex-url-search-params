import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'


const isProd = process.env.NODE_ENV === 'production'
const isOldBuild = process.env.BUILD_TYPE === 'old'

const browsers = {
  actual: [
    'last 2 chrome versions',
    'last 2 edge versions',
    'last 2 firefox versions',
    'last 2 safari versions',
    'last 2 ios versions',
    'last 2 android versions',
  ],
  old: [
    '> 0.25%',
    'ie >= 11',
    'ie_mob >= 11',
    'and_chr >= 40',
    'not op_mini all',
  ],
}

const plugins = [
  resolve(),
  babel({
    babelrc: false,
    exclude: 'node_modules/**',
    plugins: [
      'lodash',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }],
    ],
    presets: [[
      '@babel/preset-env',
      {
        debug: true,
        targets: {
          browsers: isOldBuild ? browsers.old : browsers.actual,
        },
        useBuiltIns: 'usage',
      },
    ]],
  }),
  commonjs(),
]

if (isProd) {
  plugins.push(terser())
}


export default {
  input: 'src/index.js',
  output: {
    file: `build/index${isOldBuild ? '.old' : ''}.js`,
    format: 'umd',
    name: 'VueURLSearchParams',
    sourcemap: ! isProd,
  },
  plugins,
}
