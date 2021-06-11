<template>
  <label
    role="checkbox"
    :class="[
      'el-checkbox',
      isBorder && checkboxSize ? `el-checkbox--${checkboxSize}` : '',
      {
        'is-bordered': isBorder,
        'is-disabled': isDisabled,
        'is-checked': isChecked
      }
    ]"
    :id="id"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
  >
    <span
      :class="[
        'el-checkbox__input',
        {
          'is-disabled': isDisabled,
          'is-checked': isChecked,
          'is-indeterminate': indeterminate,
          'is-focus': isFocus
        }
      ]"
      :tabindex="indeterminate ? 0 : false"
      :role="indeterminate ? 'checkbox' : false"
      :aria-checked="indeterminate ? 'mixed' : false"
    >
      <span class="el-checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="el-checkbox__original"
        ref="checkboxRef"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        type="checkbox"
        @input="model = { checked: $event.target.checked }"
        @focus="isFocus = true"
        @blur="isFocus = false"
        @change="changeHandle"
        :aria-hidden="indeterminate ? 'true' : 'false'"
      />
      <input
        v-else
        class="el-checkbox__original"
        ref="checkboxRef"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        type="checkbox"
        :value="label"
        @input="model = { checked: $event.target.checked }"
        @focus="isFocus = true"
        @blur="isFocus = false"
        @change="changeHandle"
        :aria-hidden="indeterminate ? 'true' : 'false'"
      />
    </span>
    <span class="el-checkbox__label" v-if="$slots.default || label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import { ref, toRefs } from 'vue'
import {
  useSize,
  useDisabled,
  useModel,
  useInitSelect,
  useBorder
} from './common'

export default {
  name: 'ElCheckbox',
  emits: ['update:modelValue', 'change'],
  setup(props) {
    const { border, size, disabled } = toRefs(props)

    const isFocus = ref(false)

    const { changeHandle, model } = useModel()
    const { checkboxRef, isChecked } = useInitSelect(model)
    const { isBorder } = useBorder(border)
    const { isDisabled } = useDisabled(disabled, isChecked)
    const { checkboxSize } = useSize(size)

    return {
      changeHandle,
      isBorder,
      checkboxSize,
      isDisabled,
      checkboxRef,
      isChecked,
      isFocus,
      model
    }
  },
  props: {
    label: String,
    modelValue: [String, Number, Boolean, Symbol, Array],
    border: Boolean,
    size: {
      type: String,
      validator: (val) => {
        if (val === '') return true
        return ['medium', 'small', 'mini'].includes(val)
      }
    },
    disabled: Boolean,
    name: String,
    trueLabel: {
      type: [String, Number, Boolean],
      default: true
    },
    falseLabel: {
      type: [String, Number, Boolean],
      default: false
    },
    checked: Boolean,
    indeterminate: Boolean,
    id: String,
    controls: String
  }
}
</script>
