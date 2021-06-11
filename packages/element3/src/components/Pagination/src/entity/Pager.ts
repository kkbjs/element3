import mitt from 'mitt'
import { ElPaginationProps, Keep } from '../../types'
import { makerArray } from '../tools/makerArray'

export enum PagerEventType {
  CHANGE = 'change',
  PREV = 'prev',
  NEXT = 'next',
  SIZE_CHANGE = 'size_change'
}

export type PagerEventCb = (pageNumber: number) => void

export interface PagerParam {
  size: number
  total: number
  current: number
  viewCount: number
}

export type PagerStyle = Keep<
  'prevText' | 'nextText' | 'popperClass' | 'disabled'
>

export class Pager {
  private _current: number
  private _total: number
  private _size: number
  private _viewCount: number
  private _event = mitt()
  private _sizes = []
  private _style: PagerStyle = {
    popperClass: '',
    prevText: '',
    nextText: '',
    disabled: false
  }

  get style(): PagerStyle {
    return this._style
  }

  set style(v: PagerStyle) {
    this._style = v
  }

  get sizes(): number[] {
    return this._sizes
  }

  set sizes(v: number[]) {
    this._sizes = v
  }

  get size(): number {
    return this._size
  }

  set size(v: number) {
    this.changeSize(v)
  }

  get total(): number {
    return this._total
  }

  set total(v: number) {
    this._total = v
  }

  get pagerCountNotSelf(): number {
    return this._viewCount - 1
  }

  get halfPager(): number {
    return Math.floor(this.pagerCountNotSelf / 2)
  }

  get leftCount(): number {
    return Math.max(this._current - 1, 0)
  }

  get rightCount(): number {
    return Math.max(this.count - this._current, 0)
  }

  get current(): number {
    return this._current
  }

  set current(v: number) {
    this.jump(v)
  }

  get count(): number {
    return Math.ceil(this._total / this._size)
  }

  get viewCount(): number {
    return this._viewCount
  }

  set viewCount(v: number) {
    this._viewCount = v
  }

  get pages(): number[] {
    return makerArray(1, this.count)
  }

  get viewPages(): number[] {
    let leftViewCount = Math.min(this.leftCount, this.halfPager)
    let rightViewCount = Math.min(this.rightCount, this.halfPager)

    if (leftViewCount > rightViewCount) {
      leftViewCount =
        this.pagerCountNotSelf - Math.min(rightViewCount, this.halfPager)
    } else {
      rightViewCount =
        this.pagerCountNotSelf - Math.min(leftViewCount, this.halfPager)
    }

    return this.catOut(
      this._current - leftViewCount,
      this._current + rightViewCount
    )
  }

  get midViewPages(): number[] {
    const result = this.viewPages
    result.shift()
    result.pop()
    return result
  }

  constructor(pagerParam: PagerParam) {
    this._size = pagerParam.size
    this._total = pagerParam.total
    this._current = pagerParam.current
    this._viewCount = pagerParam.viewCount
  }

  catOut(start: number, end: number): number[] {
    return this.pages.slice(Math.max(start - 1, 0), Math.min(end, this.count))
  }

  jump(v: number): void {
    if (this._style.disabled) {
      return
    }
    v = Math.min(this.count, v)
    v = Math.max(1, v)
    this._current = v
    this._event.emit(PagerEventType.CHANGE, v)
  }

  prev(step = 1): void {
    this.jump(this._current - step)
    this._event.emit(PagerEventType.PREV, this._current)
  }

  next(step = 1): void {
    this.jump(this._current + step)
    this._event.emit(PagerEventType.NEXT, this._current)
  }

  on(type: PagerEventType, cb: PagerEventCb): void {
    this._event.on(type, cb)
  }

  changeSize(v: number): void {
    this._size = v
    this._event.emit(PagerEventType.SIZE_CHANGE, v)
    this.jump(this._current)
  }
}
