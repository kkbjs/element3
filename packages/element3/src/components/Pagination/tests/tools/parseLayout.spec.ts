import { parseLayout } from '../../src/tools/parseLayout'

describe('parseLayout.ts', () => {
  it('parse a layout string', () => {
    expect(parseLayout('prev, pager, next ')).toEqual(['prev', 'pager', 'next'])
  })
})
