import {
  Teleport,
  ref,
  Transition,
  getCurrentInstance,
  defineComponent,
  h
} from 'vue'
import { props } from './props'
import { useZindex, useBodyScroll, useStyle, useProvide } from './use'
import { getRefInstance } from '../util'

const omit = (obj, keys) => {
  const ret = Object.assign({}, obj)

  keys.forEach((key) => delete ret[key])

  return ret
}

const PopupComponent = (component, children) =>
  defineComponent({
    props,
    //emits: ['close'],
    setup(props, { slots }) {
      const show = ref(true)

      const instance = getCurrentInstance()

      const showTeleport = ref(true)

      const zIndex = useZindex()

      useBodyScroll(props)

      const popup = ref(null)

      const { style, setStyle } = useStyle()

      const afterLeaveHandler = () => {
        showTeleport.value = false
      }

      const handleClick = () => {
        if (!props.closeOnClickModal) {
          return
        }

        if (props.transitionClass) {
          show.value = false

          props.onClose && props.onClose(getRefInstance(instance, 'popup')[0])
        } else if (!props.transitionClass) {
          showTeleport.value = false

          props.onClose && props.onClose(getRefInstance(instance, 'popup')[0])
        }
      }
      const closePopup = (instance) => {
        if (!props.showTeleport) {
          showTeleport.value = false
        }
        show.value = false
        props.onClose && props.onClose(instance)
      }

      const getPopupProps = (key) => popup.value.$props[key]

      const getPopupAttrs = (key) => popup.value[key]
      return {
        zIndex,
        show,
        closePopup,
        style,
        setStyle,
        popup,
        showTeleport,
        handleClick,
        afterLeaveHandler,
        getPopupProps,
        getPopupAttrs
      }
    },
    render({
      $props,
      $attrs,
      zIndex,
      closePopup,
      handleClick,
      style,
      popup,
      show,
      showTeleport,
      afterLeaveHandler
    }) {
      const styleText = { ...style, zIndex }

      if (!showTeleport) {
        return null
      }

      const childernProps = omit($props, ['onClose'])

      if ($props.transitionClass) {
        return (
          <Teleport to="body">
            <Transition
              name={$props.transitionClass}
              onAfterLeave={afterLeaveHandler}
              appear
            >
              <component
                v-show={show}
                ref="popup"
                onClick={handleClick}
                onClose={closePopup}
                style={styleText}
                {...$attrs}
                {...childernProps}
              >
                {children ? <children /> : null}
              </component>
            </Transition>
          </Teleport>
        )
      }
      return (
        <Teleport to="body">
          <component
            ref="popup"
            onClick={handleClick}
            onClose={closePopup}
            style={styleText}
            {...$attrs}
            {...childernProps}
          >
            {children ? <children /> : null}
          </component>
        </Teleport>
      )
    }
  })

export default PopupComponent
