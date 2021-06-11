type SwitchFun = (el: Element | EventTarget) => void
export function switchClass([a, b]: [string, string]): SwitchFun {
  return (el: Element) => {
    if (!el.className.includes(a)) {
      el.classList.add(a)
      el.classList.remove(b)
    } else {
      el.classList.remove(a)
      el.classList.add(b)
    }
  }
}
