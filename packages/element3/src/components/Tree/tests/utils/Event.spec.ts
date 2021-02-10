import { Event } from '../../src/utils/Event'

type EventType = 'ev1' | 'ev2' | 'ev3'

describe('Event.ts', () => {
  it('test a event', () => {
    const event = new Event<EventType>()
    const cb = jest.fn()
    event.on('ev1', cb)
    event.emit('ev1', 1, 2, 3)

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledWith(1, 2, 3)
  })

  it('off a event', () => {
    const event = new Event<EventType>()
    const cb = jest.fn()
    event.on('ev1', cb)
    event.off('ev1', cb)
    event.emit('ev1', 1, 2, 3)

    expect(cb).toHaveBeenCalledTimes(0)
  })
})
