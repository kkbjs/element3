<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import { useEmitter } from '../../src/composables/emitter'
import { provide, getCurrentInstance } from 'vue'
export default {
  name: 'ElCheckboxGroup',
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const { dispatch, on } = useEmitter()

    on('update:modelValue', (v) => {
      emit('update:modelValue', v)
      dispatch('el.form.change', v)
    })

    on('change', (v) => {
      emit('change', v)
    })

    provide('elCheckboxGroup', instance)
  },
  props: {
    modelValue: Array,
    size: {
      type: String,
      validator: (val) => {
        if (val === '') return true
        return ['medium', 'small', 'mini'].includes(val)
      }
    },
    border: Boolean,
    disabled: Boolean,
    min: Number,
    max: Number,
    textColor: String,
    fill: String
  }
}
</script>
