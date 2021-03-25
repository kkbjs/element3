import { isVNode } from 'vue'
import { isObject, isUndefined } from '../../../utils/types'
import { createComponent } from '../../../composables/component'
import msgboxVue from './MessageBox.vue'

let currentMsg, instance
let msgQueue = []

const defaultCallback = (action) => {
  if (currentMsg && currentMsg.resolve) {
    const isConfirm = action === 'confirm'
    const isCancelOrClose = action === 'cancel' || action === 'close'
    const isReject = currentMsg.reject && isCancelOrClose
    if (isReject) {
      currentMsg.reject({ action })
      return
    }
    const isShow = instance.proxy.showInput
    const value = instance.proxy.inputValue
    const result = isShow ? { value, action } : { action }
    if (isConfirm) {
      currentMsg.resolve(result)
    }
  }
}

const initInstance = (currentMsg, VNode = null) => {
  instance = createComponent(msgboxVue, currentMsg.options, VNode)
  MessageBox.instance = instance
}

const showNextMsg = () => {
  if (msgQueue.length <= 0) return
  currentMsg = msgQueue.shift()
  const options = currentMsg.options

  if (isUndefined(options.callback)) options.callback = defaultCallback

  const oldCb = options.callback
  options.callback = (action, instance) => {
    oldCb(action, instance)
  }

  initInstance(
    currentMsg,
    isVNode(options.message) ? () => options.message : null
  )
  document.body.appendChild(instance.vnode.el)
}

const MessageBox = function (options) {
  let callback = null
  if (options.callback) {
    callback = options.callback
  }
  let promiseInstance = new Promise((resolve, reject) => {
    // eslint-disable-line
    msgQueue.push({
      options: options,
      callback: callback,
      resolve: resolve,
      reject: reject
    })
    showNextMsg()
  })
  promiseInstance.instance = instance
  return promiseInstance
}

const mergeCondition = (message, title, options) => {
  if (isObject(title)) {
    options = title
    title = ''
  } else if (isUndefined(title)) {
    title = ''
  }
  if (isObject(message)) {
    options = message
    message = ''
  }
  return Object.assign(
    {
      title: title,
      message: message,
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    },
    options
  )
}

const kindOfMessageBox = {
  alert: {
    category: 'alert',
    closeOnPressEscape: false
  },
  confirm: {
    type: 'info',
    category: 'confirm',
    showCancelButton: true
  },
  prompt: {
    showInput: true,
    category: 'prompt',
    showCancelButton: true,
    inputErrorMessage: '输入的数据不合法!'
  },
  msgbox: MessageBox
}

for (let key in kindOfMessageBox) {
  MessageBox[key] = (message, title, options) => {
    return MessageBox(
      Object.assign(
        kindOfMessageBox[key],
        mergeCondition(message, title, options)
      )
    )
  }
}

MessageBox.close = () => {
  instance.proxy.closeHandle()
  msgQueue = []
  currentMsg = null
}

export default MessageBox
export { MessageBox }
