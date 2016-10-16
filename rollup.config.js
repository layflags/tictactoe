import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import postcss from 'rollup-plugin-postcss-export'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import cssnext from 'postcss-cssnext'
import cssnano from 'cssnano'
import liveServer from 'live-server'

const inWatchMode = process.argv.includes('--watch')

if (inWatchMode) {
  liveServer.start({ root: 'build' })
}

export default {
  entry: 'src/index.js',
  format: 'iife',
  sourceMap: inWatchMode,
  plugins: [
    postcss({
      plugins: [
        cssnext(),
        cssnano({
          autoprefixer: false /* already part of cssnext */
        })
      ],
      output: 'build/ttt.min.css'
    }),
    buble(),
    nodeResolve(),
    commonjs(),
    uglify()
  ],
  dest: 'build/ttt.min.js'
}
