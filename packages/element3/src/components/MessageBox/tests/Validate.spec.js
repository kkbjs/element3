import validateFunction from '../src/validate'
import { mount } from '@vue/test-utils'
import { ElInput } from '../../Input'
import { reactive, getCurrentInstance } from 'vue'
describe('it was the validate functional ', () => {
  function createComponent(data) {
    return {
      setup() {
        const instance = getCurrentInstance()
        const state = data
        const { validate } = validateFunction(state, instance)
        return {
          validate,
          inputValue: state.inputValue,
          inputErrorMessage: state.inputErrorMessage
        }
      },
      components: {
        ElInput
      },
      template: `<div ><ElInput ref="input" v-model="inputValue" /></div>`
    }
  }
  it('the validate returned false when property was not have inputValidator', async () => {
    let data = reactive({
      inputValue: null,
      category: 'prompt',
      inputPattern: /^1.+/,
      inputErrorMessage: 'aaa'
    })
    const wrapper = mount(createComponent(data))
    expect(wrapper.vm.validate()).toBeFalsy()
    expect(wrapper.find('.invalid')).toBeTruthy()
    expect(wrapper.vm.inputErrorMessage).toBe('aaa')
  })
  it('when the inputValidator was the function and was the true or the false', async () => {
    let data = reactive({
      inputValue: 232,
      category: 'prompt',
      inputErrorMessage: 'aaa',
      inputValidator(value) {
        return value === null ? false : value === true ? true : 'true'
      }
    })
    const wrapper = mount(createComponent(data))
    expect(wrapper.vm.validate()).toBeFalsy()
    expect(wrapper.find('.invalid')).toBeTruthy()
    expect(wrapper.vm.inputErrorMessage).toBe('aaa')
    wrapper.vm.inputValue = '2'
    expect(wrapper.vm.validate()).toBeFalsy()
    expect(wrapper.find('.invalid')).toBeTruthy()
    expect(wrapper.vm.inputErrorMessage).toBe('aaa')
    data.inputValue = true
    expect(wrapper.vm.validate()).toBeTruthy()
    expect(wrapper.find('.invalid').exists()).toBeFalsy()
  })
})
