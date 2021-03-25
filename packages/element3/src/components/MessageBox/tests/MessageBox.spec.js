import { flushPromises } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import { merge } from 'lodash-es'
import messageBox, { MessageBox } from '../src/MessageBox.js'
const selector = '.el-message-box__wrapper'
function testCallback(name, options = {}) {
  const message = '请输入邮箱'
  const o = {
    prompt: {
      message,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      cancelButtonClass: 'mmm'
    },
    confirm: {
      message,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonClass: 'mmm'
    },
    msgbox: {
      message,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonClass: 'mmm'
    }
  }
  return messageBox[name](merge(o[name], options))
}
describe('MessageBox.js', () => {
  afterEach(() => {
    const el = document.querySelector('.el-message-box__wrapper')
    if (!el) return
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
  })
  test('alert', async () => {
    const { instance } = messageBox.alert({
      title: '消息',
      message: '这是一段内容'
    })

    expect(instance.props.title).toBe('消息')
    expect(instance.props.message).toEqual('这是一段内容')
  })
  test('messageBox of message is html', async () => {
    let instanceProprety = ''
    const callback = jest.fn((action, instance) => {
      instanceProprety = instance
    })
    const { instance } = messageBox.alert(
      `<strong>这是 <i>HTML</i> 片段</strong>`,
      `html片段`,
      {
        dangerouslyUseHTMLString: true,
        callback
      }
    )
    expect(instance.proxy.message).toBe(
      '<strong>这是 <i>HTML</i> 片段</strong>'
    )
    expect(instance.proxy.title).toBe('html片段')
    expect(instance.proxy.dangerouslyUseHTMLString).toBeTruthy()
    instance.proxy.closeHandle()
    await flushPromises()
    expect(instanceProprety.message).toBeTruthy()
    expect(callback).toHaveBeenCalled()
  })
  test('confirm', async () => {
    const { instance } = messageBox.confirm({
      type: 'warning',
      title: '消息',
      message: '这是一段内容'
    })
    expect(instance.props.type).toBe('warning')
  })
  test('kind of prompt', async () => {
    let v = ''
    const callback = jest.fn(({ value }) => {
      v = value
    })
    const instance = testCallback('prompt', {
      confirmButtonClass: 'mmmm',
      inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
      inputErrorMessage: '邮箱格式不正确'
    })
    const btn = document.querySelector('.mmmm')
    instance.then(callback)
    btn.click()
    await flushPromises()
    expect(callback).not.toHaveBeenCalled()
    instance.instance.proxy.inputValue = '409187100@qq.com'
    btn.click()
    await flushPromises()
    expect(callback).toHaveBeenCalled()
    expect(v).toBeTruthy()
  })
  test('was invoked', async () => {
    const callback = jest.fn(() => {})
    const instance = testCallback('prompt', {
      message: '请输入邮箱'
    })

    instance.catch(callback)
    await nextTick()
    const btn = document.querySelector('.mmm')
    await btn.click()
    await flushPromises()
    expect(callback).toHaveBeenCalled()
  })
  test('paramter', async () => {
    const { instance } = messageBox.alert('请输入邮箱', { title: 'aaa' })
    expect(instance.proxy.title).toBe('aaa')
    expect(instance.proxy.message).toBe('请输入邮箱')
  })

  test('showInput is false', async () => {
    const callback = jest.fn(() => {})
    const instance = testCallback('confirm')
    instance.then(callback)
    const btn = document.querySelector('.mmm')
    await btn.click()
    await flushPromises()
    expect(callback).toHaveBeenCalled()
  })
  test('message is vnode', async () => {
    const message = h('div', '4')
    const { instance } = MessageBox.alert({
      message
    })
    expect(instance.proxy.$slots.default()[0]).toEqual(message)
  })
})
