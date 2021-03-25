import {
  nextTick,
  ref,
  onBeforeMount,
  getCurrentInstance,
  onBeforeUnmount,
  watch,
  toRefs
} from 'vue'
import { merge } from 'lodash-es'
import PopupManager from '../../src/utils/popup/popup-manager'
import getScrollBarWidth from '../../src/utils/scrollbar-width'
import { getStyle, addClass, removeClass, hasClass } from '../../src/utils/dom'

let idSeed = 1
let scrollBarWidth
const popupProps = {
  visible: {
    type: Boolean,
    default: false
  },
  openDelay: {},
  closeDelay: {},
  zIndex: {},
  modal: {
    type: Boolean,
    default: false
  },
  modalFade: {
    type: Boolean,
    default: true
  },
  modalClass: {},
  modalAppendToBody: {
    type: Boolean,
    default: false
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: false
  },
  closeOnClickModal: {
    type: Boolean,
    default: false
  }
}

function usePopup(props) {
  const { visible, modal, modalAppendToBody, lockScroll, closeDelay } = toRefs(
    props
  )

  const opened = ref(false)
  const bodyPaddingRight = ref(null)
  const computedBodyPaddingRight = ref(0)
  const withoutHiddenClass = ref(true)
  const rendered = ref(false)
  const instance = getCurrentInstance()
  let _popupId = 0
  let _closeTimer = 0
  let _openTimer = 0
  let _opening = false
  let _closing = false
  const open = (options) => {
    if (!rendered.value) {
      rendered.value = true
    }
    // instance.proxy, options)
    const props = merge(instance.proxy, options)
    if (_closeTimer) {
      clearTimeout(_closeTimer)
      _closeTimer = 0
    }
    clearTimeout(_openTimer)
    const delay = Number(props.openDelay) || 0
    if (delay > 0) {
      _openTimer = setTimeout(() => {
        _openTimer = 0
        doOpen(props)
      }, delay)
    } else {
      doOpen(props)
    }
  }
  const doOpen = (props) => {
    // if (instance.proxy.$isServer) return
    if (_opening) return
    if (opened.value) return
    _opening = true
    const dom = instance.proxy.$el
    const modal = props.modal
    const zIndex = props.zIndex

    if (zIndex) {
      PopupManager.zIndex = zIndex.value
    }
    if (modal) {
      if (_closing) {
        PopupManager.closeModal(_popupId)
        _closing = false
      }
      PopupManager.openModal(
        _popupId,
        PopupManager.nextZIndex(),
        modalAppendToBody?.value ? undefined : dom,
        props.modalClass,
        props.modalFade
      )
      if (props.lockScroll) {
        withoutHiddenClass.value = !hasClass(
          document.body,
          'el-popup-parent--hidden'
        )
        if (withoutHiddenClass.value) {
          bodyPaddingRight.value = document.body.style.paddingRight
          computedBodyPaddingRight.value = parseInt(
            getStyle(document.body, 'paddingRight'),
            10
          )
        }
        scrollBarWidth = getScrollBarWidth()
        const bodyHasOverflow =
          document.documentElement.clientHeight < document.body.scrollHeight
        const bodyOverflowY = getStyle(document.body, 'overflowY')
        if (
          scrollBarWidth > 0 &&
          (bodyHasOverflow || bodyOverflowY === 'scroll') &&
          withoutHiddenClass.value
        ) {
          document.body.style.paddingRight =
            computedBodyPaddingRight.value + scrollBarWidth + 'px'
        }
        addClass(document.body, 'el-popup-parent--hidden')
      }
    }

    if (getComputedStyle(dom).position === 'static') {
      dom.style.position = 'absolute'
    }
    dom.style.zIndex = PopupManager.nextZIndex()
    opened.value = true
    instance.onOpen && instance.onOpen()
    doAfterOpen()
  }
  const doAfterOpen = () => {
    _opening = false
  }
  const close = () => {
    if (_closing) return
    if (_openTimer) {
      clearTimeout(_openTimer)
      _openTimer = 0
    }
    clearTimeout(_closeTimer)
    const delay = Number(closeDelay && closeDelay.value)
    if (delay > 0) {
      _closeTimer = setTimeout(() => {
        _closeTimer = 0
        doClose()
      }, delay)
    } else {
      doClose()
    }
  }
  const doClose = () => {
    _closing = true
    instance.onClose && instance.onClose()
    if (lockScroll.value) {
      setTimeout(restoreBodyStyle, 200)
    }
    opened.value = false
    doAfterClose()
  }
  const doAfterClose = () => {
    PopupManager.closeModal(_popupId)
    _closing = false
  }
  const restoreBodyStyle = () => {
    if (modal.value && withoutHiddenClass.value) {
      document.body.style.paddingRight = bodyPaddingRight.value
      removeClass(document.body, 'el-popup-parent--hidden')
    }
    withoutHiddenClass.value = true
  }
  watch(visible, (val) => {
    if (val) {
      if (_opening) return
      if (!rendered.value) {
        rendered.value = true
        nextTick(() => {
          open()
        })
      } else {
        open()
      }
    } else {
      close()
    }
  })
  onBeforeMount(() => {
    _popupId = 'popup-' + idSeed++
    PopupManager.register(_popupId, instance)
  })
  onBeforeUnmount(() => {
    PopupManager.deregister(_popupId)
    PopupManager.closeModal(_popupId)
    restoreBodyStyle()
  })
  return {
    opened,
    visible,
    open,
    rendered,
    close
  }
}

export { popupProps, usePopup }
