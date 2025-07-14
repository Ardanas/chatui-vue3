export * from './CardManager'


export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}


export function getRandomString() {
  const x = 2147483648
  return (
    Math.floor(Math.random() * x).toString(36)

    + Math.abs(Math.floor(Math.random() * x) ^ Date.now()).toString(36)
  )
}

// return element offset height to force the reflow
export function reflow(el: HTMLElement) {
  return el.offsetHeight
}
