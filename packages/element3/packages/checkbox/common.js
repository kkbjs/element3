/**
 * Checkbox and CheckboxButton are connected logically
 */

import { useGlobalOptions } from '../../src/composables/globalConfig'
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  ref,
  toRefs,
  unref
} from 'vue'
import { useEmitter } from '../../src/composables/emitter'

export const useSize = (size) => {
  const globalConfig = useGlobalOptions()
  const { elCheckboxGroup, elFormItem } = useInject()
  const checkboxSize = computed(() => {
    return (
      size?.value ||
      elCheckboxGroup.proxy.size ||
      elFormItem.size ||
      globalConfig.size
    )
  })

  return {
    checkboxSize
  }
}

export const useDisabled = (disabled, isChecked) => {
  const { elCheckboxGroup, elFormItem } = useInject()
  const modelValue = computed(() => elCheckboxGroup.proxy.modelValue)
  const min = computed(() => elCheckboxGroup.proxy.min)
  const max = computed(() => elCheckboxGroup.proxy.max)
  const disabledValue = computed(() => {
    return (
      disabled?.value ||
      unref(elCheckboxGroup.proxy.disabled) ||
      unref(elFormItem.disabled) ||
      false
    )
  })

  const isDisabled = computed(() => {
    let limit = false
    if (modelValue.value) {
      limit =
        (modelValue.value.length <= min.value && isChecked.value) ||
        (modelValue.value.length >= max.value && !isChecked.value)
    }

    return disabledValue.value || limit
  })

  return {
    isDisabled
  }
}

export const useModel = () => {
  const { modelValue, trueLabel, falseLabel, label } = onlyProps()
  const { elCheckboxGroup } = useInject()
  const vm = getCurrentInstance()
  const { dispatch } = useEmitter()
  /**
   * elCheckboxGroup.modelValue may be a normal array or a reactive array
   */
  const parentModelValue = computed(() => elCheckboxGroup.proxy.modelValue)
  const state = computed(() => {
    return modelValue.value || parentModelValue.value || false
  })

  const model = computed({
    get() {
      return state.value
    },
    set({ checked }) {
      let modelValue = model.value
      if (label && label.value && Array.isArray(model.value)) {
        const index = modelValue.indexOf(label.value)
        index === -1 && checked
          ? modelValue.push(label.value)
          : modelValue.splice(index, 1)
        dispatch('update:modelValue', modelValue)
      } else {
        modelValue = checked ? trueLabel.value : falseLabel.value
        vm.emit('update:modelValue', modelValue)
      }
    }
  })

  const changeHandle = async () => {
    await nextTick()
    vm.emit('change', model.value)
    dispatch('change', model.value)
  }

  return {
    model,
    changeHandle
  }
}

export const useInitSelect = (model) => {
  const { trueLabel, checked, label } = onlyProps()
  const checkboxRef = ref(null)

  onMounted(() => {
    if (checked.value) {
      model.value = { checked: checked.value }
    }
  })

  const isChecked = computed(() => {
    const _isChecked = Array.isArray(model.value)
      ? model.value.includes(label.value)
      : model.value === trueLabel.value

    checkboxRef.value && (checkboxRef.value.checked = _isChecked)
    return _isChecked
  })

  return {
    checkboxRef,
    isChecked
  }
}

export function useActiveStyle() {
  const { elCheckboxGroup } = useInject()

  return computed(() => {
    return {
      backgroundColor: elCheckboxGroup.proxy.fill ?? '',
      borderColor: elCheckboxGroup.proxy.fill ?? '',
      color: elCheckboxGroup.proxy.textColor ?? '',
      'box-shadow': '-1px 0 0 0 ' + elCheckboxGroup.proxy.fill
    }
  })
}

export const useBorder = (border) => {
  const { elCheckboxGroup } = useInject()
  const isBorder = computed(() => {
    return border?.value || elCheckboxGroup.proxy.border
  })

  return {
    isBorder
  }
}

function useInject() {
  const elCheckboxGroup = inject('elCheckboxGroup', { proxy: {} })
  const elFormItem = inject('elFormItem', {})

  return {
    elCheckboxGroup,
    elFormItem
  }
}

function onlyProps() {
  return toRefs(getCurrentInstance().props)
}
