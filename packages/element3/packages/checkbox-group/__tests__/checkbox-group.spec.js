import CheckboxGroup from '../CheckboxGroup'
import Checkbox from '../../checkbox/Checkbox'
import CheckboxButton from '../../checkbox-button/CheckboxButton'
import { mount } from '@vue/test-utils'
import { h, ref } from 'vue'

describe('CheckboxGroup.vue', () => {
  test('support default slot', () => {
    const text = 'welcome'
    const wrapper = mount(CheckboxGroup, {
      slots: { default: text }
    })

    expect(wrapper.text()).toBe(text)
  })

  test('props.modelValue', async () => {
    const values = ref(['one'])
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: values,
        'onUpdate:modelValue': function (newValue) {
          values.value = newValue
        }
      },
      slots: {
        default: ['two'].map((label) => h(Checkbox, { label }))
      }
    })

    await wrapper
      .findComponent({ name: 'ElCheckbox' })
      .get('input')
      .trigger('click')

    expect(values.value).toEqual(['one', 'two'])
  })

  test('emit.change', async () => {
    jest.useFakeTimers()
    let changeModel
    const onChange = (newChangeModel) => {
      changeModel = newChangeModel
    }

    const values = ref(['A', 'B', 'C'])
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: values,
        onChange
      },
      slots: {
        default: ['A', 'B', 'C', 'D'].map((label) => h(Checkbox, { label }))
      }
    })

    await wrapper
      .findAllComponents({ name: 'ElCheckbox' })[0]
      .get('input')
      .trigger('change')

    await jest.runAllTicks()
    expect(changeModel).toStrictEqual(['A', 'B', 'C'])
  })

  test('props.size', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { border: true },
      slots: { default: ['A'].map((label) => h(Checkbox, { label })) }
    })

    await wrapper.setProps({ size: 'mini' })
    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
      `el-checkbox--mini`
    )

    await wrapper.setProps({ size: 'small' })
    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
      `el-checkbox--small`
    )

    await wrapper.setProps({ size: 'medium' })
    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
      `el-checkbox--medium`
    )
  })

  test('props.disabled', async () => {
    const wrapper = mount(CheckboxGroup, {
      slots: { default: ['A', 'B'].map((label) => h(Checkbox, { label })) }
    })

    await wrapper.setProps({ disabled: true })
    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
      `is-disabled`
    )

    await wrapper.setProps({ disabled: false })
    expect(
      wrapper.findComponent({ name: 'ElCheckbox' }).classes()
    ).not.toContain(`is-disabled`)
  })

  test('props.border', async () => {
    const wrapper = mount(CheckboxGroup, {
      slots: { default: ['A', 'B'].map((label) => h(Checkbox, { label })) }
    })

    await wrapper.setProps({ border: true })
    expect(wrapper.findComponent({ name: 'ElCheckbox' }).classes()).toContain(
      'is-bordered'
    )

    await wrapper.setProps({ border: false })
    expect(
      wrapper.findComponent({ name: 'ElCheckbox' }).classes()
    ).not.toContain('is-bordered')
  })

  describe('props.min', () => {
    const values = ref(['A', 'B'])
    test('the selected number is less than or equal to min', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: { modelValue: values },
        slots: {
          default: ['A', 'B', 'C', 'D'].map((label) => h(Checkbox, { label }))
        }
      })

      await wrapper.setProps({ min: 2 })
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[0].classes()
      ).toContain('is-disabled')

      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[1].classes()
      ).toContain('is-disabled')

      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[2].classes()
      ).not.toContain('is-disabled')

      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[3].classes()
      ).not.toContain('is-disabled')
    })

    test('the selected number is greater than min', async () => {
      const wrapper = mount(CheckboxGroup, {
        props: { modelValue: values },
        slots: {
          default: ['A', 'B', 'C', 'D'].map((label) => h(Checkbox, { label }))
        }
      })

      await wrapper.setProps({ min: 1 })

      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[0].classes()
      ).not.toContain('is-disabled')

      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[1].classes()
      ).not.toContain('is-disabled')

      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[2].classes()
      ).not.toContain('is-disabled')

      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[3].classes()
      ).not.toContain('is-disabled')
    })
  })

  describe('props.max', () => {
    test('the selected quantity is equal to max', async () => {
      const values = ref(['B', 'D'])
      const wrapper = mount(CheckboxGroup, {
        props: { modelValue: values },
        slots: {
          default: ['A', 'B', 'C', 'D'].map((label) => h(Checkbox, { label }))
        }
      })

      await wrapper.setProps({ max: 2 })
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[0].classes()
      ).toContain('is-disabled')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[1].classes()
      ).not.toContain('is-disabled')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[2].classes()
      ).toContain('is-disabled')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[3].classes()
      ).not.toContain('is-disabled')
    })

    test('the selected quantity is less than max', async () => {
      const values = ref(['B'])
      const wrapper = mount(CheckboxGroup, {
        props: { modelValue: values },
        slots: {
          default: ['A', 'B', 'C', 'D'].map((label) => h(Checkbox, { label }))
        }
      })

      await wrapper.setProps({ max: 2 })
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[0].classes()
      ).not.toContain('is-disabled')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[1].classes()
      ).not.toContain('is-disabled')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[2].classes()
      ).not.toContain('is-disabled')
      expect(
        wrapper.findAllComponents({ name: 'ElCheckbox' })[3].classes()
      ).not.toContain('is-disabled')
    })
  })

  test('custom select style', async () => {
    const textColor = 'red'
    const fill = 'green'
    const value = ['A', 'C']
    const result = `box-shadow: -1px 0 0 0 ${fill}; background-color: ${fill}; border-color: ${fill}; color: ${textColor};`

    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: value
      },
      slots: {
        default: ['A', 'B', 'C', 'D'].map((label) =>
          h(CheckboxButton, { label })
        )
      }
    })

    await wrapper.setProps({ 'text-color': textColor, fill })
    const components = wrapper.findAllComponents(CheckboxButton)
    expect(
      components[0].find('.el-checkbox-button__inner').attributes().style
    ).toBe(result)
    expect(
      components[2].find('.el-checkbox-button__inner').attributes().style
    ).toBe(result)
  })
})
