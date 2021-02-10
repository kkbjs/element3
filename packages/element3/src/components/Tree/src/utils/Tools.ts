import { RawNodeBase } from '../types'

export class Tools {
  static reversalNodeKeyMap<T extends Map<unknown, unknown>>(nodeKeyMap: T) {
    const map = new Map()
    for (const [key, value] of nodeKeyMap) {
      map.set(value, key)
    }
    return map
  }
  static createMap(obj: RawNodeBase) {
    const map = new Map()
    for (const key in obj) {
      map.set(key, obj[key])
    }
    return map
  }
}
