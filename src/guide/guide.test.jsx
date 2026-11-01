import { expect, it } from 'vitest'
import { app, h } from 'hyperapp'
import { guideTopic as minesTopic } from '../hint'
import { exampleHint } from './MinesExample'
import { exampleStep } from './TakuzuExample'
import { boardStep, lineStep } from './NonogramsExample'
import { examples as minesExamples, parts as minesParts } from './minesweeper'
import { examples as takuzuExamples, parts as takuzuParts } from './takuzu'
import { lines, parts as nonogramsParts, whatIf } from './nonograms'
import { parts as howToParts } from './howToPlay'

const ids = (parts) => parts.flatMap((part) => part.sections.map((section) => section.id))

it('shows every minesweeper example the hint its section is about', () => {
  for (const [topic, example] of Object.entries(minesExamples)) {
    expect(minesTopic(exampleHint(example)), topic).toBe(topic)
    expect(ids(minesParts)).toContain(topic)
  }
})

it('finds every takuzu technique in its example, at the easiest level the board offers', () => {
  for (const [technique, rows] of Object.entries(takuzuExamples)) {
    expect(exampleStep(rows, technique), technique).toBeTruthy()
    expect(ids(takuzuParts)).toContain(technique)
  }
})

it('finds every nonograms technique in its example', () => {
  for (const [technique, { clue, values }] of Object.entries(lines)) {
    expect(lineStep(clue, values, technique), technique).toBeTruthy()
    expect(ids(nonogramsParts)).toContain(technique)
  }
  expect(boardStep(whatIf.clues, whatIf.rows, 'what-if')).toBeTruthy()
})

//every hint a game gives lands on a section of its guide
it('has a section for every topic a hint can link to', () => {
  const minesTopics = ['wrong-flags', 'chording', 'guessing', 'first-click', 'mine-counter']
  for (const topic of minesTopics) expect(ids(minesParts)).toContain(topic)
  expect(ids(takuzuParts)).toContain('mistakes')
  expect(ids(nonogramsParts)).toContain('mistakes')
})

it('renders every guide without crashing', async () => {
  for (const parts of [minesParts, takuzuParts, nonogramsParts, howToParts]) {
    const container = document.createElement('div')
    await new Promise((resolve) => {
      const view = () => (
        <div oncreate={resolve}>
          {parts.map((part) => part.sections.map((section) => section.body()))}
        </div>
      )
      app({}, {}, view, container)
    })
    expect(container.querySelectorAll('figure').length).toBeGreaterThan(
      parts === howToParts ? -1 : 3,
    )
  }
})
