import { computed, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue'
import { addClass, removeClass, hasClass } from '../../utils/dom'

let zIndex = 2000

let useBodyScrollCounter = 0

function useZindex() {
  return computed(() => zIndex++)
}

function useBodyScroll({ lockScroll }) {
  const body = document.body

  useBodyScrollCounter++
  onBeforeMount(() => {
    if (lockScroll && !hasClass(body, 'el-popup-parent--hidden')) {
      addClass(body, 'el-popup-parent--hidden')
    }
  })

  onUnmounted(() => {
    useBodyScrollCounter--
    if (lockScroll || useBodyScrollCounter <= 1) {
      removeClass(document.body, 'el-popup-parent--hidden')
    }
  })
}

export { useZindex, useBodyScroll }
