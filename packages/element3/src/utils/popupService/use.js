import { computed, onBeforeMount, onUnmounted, ref } from 'vue'
import { addClass, removeClass, hasClass } from '../dom'

let zIndex = 2000

let useBodyScrollCounter = 0

function useZindex() {
  return zIndex++
}

export const useStyle = () => {
  const style = ref({})

  function setStyle(options) {
    style.value = Object.assign({}, style, options)
  }
  return {
    style,
    setStyle
  }
}

function useBodyScroll({ lockScroll }) {
  const body = document.body

  onBeforeMount(() => {
    if (lockScroll) {
      useBodyScrollCounter++
      if (!hasClass(body, 'el-popup-parent--hidden')) {
        addClass(body, 'el-popup-parent--hidden')
      }
    }
  })

  onUnmounted(() => {
    if (lockScroll) {
      useBodyScrollCounter--
      if (useBodyScrollCounter <= 0) {
        removeClass(document.body, 'el-popup-parent--hidden')
      }
    }
  })
}

export { useZindex, useBodyScroll }
