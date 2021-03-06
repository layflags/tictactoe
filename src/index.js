// styles will be extracted
import './styles.css'

// ES2015 polyfills
import 'core-js/fn/array/fill'
import 'core-js/fn/number/is-integer'

// the game
import createGame from './game'

document.addEventListener('DOMContentLoaded', () => {
  createGame(document.getElementById('game'))
})
