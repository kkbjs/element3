import ElCheckboxButton from '../index'
import { mount } from '@vue/test-utils'
import { nextTick, reactive, ref } from 'vue'
import { setupGlobalOptions } from '../../../src/composables/globalConfig'

describe('ElCheckboxButton', function () {
  test('default slot', () => {
    const text = 'apples'
    const wrapper = mount(ElCheckboxButton, {
      slots: {
        default: text
      }
    })

    expect(wrapper.find('.el-checkbox-button__inner').text()).toBe(text)
  })

  describe('label', () => {
    test('props.label', () => {
      const label = 'orange'
      const wrapper = mount(ElCheckboxButton, {
        props: {
          label
        }
      })

      expect(wrapper.find('.el-checkbox-button__inner').text()).toBe(label)
    })

    test('set label and slot as the same time', () => {
      const text = 'apples'
      const label = 'orange'
      const wrapper = mount(ElCheckboxButton, {
        props: { label },
        slots: {
          default: text
        }
      })

      expect(wrapper.find('.el-checkbox-button__inner').text()).toBe(text)
    })

    test('label and slot do not exist at the same time', () => {
      const wrapper = mount(ElCheckboxButton)

      expect(wrapper.classes()).not.toContain('el-checkbox-button__inner')
    })
  })

  describe('size', () => {
    test('props.size', async () => {
      const size = 'mini'
      const wrapper = mount(ElCheckboxButton, {
        props: { size }
      })

      await wrapper.setProps({ size })
      expect(wrapper.classes()).toContain(`el-checkbox-button--${size}`)
    })

    test('by elCheckboxGroup.size', async () => {
      const size = 'mini'
      const wrapper = mount(ElCheckboxButton, {
        global: {
          provide: { elCheckboxGroup: reactive({ proxy: { size } }) }
        }
      })

      expect(wrapper.classes()).toContain(`el-checkbox-button--${size}`)
    })

    test('by elFormItem.size', async () => {
      const size = 'mini'
      const wrapper = mount(ElCheckboxButton, {
        global: {
          provide: { elFormItem: reactive({ size }) }
        }
      })

      expect(wrapper.classes()).toContain(`el-checkbox-button--${size}`)
    })

    test('by global config', async () => {
      const size = 'mini'
      const wrapper = mount(ElCheckboxButton, {
        global: {
          plugins: [setupGlobalOptions({ size })]
        }
      })

      expect(wrapper.classes()).toContain(`el-checkbox-button--${size}`)
    })
  })

  describe('disabled', () => {
    test('props.disabled', async () => {
      const wrapper = mount(ElCheckboxButton)
      expect(wrapper.classes()).not.toContain('is-disabled')
      await wrapper.setProps({ disabled: true })
      expect(wrapper.classes()).toContain('is-disabled')
    })

    test('by elCheckboxGroup.disabled', () => {
      const wrapper = mount(ElCheckboxButton, {
        global: {
          provide: { elCheckboxGroup: reactive({ proxy: { disabled: true } }) }
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
    })

    test('by elFormItem.disabled', () => {
      const wrapper = mount(ElCheckboxButton, {
        global: {
          provide: { elFormItem: reactive({ disabled: true }) }
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
    })
  })

  test('name', async () => {
    const name = 'ElCheckboxButton'
    const wrapper = mount(ElCheckboxButton)
    await wrapper.setProps({ name })

    expect(wrapper.get('input').attributes('name')).toBe(name)
  })

  test('update:modelValue', async () => {
    const value = ref(false)
    const wrapper = mount(ElCheckboxButton, {
      props: {
        modelValue: value,
        'onUpdate:modelValue': function (newModelValue) {
          value.value = newModelValue
        }
      }
    })

    await wrapper.get('input').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBeTruthy()
    await wrapper.get('input').trigger('click')
    expect(wrapper.emitted()['update:modelValue'][0][1]).toBeFalsy()
  })

  test('true-label', async () => {
    const value = ref(false)
    const trueLabel = ref('yes')
    const wrapper = mount(ElCheckboxButton, {
      props: { modelValue: value, trueLabel }
    })

    await nextTick()
    await wrapper.get('input').trigger('click')
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(trueLabel.value)
  })

  test('false-label', async () => {
    const value = ref(true)
    const falseLabel = ref('no')
    const wrapper = mount(ElCheckboxButton, {
      props: { modelValue: value, falseLabel }
    })

    await nextTick()
    await wrapper.get('input').trigger('click')
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(falseLabel.value)
  })

  test('props.checked', async () => {
    const wrapper = mount(ElCheckboxButton, {
      props: { checked: true }
    })

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBeTruthy()
  })

  describe('focus', () => {
    test('checkbox is focused', async () => {
      const wrapper = mount(ElCheckboxButton)

      expect(wrapper.classes()).not.toContain('is-focus')
      await wrapper.get('input').trigger('focus')
      expect(wrapper.classes()).toContain('is-focus')
    })

    test('checkbox is not focused', async () => {
      const wrapper = mount(ElCheckboxButton)

      await wrapper.get('input').trigger('focus')
      await wrapper.get('input').trigger('blur')
      expect(wrapper.classes()).not.toContain('is-focus')
    })
  })
})
