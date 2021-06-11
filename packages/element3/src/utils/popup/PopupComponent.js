import { Teleport, ref, h, Transition, computed, toRefs } from 'vue'
import { props } from './props'
import { useZindex, useBodyScroll } from './use'

const popupWrapper = {
  render({ $slots }) {
    return <div>{$slots.default ? $slots.default() : null}</div>
  }
}

export default {
  props,
  emits: ['close'],
  setup(props, { emit }) {
    const show = ref(true)

    const zIndex = useZindex()

    useBodyScroll(props)

    const close = () => {
      if (props.closeOnClickModal) {
        show.value = false
        emit('close')
      }
    }

    return {
      zIndex,
      show,
      close
    }
  },
  render({ $props, $attrs, $slots, zIndex, close }) {
    const attrs = computed(() => {
      return {
        ...$attrs
      }
    })
    return (
      <Teleport to="tody">
        <Transition
          ref="target"
          name={$props.transitionClass}
          onAfterLeave={$props.afterLeaveHandler}
          appear
        >
          <popupWrapper
            onClick={close}
            style={{ zIndex }}
            {...$attrs}
            v-show={$props.visiable}
          >
            {$slots.default ? $slots.default() : null}
          </popupWrapper>
        </Transition>
      </Teleport>
    )
  }
}
