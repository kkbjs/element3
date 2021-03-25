import { mount } from '@vue/test-utils'
import { nextTick, h, ref } from 'vue'
import MessageBox from '../src/MessageBox.vue'
describe('MessageBox.vue', () => {
  describe('snapshot', () => {
    const wrapper = mount(MessageBox)
    expect(wrapper.element).toMatchSnapshot()
  })
  describe('proprety', () => {
    it('proprety title', () => {
      const wrapper = mount(MessageBox, {
        props: {
          title: 'chushihua'
        }
      })
      expect(wrapper.get('.el-message-box__title')).toHaveTextContent(
        'chushihua'
      )
    })
    it('proprety center', () => {
      const wrapper = mount(MessageBox, {
        props: {
          center: true
        }
      })
      expect(wrapper.get('.el-message-box--center').exists()).toBeTruthy()
    })
    it('proprety customClass', () => {
      const wrapper = mount(MessageBox, {
        props: {
          customClass: 'customClass'
        }
      })
      expect(wrapper.get('.customClass').exists()).toBeTruthy()
    })
    it('proprety iconClass', () => {
      const wrapper = mount(MessageBox, {
        props: {
          iconClass: 'iconClass'
        }
      })
      expect(wrapper.vm.icon).toBe('iconClass')
    })
    it('iconclass with center', () => {
      const wrapper = mount(MessageBox, {
        props: {
          iconClass: 'iconClass',
          center: true,
          title: 'title'
        }
      })
      expect(wrapper.get('.iconClass').exists()).toBeTruthy()
    })
    it('proprety type', () => {
      const wrapper = mount(MessageBox, {
        props: {
          title: 'title',
          center: true,
          type: 'info'
        }
      })
      expect(wrapper.find('.el-icon-info').exists()).toBeTruthy()
    })
    it('showClose', () => {
      const wrapper = mount(MessageBox, {
        props: {
          title: '12',
          showClose: false
        }
      })
      expect(wrapper.find('.el-message-box__headerbtn').exists()).toBeFalsy()
    })
    it('showClose toBeTruthy', () => {
      const wrapper = mount(MessageBox, {
        props: {
          title: '12'
        }
      })
      expect(wrapper.get('.el-message-box__headerbtn').exists()).toBeTruthy()
    })
    it('proprety beforeClose', async () => {
      let object = {}
      const wrapper = mount(MessageBox, {
        props: {
          title: '12',
          beforeClose: (action, instance, done) => {
            object.action = action
            object.instance = instance
            object.done = done
          }
        }
      })
      await wrapper.get('.el-message-box__headerbtn').trigger('click')
      expect(wrapper.componentVM).toEqual(object.instance)
      expect(object.action).toBe('cancel')
    })
    it('review messageBox when value was done', async () => {
      const wrapper = mount(MessageBox, {
        props: {
          title: '12',
          beforeClose: (action, instance, done) => {
            done()
          }
        }
      })
      await wrapper.get('.el-message-box__headerbtn').trigger('click')
      expect(wrapper.get('.el-message-box__headerbtn').isVisible()).toBeFalsy()
      expect(wrapper.find('.v-modal').exists()).toBeFalsy()
    })
    it('showClose lockScroll', () => {
      document.body.classList.remove('el-popup-parent--hidden')
      mount(MessageBox, {
        props: {
          title: '12',
          lockScroll: false
        },
        attachTo: document.getElementById('body')
      })
      expect(document.body.className).not.toBe('el-popup-parent--hidden')
    })
    it('meesage of normal', () => {
      const wrapper = mount(MessageBox, {
        props: {
          message: '333'
        }
      })
      expect(wrapper.get('.el-message-box__message > p')).toHaveTextContent(
        '333'
      )
    })
    it('meesage is VNode', () => {
      const v = h('p', null, [
        h('span', null, '内容可以是 '),
        h('i', { style: 'color: teal' }, 'VNode')
      ])
      const wrapper = mount(MessageBox, {
        slots: {
          default: v
        }
      })
      expect(wrapper.componentVM.$slots.default()[0]).toEqual(v)
    })
    it('dangerouslyUseHTMLString', () => {
      const wrapper = mount(MessageBox, {
        props: {
          dangerouslyUseHTMLString: true,
          message: '<div class="mmm">444</div>'
        }
      })
      expect(wrapper.get('.mmm').exists()).toBeTruthy()
    })
    it('handleInputEnter', async () => {
      const wrapper = mount(MessageBox, {
        props: {
          inputType: 'texg'
        }
      })
      wrapper.componentVM.handleInputEnter()
      await nextTick()
      expect(wrapper.componentVM.visible).toBeFalsy()
    })
    it('closeOnPressEscape', async () => {
      const wrapper = mount(MessageBox, {
        props: {
          closeOnPressEscape: true
        }
      })
      const event = new KeyboardEvent('keyup', {
        code: 'Escape'
      })
      window.dispatchEvent(event)
      expect(wrapper.get('.el-message-box__wrapper').isVisible()).toBeTruthy()
      expect(wrapper.componentVM.visible).toBeFalsy()
    })
    it('handleWrapperClick', async () => {
      const wrapper = mount(MessageBox, {
        props: {
          closeOnClickModal: true
        }
      })
      await wrapper.get('.el-message-box__wrapper').trigger('click')
      await nextTick()
      expect(wrapper.componentVM.action).toBe('cancel')
    })
    it('closeOnHashChange', async () => {
      const wrapper = mount(MessageBox, {
        props: {
          closeOnHashChange: true
        }
      })
      window.dispatchEvent(new Event('hashchange'))
      expect(wrapper.get('.el-message-box__wrapper').isVisible()).toBeTruthy()
      expect(wrapper.componentVM.visible).toBeFalsy()
    })
    it('showInput', () => {
      const wrapper = mount(MessageBox, {
        props: {
          showInput: true
        }
      })
      expect(wrapper.get('.el-message-box__input').isVisible()).toBeTruthy()
    })
    it('inputValue inputPlaceholder', () => {
      const wrapper = mount(MessageBox, {
        props: {
          showInput: true,
          inputValue: '444',
          inputPlaceholder: '555'
        }
      })
      expect(wrapper.get('.el-input__inner').element.value).toEqual('444')
      expect(wrapper.get('.el-input__inner').attributes('placeholder')).toEqual(
        '555'
      )
    })
    it('cancelButtonText, showCancelButton', () => {
      const wrapper = mount(MessageBox, {
        props: {
          cancelButtonText: 'cancel',
          showCancelButton: true,
          cancelButtonClass: 'vvv'
        }
      })
      expect(wrapper.get('.vvv')).toHaveTextContent('cancel')
      expect(wrapper.get('.vvv').isVisible()).toBeTruthy()
    })
    it('confirmButtonClass showConfirmButton, confirmButtonText', () => {
      const wrapper = mount(MessageBox, {
        props: {
          confirmButtonText: 'cancel',
          showConfirmButton: true,
          confirmButtonClass: 'mmm'
        }
      })
      expect(wrapper.get('.el-button--primary').classes()).toContain('mmm')
      expect(wrapper.get('.mmm')).toHaveTextContent('cancel')
      expect(wrapper.get('.el-message-box__btns').isVisible()).toBeTruthy()
    })
    it('proprety callback', async () => {
      let object = ref(null)
      const wrapper = mount(MessageBox, {
        props: {
          title: '12',
          callback(action) {
            object.value = action
          }
        }
      })
      await wrapper.get('.el-message-box__headerbtn').trigger('click')
      await nextTick()
      expect(object.value).toBe('cancel')
    })
    it('validate correct', async () => {
      const wrapper = mount(MessageBox, {
        props: {
          title: '12',
          category: 'prompt',
          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      })
      await wrapper.findComponent({ ref: 'input' }).setValue('2323')
      await nextTick()
      expect(wrapper.componentVM.editorErrorMessage).toBe('输入的数据不合法!')
      expect(wrapper.get('.el-input__inner').classes()).toHaveLength(2)
    })
    it('validate fail', async () => {
      const wrapper = mount(MessageBox, {
        props: {
          title: '12',
          category: 'prompt',
          inputValidator() {
            return '失败'
          },
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      })
      await wrapper.findComponent({ ref: 'input' }).setValue('2323')
      await nextTick()
      expect(wrapper.get('.el-input__inner').classes()).toHaveLength(2)
      expect(wrapper.componentVM.editorErrorMessage).toBe('失败')
    })
    it('inputValidator', async () => {
      const wrapper = mount(MessageBox, {
        props: {
          title: '12',
          category: 'prompt',
          inputValidator() {
            return false
          },
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      })
      await wrapper.findComponent({ ref: 'input' }).setValue('2323')
      await nextTick()
      expect(wrapper.get('.el-input__inner').classes()).toHaveLength(2)
    })
  })
  describe('test modal closeOnClickModal', () => {
    it('open modal', async () => {
      const wrapper = mount(MessageBox, {
        props: {
          modal: true,
          closeOnClickModal: true
        }
      })
      await nextTick()
      expect(wrapper.get('.v-modal').exists()).toBeTruthy()
      await wrapper.get('.v-modal').trigger('click')
      await nextTick()
      expect(wrapper.find('.v-moda').exists()).toBeFalsy()
    })
    it('open modal', async () => {
      const wrapper = mount(MessageBox, {
        props: {
          modal: true,
          closeOnClickModal: true
        }
      })
      await nextTick()
      expect(wrapper.get('.v-modal').exists()).toBeTruthy()
      await wrapper.get('.v-modal').trigger('keyup', { keyCode: 'Escape' })
      await nextTick()
      expect(wrapper.find('.v-moda').exists()).toBeFalsy()
    })
    it('open modal', async () => {
      const wrapper = mount(MessageBox, {
        props: {
          modal: true,
          closeOnClickModal: true
        }
      })
      await nextTick()
      expect(wrapper.get('.v-modal').exists()).toBeTruthy()
      await wrapper.get('.v-modal').trigger('hashchange')
      await nextTick()
      expect(wrapper.find('.v-moda').exists()).toBeFalsy()
    })
  })
})
