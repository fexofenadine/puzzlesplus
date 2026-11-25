import { afterEach, expect, it, vi } from 'vitest'
import { canFullscreen, fullscreenKey, isFullscreen, toggleFullscreen } from './fullscreen'

const stub = (enabled, element = null) => {
  Object.defineProperty(document, 'fullscreenEnabled', { value: enabled, configurable: true })
  Object.defineProperty(document, 'fullscreenElement', { value: element, configurable: true })
}

afterEach(() => {
  delete document.fullscreenEnabled
  delete document.fullscreenElement
  delete document.exitFullscreen
  delete document.documentElement.requestFullscreen
})

const f11 = (more = {}) => ({ keyCode: 122, ...more })

it('is only offered where the browser has it', () => {
  expect(canFullscreen()).toBe(false)
  expect(fullscreenKey(f11())).toBe(false)
  stub(true)
  expect(canFullscreen()).toBe(true)
  expect(isFullscreen()).toBe(false)
})

it('takes f11 alone, not held or with a modifier or another key', () => {
  stub(true)
  expect(fullscreenKey(f11())).toBe(true)
  expect(fullscreenKey(f11({ repeat: true }))).toBe(false)
  expect(fullscreenKey(f11({ ctrlKey: true }))).toBe(false)
  expect(fullscreenKey(f11({ shiftKey: true }))).toBe(false)
  expect(fullscreenKey({ keyCode: 113 })).toBe(false)
})

it('asks for full screen, and leaves it when already there', () => {
  const request = vi.fn(() => Promise.reject(new Error('no gesture')))
  const exit = vi.fn(() => Promise.resolve())
  document.documentElement.requestFullscreen = request
  document.exitFullscreen = exit
  stub(true)
  toggleFullscreen()
  expect(request).toHaveBeenCalledTimes(1)
  stub(true, document.documentElement)
  expect(isFullscreen()).toBe(true)
  toggleFullscreen()
  expect(exit).toHaveBeenCalledTimes(1)
  expect(request).toHaveBeenCalledTimes(1)
})

it('does nothing where the browser has none', () => {
  const request = vi.fn()
  document.documentElement.requestFullscreen = request
  stub(false)
  toggleFullscreen()
  expect(request).not.toHaveBeenCalled()
})
