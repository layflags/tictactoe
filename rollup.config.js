import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'
import postcss from 'rollup-plugin-postcss-export'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import cssnext from 'postcss-cssnext'
import cssnano from 'cssnano'
import liveServer from 'live-server'

if (process.argv.includes('--watch')) {
  liveServer.start({ root: 'build' })
}

export default {
  entry: 'src/index.js',
  format: 'iife',
  sourceMap: true,
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
    sourcemaps(),
    buble(),
    nodeResolve(),
    commonjs(),
    uglify()
  ],
  dest: 'build/ttt.min.js'
}
