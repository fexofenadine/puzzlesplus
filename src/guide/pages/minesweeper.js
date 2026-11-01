import { startGuide } from '../Guide'
import { icons } from '../../shell/Taskbar'
import { parts } from '../minesweeper'

startGuide({
  page: 'minesweeper-guide',
  title: 'Minesweeper Plus Guide',
  icon: icons.minesweeper,
  parts,
})
