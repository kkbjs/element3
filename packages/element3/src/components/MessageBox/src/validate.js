import { toRefs, unref, ref, watch, nextTick, computed } from 'vue'
import { addClass, removeClass } from '../../../utils/dom'
export default (state, instance) => {
  const editorErrorMessage = ref(null)
  const {
    category,
    inputPattern,
    inputValue,
    inputValidator,
    inputErrorMessage
  } = toRefs(state)
  const getInputElement = () => {
    const inputRefs = instance.refs.input.$refs
    return inputRefs.input || inputRefs.textarea
  }
  function getValidateResult(errorMsg, value) {
    editorErrorMessage.value = errorMsg
    value
      ? removeClass(getInputElement(), 'invalid')
      : addClass(getInputElement(), 'invalid')
    return value
  }
  const isCategoryPrompt = computed(() => {
    return unref(category) === 'prompt'
  })
  const isEegularResult = computed(() => {
    const v =
      unref(inputPattern) && !unref(inputPattern).test(unref(inputValue))
    return unref(isCategoryPrompt) && v
  })

  const validate = () => {
    if (unref(isEegularResult)) {
      return getValidateResult(unref(inputErrorMessage), false)
    }
    const _inputValidator = unref(inputValidator)
    if (typeof _inputValidator === 'function' && unref(isCategoryPrompt)) {
      const validateResult = _inputValidator(unref(inputValue))
      const isString = typeof validateResult === 'string'
      if (isString) return getValidateResult(validateResult, false)
      if (!validateResult)
        return getValidateResult(unref(inputErrorMessage), false)
    }
    return getValidateResult('', true)
  }
  watch(inputValue, (val) => {
    nextTick(() => {
      if (unref(category) === 'prompt' && val !== null) {
        validate()
      }
    })
  })
  return {
    validate,
    editorErrorMessage
  }
}
