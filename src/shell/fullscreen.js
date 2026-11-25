import { keys } from './keys'

//the page's own full screen: f11 or the display menu turn it on and off, the browser's esc leaves it
//not where the browser has none (iphone safari, the android app's webview)
export const canFullscreen = () => Boolean(document.fullscreenEnabled)

export const isFullscreen = () => Boolean(document.fullscreenElement)

export const toggleFullscreen = () => {
  if (!canFullscreen()) return
  const asked = isFullscreen()
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen()
  //a refusal (no click or key behind it) leaves the page as it was
  if (asked && asked.catch) asked.catch(() => {})
}

//f11 on every page, held or with a modifier it is left to the browser
export const fullscreenKey = (event) =>
  event.keyCode === keys.f11 &&
  !event.repeat &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.altKey &&
  !event.shiftKey &&
  canFullscreen()
