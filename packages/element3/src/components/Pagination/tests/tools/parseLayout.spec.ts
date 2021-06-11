import { parseLayout } from '../../src/tools/parseLayout'

describe('parseLayout.ts', () => {
  it('parse a layout string', () => {
    expect(parseLayout('prev, pager, next ')).toEqual(['prev', 'pager', 'next'])
  })

  it('parse -> flag', () => {
    const layoutStr = 'prev, pager, next, -> , jumper, ->, total'
    const result = parseLayout(layoutStr)
    expect(result).toEqual(['prev', 'pager', 'next', ['jumper', ['total']]])
  })
})
