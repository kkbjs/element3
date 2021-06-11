import { Message } from '../src/Message.js'
import { h } from 'vue'
describe('Message', () => {
  afterEach(async () => {
    Message.closeAll()
  })
  test('should have close function in the message instance', () => {
    const instanceProxy = Message('foo')
    expect(instanceProxy.proxy.getPopupAttrs('close')).toBeTruthy()
  })
  test('default options ', () => {
    const instanceProxy = Message('foo')

    expect(instanceProxy.proxy.getPopupProps('type')).toBe('info')
    expect(instanceProxy.proxy.getPopupProps('message')).toBe('foo')
    expect(instanceProxy.proxy.getPopupProps('duration')).toBe(4500)
    expect(instanceProxy.proxy.getPopupProps('offset')).toBe(20)
  })

  test('message is vnode', () => {
    const vnode = h('p')
    Message({
      message: vnode
    })

    expect(document.querySelector('.el-message--info')).toBeTruthy()
  })

  test('opts is vnode', () => {
    const vnode = h('p')
    Message(vnode)

    expect(document.querySelector('.el-message--info')).toBeTruthy()
  })

  test('should called onClose ', () => {
    let proxy
    const onClose = jest.fn((instanceProxy) => {
      proxy = instanceProxy
    })

    const instanceProxy = Message({
      message: 'foo',
      onClose
    })
    instanceProxy.proxy.getPopupAttrs('close')()

    expect(proxy.close).toBeTruthy()
    expect(onClose).toHaveBeenCalled()
  })

  test('calculateVerticalOffset', () => {
    const instanceProxy1 = Message('foo1')
    expect(instanceProxy1.proxy.getPopupAttrs('offset')).toBe(20)

    const instanceProxy2 = Message('foo2')
    expect(instanceProxy2.proxy.getPopupAttrs('offset')).toBe(36)
  })

  describe('message.info', () => {
    test('string', () => {
      const instanceProxy = Message.info('foo')

      expect(instanceProxy.proxy.getPopupAttrs('type')).toBe('info')
      expect(instanceProxy.proxy.getPopupAttrs('message')).toBe('foo')
    })

    test('options', () => {
      const instanceProxy = Message.info({
        message: 'foo'
      })

      expect(instanceProxy.proxy.getPopupAttrs('type')).toBe('info')
      expect(instanceProxy.proxy.getPopupAttrs('message')).toBe('foo')
    })
  })

  test('message.success', () => {
    const instanceProxy = Message.success('foo')

    expect(instanceProxy.proxy.getPopupProps('type')).toBe('success')
    expect(instanceProxy.proxy.getPopupProps('message')).toBe('foo')
  })

  test('message.warning', () => {
    const instanceProxy = Message.warning('foo')

    expect(instanceProxy.proxy.getPopupProps('type')).toBe('warning')
    expect(instanceProxy.proxy.getPopupProps('message')).toBe('foo')
  })

  test('message.error', () => {
    const instanceProxy = Message.error('foo')

    expect(instanceProxy.proxy.getPopupProps('type')).toBe('error')
    expect(instanceProxy.proxy.getPopupProps('message')).toBe('foo')
  })
})
