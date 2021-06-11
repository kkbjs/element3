import { switchClass } from '../../src/tools/element'

describe('element.ts', () => {
  it('switch tow class state', () => {
    const element = document.createElement('div')
    const switchTrigger = switchClass(['a', 'b'])

    switchTrigger(element)
    expect(element.className).toBe('a')

    switchTrigger(element)
    expect(element.className).toBe('b')
  })
})
