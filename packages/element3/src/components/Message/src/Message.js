import messageComponent from './Message.vue'
import { createPopupComponent } from '../../../composables/component'
import { isVNode, render, nextTick } from 'vue'

const instances = []
const target = 'body'
export function Message(opts) {
  return createMessage(mergeOptions(opts))
}

Message.closeAll = () => {
  instances.forEach((instance) => {
    instance.proxy.popup.close()
    removeInstance(instance)
  })
}
;['info', 'success', 'warning', 'error'].forEach((type) => {
  Message[type] = (opts) => {
    return createMessage(mergeOptions(opts, type))
  }
})

function createMessage(opts) {
  const instance = createMessageComponentByOpts(opts)
  addInstance(instance)
  return instance
}

function createMessageComponentByOpts(opts) {
  if (isVNode(opts.message)) {
    return createPopupComponent(messageComponent, opts, () => opts.message)
  }
  return createPopupComponent(messageComponent, opts)
}

function mergeOptions(opts, type = 'info') {
  const defaultOptions = {
    target,
    duration: 4500,
    type,
    offset: calculateVerticalOffset(opts.offset),
    transitionClass: 'el-message-fade'
  }

  const userOnClose = opts?.onClose
  // opts.onClose Cannot be merged into the default options
  delete opts?.onClose
  delete opts?.offset
  defaultOptions.onClose = (instance) => {
    closeMessage(instance)
    if (userOnClose) userOnClose(instance.proxy)
  }

  if (typeof opts === 'string' || isVNode(opts)) {
    defaultOptions.message = opts
    return defaultOptions
  }

  return Object.assign({}, defaultOptions, opts)
}

function calculateVerticalOffset(offset = 20) {
  let result = offset
  instances.forEach((instance) => {
    result += getNextRefInterval(instance)
  })

  return result
}

function closeMessage(instance) {
  updatePosition(instance)
  removeInstance(instance)
}

function updatePosition(closeInstance) {
  const currentInstanceIndex = getIndexByInstance(closeInstance)

  if (currentInstanceIndex < 0) return

  for (
    let index = currentInstanceIndex + 1;
    index < instances.length;
    index++
  ) {
    const instance = instances[index]
    const instanceTop = getProxyElTop(instance)
    const top = instanceTop - getNextElementInterval(closeInstance)

    instance.proxy.setStyle({
      top: top + 'px'
    })
  }
}

function getNextRefInterval(instance) {
  const INTERVAL_HEIGHT = 16
  const target = instance.proxy.popup.$el
  return target.offsetHeight + INTERVAL_HEIGHT
}

function getNextElementInterval(instance) {
  const INTERVAL_HEIGHT = 16
  const target = instance.proxy.$el
  return target.offsetHeight + INTERVAL_HEIGHT
}

function addInstance(instance) {
  instances.push(instance)
}

function removeInstance(instance) {
  instances.splice(getIndexByInstance(instance), 1)
}

function getIndexByInstance(instance) {
  return instances.findIndex((i) => i.proxy.popup.$el == instance.proxy.$el)
}

function getProxyElTop(instance) {
  const { top } = instance.proxy.popup.$el.style
  return top.replace(/px/, '')
}
