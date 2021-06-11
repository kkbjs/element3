import { makerArray } from '../../src/tools/makerArray'

describe('makerArray.ts', () => {
  it('test create 2-6 array', () => {
    expect(makerArray(2, 6)).toEqual([2, 3, 4, 5, 6])
  })
})
