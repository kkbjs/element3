import { ref, computed, watch, reactive, toRefs, inject, onMounted } from 'vue'
import calcTextareaHeight from './calcTextareaHeight'

export const useClass = (inputSize, inputExceed, props, attrs, slots) => {
  return computed(() => {
    const classes = [
      inputSize.value ? 'el-input--' + inputSize.value : '',
      props.type === 'textarea' ? 'el-textarea' : 'el-input'
    ]

    if (attrs.disabled) {
      classes.push('is-disabled')
    }

    if (inputExceed.value) {
      classes.push('is-exceed')
    }

    if (slots.prepend || slots.append) {
      classes.push('el-input-group')
    }

    if (slots.append) {
      classes.push('el-input-group--append')
    }

    if (slots.prepend) {
      classes.push('el-input-group--prepend')
    }
    if (slots.prefix || props.prefixIcon) {
      classes.push('el-input--prefix')
    }

    if (
      slots.suffix ||
      props.suffixIcon ||
      slots.suffixIcon ||
      attrs.clearable ||
      attrs.showPassword
    ) {
      classes.push('el-input--suffix')
    }

    return classes
  })
}

export const useInput = (props, cxt, textarea) => {
  const input = ref(null)

  const elFormItem = inject('elFormItem', {})

  const elFormChange = inject('elForm.change', () => {})

  const {
    modelValue,
    size,
    suffixIcon,
    clearable,
    showPassword,
    showWordLimit
  } = toRefs(props)

  const nativeInputValue = computed(() => {
    return modelValue.value === null || modelValue.value === undefined
      ? ''
      : String(modelValue.value)
  })

  const textLength = computed(() => {
    if (typeof modelValue.value === 'number') {
      return String(modelValue.value).length >= Number(cxt.attrs.maxlength)
        ? Number(cxt.attrs.maxlength)
        : String(modelValue.value).length
    }

    return modelValue.value.length >= Number(cxt.attrs.maxlength)
      ? Number(cxt.attrs.maxlength)
      : modelValue.value.length
  })

  const elFormItemSize = computed(() => {
    return elFormItem.elFormItemSize || ''
  })

  const inputSize = computed(() => {
    return size?.value || elFormItemSize.value
  })

  const inputExceed = computed(() => {
    return props.modelValue?.length > Number(cxt.attrs.maxlength)
  })

  const getInput = () =>
    computed({
      get: () => (input.value ? input.value : textarea.value),
      set: (value) => {
        if (input?.value) {
          input.value.value = value
        }

        if (textarea?.value) {
          textarea.value.value = value
        }
      }
    })

  const clearValue = () => {
    cxt.emit('update:modelValue', '')
  }

  const setNativeInputValue = () => {
    const input = getInput()
    if (!input) return
    input.value = nativeInputValue.value
  }

  const getSuffixVisible = computed(() => {
    return (
      cxt.slots.suffix ||
      suffixIcon?.value ||
      clearable?.value ||
      showPassword?.value ||
      showWordLimit?.value
    )
  })

  onMounted(() => {
    setNativeInputValue(nativeInputValue.value)
  })

  watch(
    () => props.modelValue,
    () => {
      setNativeInputValue()
      if (props.validateEvent) {
        elFormChange()
      }
    }
  )

  return {
    input,
    getInput,
    nativeInputValue,
    textLength,
    clearValue,
    inputSize,
    getSuffixVisible,
    inputExceed
  }
}

export const useInputEvent = (emit) => {
  const handleInput = (event) => {
    emit('update:modelValue', event.target.value)
    emit('input', event.target.value)
  }

  const handleFocus = (event) => {
    emit('focus', event)
  }

  const handleBlur = (event) => emit('blur', event)

  const handleClear = () => {
    emit('update:modelValue', '')
    emit('clear')
  }

  const onChange = (event) => {
    emit('change', event.target.value)
  }

  return {
    handleInput,
    handleFocus,
    handleBlur,
    handleClear,
    onChange
  }
}

export const useInputMethod = (element) => {
  const focus = () => {
    element.value.focus()
  }

  const blur = () => {
    element.value.blur()
  }

  const select = () => {
    element.value.select()
  }

  return {
    focus,
    blur,
    select
  }
}

export const useTextarea = (props) => {
  const textarea = ref(null)

  const { autosize, type, resize } = toRefs(props)

  const state = reactive({
    textareaCalcStyle: {}
  })

  const textareaStyle = computed(() => {
    return Object.assign({}, state.textareaCalcStyle, { resize: resize?.value })
  })

  watch(
    () => props.modelValue,
    () => resizeTextarea()
  )

  const resizeTextarea = () => {
    if (type.value !== 'textarea') return
    if (!autosize.value) {
      state.textareaCalcStyle = {
        minHeight: calcTextareaHeight(textarea.value).minHeight
      }

      return
    }
    const minRows = autosize.value.minRows
    const maxRows = autosize.value.maxRows
    state.textareaCalcStyle = calcTextareaHeight(
      textarea.value,
      minRows,
      maxRows
    )
  }

  return { textarea, textareaStyle, resizeTextarea }
}
