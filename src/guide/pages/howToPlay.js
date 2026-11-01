import { startGuide } from '../Guide'
import { help } from '../../shell/Taskbar'
import { parts } from '../howToPlay'

//one level down from the site's top, closing goes to the first game
startGuide({
  page: 'how-to-play',
  root: '../',
  home: '../minesweeper/',
  title: 'How to Play',
  icon: help,
  parts,
})
