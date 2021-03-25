import { toRefs, nextTick, unref, onMounted, onUnmounted, computed } from 'vue'
import { usePopup } from '../../../composables/popup'
import { isFunction } from '@vue/shared'
export function useHandleList(state, instance, validate) {
  const { close } = usePopup(state)
  const {
    visible,
    callback,
    category,
    inputType,
    distinguishCancelAndClose,
    closeOnClickModal,
    action,
    beforeClose
  } = toRefs(state)
  const closeHandle = () => {
    visible.value = false
    close()
    nextTick(() => {
      unref(callback)(state.action, instance.proxy)
    })
  }
  const handleAction = (_action) => {
    if (unref(category) === 'prompt' && _action === 'confirm' && !validate()) {
      return
    }
    action.value = _action
    if (isFunction(beforeClose.value)) {
      beforeClose.value(_action, instance.proxy, closeHandle)
    } else {
      closeHandle()
    }
  }

  const handleInputEnter = () => {
    if (unref(inputType) !== 'textarea') {
      return handleAction('confirm')
    }
  }

  const handleWrapperClick = () => {
    if (unref(closeOnClickModal)) {
      handleAction(unref(distinguishCancelAndClose) ? 'close' : 'cancel')
    }
  }

  return {
    closeHandle,
    handleAction,
    handleWrapperClick,
    handleInputEnter
  }
}

export function watchElement(state, handleAction, closeHandle) {
  const {
    closeOnHashChange,
    closeOnPressEscape,
    distinguishCancelAndClose
  } = toRefs(state)
  const { open } = usePopup(state)
  const handleKeyup = (element = {}) => {
    if (element.code !== 'Escape') return
    if (unref(closeOnPressEscape)) {
      handleAction(unref(distinguishCancelAndClose) ? 'close' : 'cancel')
    }
  }
  onMounted(() => {
    if (unref(closeOnHashChange)) {
      window.addEventListener('hashchange', closeHandle)
    }
    window.addEventListener('keyup', handleKeyup)
    nextTick(() => {
      open()
    })
  })
  onUnmounted(() => {
    if (unref(closeOnHashChange)) {
      window.removeEventListener('hashchange', closeHandle)
    }
    window.removeEventListener('keyup', handleKeyup)
  })
}

export function classIcon(iconClass, type) {
  return computed(() => {
    return unref(iconClass) || (unref(type) ? `el-icon-${unref(type)}` : '')
  })
}
