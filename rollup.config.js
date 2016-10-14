import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import postcss from 'rollup-plugin-postcss-export'
import cssnext from 'postcss-cssnext'
import cssnano from 'cssnano'
import liveServer from 'live-server'

if (process.env.NODE_ENV === 'development') {
  liveServer.start({ root: 'build' })
}

export default {
  entry: 'src/index.js',
  format: 'iife',
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
    uglify()
  ],
  dest: 'build/ttt.min.js'
}
