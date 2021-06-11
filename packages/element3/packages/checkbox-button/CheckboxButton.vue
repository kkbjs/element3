<template>
  <label
    role="checkbox"
    :class="[
      'el-checkbox-button',
      checkboxSize ? `el-checkbox-button--${checkboxSize}` : '',
      {
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-focus': focus
      }
    ]"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
  >
    <input
      class="el-checkbox__original"
      ref="checkboxRef"
      :name="name"
      :disabled="isDisabled"
      :true-value="trueLabel"
      :false-value="falseLabel"
      type="checkbox"
      @input="model = { checked: $event.target.checked }"
      @change="changeHandle"
      @focus="focus = true"
      @blur="focus = false"
    />
    <span
      class="el-checkbox-button__inner"
      :style="isChecked ? activeStyle : null"
      v-if="$slots.default || label"
    >
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import {
  useSize,
  useDisabled,
  useModel,
  useInitSelect,
  useActiveStyle
} from '../checkbox/common'
import { ref, toRefs } from 'vue'
export default {
  name: 'ElCheckboxButton',
  emits: ['update:modelValue', 'change'],
  props: {
    label: String,
    size: {
      type: String,
      validator: (val) => {
        if (val === '') return true
        return ['medium', 'small', 'mini'].includes(val)
      }
    },
    disabled: Boolean,
    name: String,
    modelValue: [String, Number, Boolean],
    trueLabel: {
      type: [String, Number, Boolean],
      default: true
    },
    falseLabel: {
      type: [String, Number, Boolean],
      default: false
    },
    checked: Boolean
  },
  setup(props) {
    const focus = ref(false)
    const { size, disabled } = toRefs(props)
    const { model, changeHandle } = useModel()
    const { isChecked, checkboxRef } = useInitSelect(model)
    const { checkboxSize } = useSize(size)
    const { isDisabled } = useDisabled(disabled)
    const activeStyle = useActiveStyle()

    return {
      checkboxSize,
      isDisabled,
      model,
      changeHandle,
      isChecked,
      checkboxRef,
      activeStyle,
      focus
    }
  }
}
</script>
