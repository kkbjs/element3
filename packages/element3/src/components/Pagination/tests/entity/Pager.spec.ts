import { Pager, PagerEventType } from '../../src/entity/Pager'

describe('Pager.ts', () => {
  it('instance Pager', () => {
    const pageCount = 6
    const currentPage = 2
    const pagerCount = 7
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.pages).toHaveLength(6)
  })

  it('view pages', () => {
    const pageCount = 10
    const currentPage = 1
    const pagerCount = 7
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.midViewPages).toEqual([2, 3, 4, 5, 6])

    pager.current = 2
    expect(pager.midViewPages).toEqual([2, 3, 4, 5, 6])

    pager.current = 3
    expect(pager.midViewPages).toEqual([2, 3, 4, 5, 6])

    pager.current = 5
    expect(pager.midViewPages).toEqual([3, 4, 5, 6, 7])

    pager.current = 8
    expect(pager.midViewPages).toEqual([5, 6, 7, 8, 9])

    pager.current = 9
    expect(pager.midViewPages).toEqual([5, 6, 7, 8, 9])

    pager.current = 10
    expect(pager.midViewPages).toEqual([5, 6, 7, 8, 9])

    expect(pager.leftCount).toBe(9)
    expect(pager.rightCount).toBe(0)
  })

  it('test catOut method', () => {
    const pageCount = 10
    const currentPage = 2
    const pagerCount = 7
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.catOut(1, 2)).toEqual([1, 2])
    expect(pager.catOut(4, 7)).toEqual([4, 5, 6, 7])
    expect(pager.catOut(0, 11)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('test pageCount = pagerCount', () => {
    const pageCount = 10
    const currentPage = 2
    const pagerCount = 10
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.viewPages).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(pager.leftCount).toBe(1)
    expect(pager.rightCount).toBe(8)
  })

  it('test viewPages', () => {
    const pageCount = 10
    const currentPage = 1
    const pagerCount = 5
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.viewPages).toEqual([1, 2, 3, 4, 5])

    pager.current = 2
    expect(pager.viewPages).toEqual([1, 2, 3, 4, 5])

    pager.current = 3
    expect(pager.viewPages).toEqual([1, 2, 3, 4, 5])

    pager.current = 4
    expect(pager.viewPages).toEqual([2, 3, 4, 5, 6])

    pager.current = 5
    expect(pager.viewPages).toEqual([3, 4, 5, 6, 7])

    pager.current = 6
    expect(pager.viewPages).toEqual([4, 5, 6, 7, 8])

    pager.current = 7
    expect(pager.viewPages).toEqual([5, 6, 7, 8, 9])

    pager.current = 8
    expect(pager.viewPages).toEqual([6, 7, 8, 9, 10])

    pager.current = 9
    expect(pager.viewPages).toEqual([6, 7, 8, 9, 10])

    pager.current = 10
    expect(pager.viewPages).toEqual([6, 7, 8, 9, 10])

    pager.current = 0
    expect(pager.viewPages).toEqual([1, 2, 3, 4, 5])

    pager.current = 11
    expect(pager.viewPages).toEqual([6, 7, 8, 9, 10])
  })
  it('test total', () => {
    const total = 100
    const currentPage = 2
    const pagerCount = 7
    const pageSize = 10
    const pager = new Pager({
      total: total,
      size: pageSize,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.count).toBe(10)
  })

  it('jump page', () => {
    const pageCount = 6
    const currentPage = 2
    const pagerCount = 7
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    pager.jump(5)
    expect(pager.current).toBe(5)
  })

  it('jump page when currentPage Crossing the line', () => {
    const pageCount = 6
    const currentPage = 2
    const pagerCount = 7
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    pager.jump(7)
    expect(pager.current).toBe(6)
    pager.jump(0)
    expect(pager.current).toBe(1)
  })

  it('change prev/next page', () => {
    const pageCount = 6
    const currentPage = 2
    const pagerCount = 7
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    pager.prev()
    expect(pager.current).toBe(1)
    pager.next()
    expect(pager.current).toBe(2)
  })

  it('when current change, trigger event', () => {
    const changeHandler = jest.fn()
    const prevHandler = jest.fn()
    const nextHandler = jest.fn()

    const pageCount = 6
    const currentPage = 2
    const pagerCount = 7
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    pager.on(PagerEventType.CHANGE, changeHandler)
    pager.on(PagerEventType.PREV, prevHandler)
    pager.on(PagerEventType.NEXT, nextHandler)

    pager.jump(5)
    pager.prev()
    pager.next()

    expect(changeHandler).toBeCalledTimes(3)
    expect(changeHandler).toHaveBeenNthCalledWith(1, 5)
    expect(changeHandler).toHaveBeenNthCalledWith(2, 4)
    expect(changeHandler).toHaveBeenNthCalledWith(3, 5)

    expect(prevHandler).toBeCalledTimes(1)
    expect(prevHandler).toHaveBeenNthCalledWith(1, 4)

    expect(nextHandler).toBeCalledTimes(1)
    expect(nextHandler).toHaveBeenNthCalledWith(1, 5)
  })

  it('update size', () => {
    const sizeHandler = jest.fn()

    const pager = new Pager({
      total: 100,
      size: 1,
      current: 90,
      viewCount: 7
    })

    pager.on(PagerEventType.SIZE_CHANGE, sizeHandler)
    pager.size = 10
    expect(sizeHandler).toBeCalledTimes(1)
    expect(sizeHandler).toHaveBeenNthCalledWith(1, 10)
    expect(pager.current).toBe(10)
  })
})
