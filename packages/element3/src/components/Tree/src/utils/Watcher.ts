import { TypeAssert } from './TypeAssert'
import { Event } from '../utils/Event'
import { RawNodeBase } from '../types'
import { TreeMapper } from '../entity/TreeMapper'

const { isArray, isObject } = TypeAssert

type GetterType = 'get/obj' | 'get/arr'
type SetterObjectType =
  | 'set/obj'
  | 'set/obj/add'
  | 'set/obj/del'
  | 'set/obj/put'
type SetterArrayType =
  | 'set/arr'
  | 'set/arr/add'
  | 'set/arr/del'
  | 'set/arr/put'
  | 'set/arr/len'
export type WatcherType = GetterType | SetterObjectType | SetterArrayType

export type Key<T> = T extends T[] ? number : string

export type WatcherCbArgs<T> = {
  target: T
  key: Key<T>
  value?: any
  currentNode?: T
}

export type WatchCb<T> = (args: WatcherCbArgs<T>) => void

const _toProxy = new WeakMap<any, any>()
const _toRaw = new WeakMap<any, any>()

export class Watcher<T extends RawNodeBase> {
  private _proxy: T
  private _event = new Event<WatcherType>()

  get proxy(): T {
    return this._proxy
  }

  constructor(target: T) {
    this._proxy = this.reactive(target, target)
  }

  reactive(target: T, lastTarget: T = null): T {
    if (!isObject(target) || _toRaw.has(target)) {
      return target
    }
    if (_toProxy.has(target)) {
      return _toProxy.get(target)
    }

    const handler: ProxyHandler<T> = {
      get: this.createGetter(forCurrentNode()),
      set: this.createSetter(forCurrentNode()),
      deleteProperty: this.createDeleteProperty(forCurrentNode())
    }

    const proxy = new Proxy(target, handler)

    _toProxy.set(target, proxy)
    _toRaw.set(proxy, target)

    return proxy
    function forCurrentNode() {
      return isArray(lastTarget) ? target : lastTarget
    }
  }
  createGetter(currentNode: T): (target: T, key: Key<T>, receiver: T) => void {
    return (target: T, key: Key<T>, receiver) => {
      if (key[0] === '_') {
        // skip private props
        return Reflect.get(target, key, receiver)
      }

      if (isArray(target)) {
        this.trigger('get/arr', currentNode, target, key)
      }
      if (isObject(target) && !isArray(target)) {
        this.trigger('get/obj', currentNode, target, key)
      }

      const result = Reflect.get(target, key, receiver)

      return isObject(result)
        ? this.reactive(
            result,
            isObject(result) && !isArray(result) ? result : currentNode
          )
        : result
    }
  }
  createSetter(
    currentNode: T
  ): (target: T, key: Key<T>, value: any, receiver: T) => boolean {
    return (target: T, key: Key<T>, value: any, receiver: T) => {
      if (_toRaw.get(value)) value = _toRaw.get(value)
      if (key[0] === '_') {
        // skip private props
        return Reflect.set(target, key, value)
      }

      if (isArray(target)) {
        this.trigger('set/arr', currentNode, target, key, value)
      }
      if (isArray(target) && key === 'length') {
        this.trigger('set/arr/len', currentNode, target, key, value)
        return Reflect.set(target, key, value)
      }
      if (isArray(target) && Reflect.has(target, key)) {
        this.trigger('set/arr/put', currentNode, target, key, value)
        return Reflect.set(target, key, value)
      }
      if (isArray(target) && !Reflect.has(target, key)) {
        this.trigger('set/arr/add', currentNode, target, key, value)
        return Reflect.set(target, key, value)
      }
      if (isObject(target)) {
        this.trigger('set/obj', currentNode, target, key, value)
      }
      if (isObject(target) && Reflect.has(target, key)) {
        this.trigger('set/obj/put', currentNode, target, key, value)
        return Reflect.set(target, key, value)
      }
      if (isObject(target) && !Reflect.has(target, key)) {
        this.trigger('set/obj/add', currentNode, target, key, value)
        return Reflect.set(target, key, value)
      }
      return Reflect.set(target, key, value)
    }
  }
  createDeleteProperty(currentNode: T): (target: T, key: Key<T>) => boolean {
    return (target: T, key: Key<T>) => {
      if (isArray(target)) {
        this.trigger('set/arr/del', currentNode, target, key)
        return Reflect.deleteProperty(target, key)
      }
      if (isObject(target) && !isArray(target)) {
        this.trigger('set/obj/del', currentNode, target, key)
        return Reflect.deleteProperty(target, key)
      }
      return Reflect.deleteProperty(target, key)
    }
  }

  bindHandler(type: WatcherType, cb: WatchCb<T>): void {
    this._event.on(type, cb)
  }

  private trigger(
    type: WatcherType,
    currentNode: T,
    target: T,
    key: Key<T>,
    value = null
  ): void {
    this._event.emit(type, {
      target,
      key,
      currentNode,
      value
    } as WatcherCbArgs<T>)
  }

  static getRaw(proxy) {
    return _toRaw.get(proxy) ?? proxy
  }
}
