import { h } from 'hyperapp'
import { SubMenuItem } from '../Menu'

//the order of the taskbar, the menus and the home page: the original first, the digit puzzles, then the
//puzzles you draw or place on a grid, and the arcade game last
export const games = [
  ['minesweeper', 'Minesweeper'],
  ['takuzu', 'Takuzu'],
  ['sudoku', 'Sudoku'],
  ['futoshiki', 'Futoshiki'],
  ['nonograms', 'Nonograms'],
  ['lightup', 'Light Up'],
  ['bridges', 'Bridges'],
  ['2048', '2048'],
]

//every game's page for the game menu, the open one checked
export const gameLinks = (current) =>
  games.map(([id, name]) => (
    <SubMenuItem
      name={name}
      checked={id === current}
      onClick={() => id !== current && location.assign(`../${id}/`)}
    />
  ))
