export type EventCb = (...args: unknown[]) => void

export class Event<EventName = string> {
  private _map = new Map<EventName, Set<EventCb>>()

  on(name: EventName, cb: EventCb) {
    if (!this._map.has(name)) this._map.set(name, new Set<EventCb>())

    this._map.get(name).add(cb)
  }

  off(name: EventName, cb: EventCb) {
    if (!this._map.has(name)) return

    this._map.get(name).delete(cb)
  }

  emit(name: EventName, ...args: unknown[]) {
    if (!this._map.has(name)) return

    this._map.get(name).forEach((cb) => cb(...args))
  }
}
