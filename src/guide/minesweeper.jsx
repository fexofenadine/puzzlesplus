import { h } from 'hyperapp'
import { Rules } from '../HowToPlay'
import MinesExample from './MinesExample'
import { desktopSection } from './desktop'

//each example is a real position, its caption what the game's hint says about it
export const examples = {
  'safe-cells': {
    rows: ['.**..*.', 'oo.....', 'oFFF...', 'ooooo*.', 'ooooo..'],
    mines: 7,
  },
  'all-mines': {
    rows: ['*oooooo', '.oooooo', '.oFoooo', '*.*.*oo', '..*..oo'],
    mines: 6,
  },
  chording: {
    rows: ['.**..*.', 'oo.....', 'oFFF...', 'ooooo*.', 'ooooo..'],
    mines: 7,
    chord: [0, 1],
  },
  'shared-cells': {
    rows: ['*...ooo', '...*ooo', '...oFoo', '.....*.', '.**.*..'],
    mines: 7,
  },
  'mine-counter': {
    rows: ['.Foo', 'FFoo', 'oooo'],
    mines: 3,
  },
  'wrong-flags': {
    rows: ['...fooo', '.*.Fooo', '**.oooo', '..*Fooo', '.*..ooo'],
    mines: 7,
  },
  guessing: {
    rows: ['oo*..*.', 'oo.....', '*......', '*..*.**', '......*'],
    mines: 8,
  },
}

const Example = ({ topic }) => <MinesExample {...examples[topic]} />

export const parts = [
  {
    title: 'How to Play',
    sections: [
      { id: 'rules', title: 'The rules', body: () => <Rules /> },
      {
        id: 'levels',
        title: 'Levels and options',
        body: () => [
          <ul>
            <li>
              <b>Beginner</b> is 9 × 9 with 10 mines, <b>Intermediate</b> 16 × 16 with 40 and{' '}
              <b>Expert</b> 30 × 16 with 99.
            </li>
            <li>
              <b>Extreme</b> is 39 × 21 with 169 mines, Expert grown by 30% each way at the same
              density.
            </li>
            <li>
              <b>Custom</b> takes any size up to 40 × 30.
            </li>
          </ul>,
          <p>
            <b>Safe First Click</b> (on by default) places the mines only once your first click
            opens a cell, never under it. Flagging or chording first does not start the game.{' '}
            <b>No Guessing</b> goes further: the first click opens an empty area, and every board is
            checked by a solver so that logic alone can clear it. <b>Marks</b> lets a right click
            cycle on to a question mark, a note for cells you are unsure of.
          </p>,
        ],
      },
      {
        id: 'hints',
        title: 'Hints and best times',
        body: () => [
          <p>
            <b>Hint</b> (H, the Game menu, or the ? button beside the face on every theme but
            Classic) finds a move that follows for certain and explains it under the board. Blue
            outlines the numbers it reasons from, green marks safe cells, red marks mines and amber
            marks flags that can't be right. It only uses the numbers you can see and your flags,
            never the hidden mines, so a wrong flag can mislead it. The More button opens the part
            of this guide about that kind of step.
          </p>,
          <p>
            Every level keeps a best time, in two tabs: games played without hints and games where a
            hint was used.
          </p>,
        ],
      },
      desktopSection,
    ],
  },
  {
    title: 'Beginner techniques',
    sections: [
      {
        id: 'first-click',
        title: 'Opening moves',
        body: () => [
          <p>
            The first click is always safe. With No Guessing it also opens an empty area, so the
            board starts with numbers to work from. Without it a first click may open a single
            number, and the next click is a guess: cells away from that number are no more likely to
            hide a mine than average, while its neighbours may be much more.
          </p>,
          <p>
            Each number counts the mines among the eight cells around it, including diagonals.
            Everything else in this guide follows from reading those counts against the hidden cells
            and flags around them.
          </p>,
        ],
      },
      {
        id: 'safe-cells',
        title: 'A number with all its flags',
        body: () => [
          <p>
            Once a number has as many flags around it as it shows, its mines are all found, so every
            other hidden cell around it is safe to open.
          </p>,
          <Example topic="safe-cells" />,
        ],
      },
      {
        id: 'all-mines',
        title: 'A number with only mines left',
        body: () => [
          <p>
            The other way round: when a number still needs as many mines as it has hidden
            neighbours, every one of them is a mine. Flag them, and the numbers beside them often
            become the first case.
          </p>,
          <Example topic="all-mines" />,
        ],
      },
      {
        id: 'chording',
        title: 'Chording',
        body: () => [
          <p>
            Double-click a number, click it with both buttons or Shift click it (tap it on a touch
            screen) to open all its unflagged neighbours at once. It only works when the number has
            exactly as many flags around it as it shows. When it doesn't, the game explains why:
            extra flags are outlined in amber, and the cells where missing flags belong in dashed
            violet.
          </p>,
          <Example topic="chording" />,
        ],
      },
    ],
  },
  {
    title: 'Advanced techniques',
    sections: [
      {
        id: 'shared-cells',
        title: 'Shared cells',
        body: () => [
          <p>
            When every hidden cell next to one number is also next to another, the first number's
            mines are among the second's. If both need the same number of mines, the second number's
            other hidden cells are safe. If the second needs more, and has exactly that many more
            hidden cells, those are all mines.
          </p>,
          <Example topic="shared-cells" />,
        ],
      },
      {
        id: 'patterns',
        title: 'Patterns along a wall',
        body: () => [
          <p>
            Players learn a few shapes by heart, and each one is shared cells used along a straight
            edge of opened cells:
          </p>,
          <ul>
            <li>
              <b>1 2 1</b> along a wall: the mines are under both 1s, and the cell under the 2 is
              safe.
            </li>
            <li>
              <b>1 2 2 1</b>: the mines are under the two 2s, and the cells under the 1s are safe.
            </li>
            <li>
              <b>1 1</b> starting at a corner or a cleared edge: the cell beyond the second 1 is
              safe.
            </li>
          </ul>,
          <p>
            Hint finds these the long way, one pair of numbers at a time, so its explanation names
            the two numbers that make each step.
          </p>,
        ],
      },
      {
        id: 'mine-counter',
        title: 'The mine counter',
        body: () => [
          <p>
            Near the end, the counter of mines left to flag can settle what the numbers can't. At 0
            every hidden cell without a flag is safe. When it equals the number of hidden cells left
            without a flag, they are all mines. It only counts your flags, so it is only right when
            they are.
          </p>,
          <Example topic="mine-counter" />,
        ],
      },
      {
        id: 'wrong-flags',
        title: 'Flags that can’t be right',
        body: () => [
          <p>
            A number with more flags around it than it shows means at least one of those flags is
            wrong. Hint looks for this first, since every step after a wrong flag can be wrong too.
          </p>,
          <Example topic="wrong-flags" />,
        ],
      },
      {
        id: 'guessing',
        title: 'When only a guess is left',
        body: () => [
          <p>
            Some boards reach a point where nothing follows for certain. Make the guess that tells
            you the most: a cell whose number would open up the most of the board, or one far from
            the numbers when they make their own neighbours likely mines. Corners are no safer, but
            a guess there often opens an area. No Guessing deals boards that never need this.
          </p>,
          <Example topic="guessing" />,
        ],
      },
    ],
  },
]
