import { flushPromises, mount } from '@vue/test-utils'
import { nextTick, ref, h, defineComponent } from 'vue'
import { PopupComponent } from '../../../src/utils/popupService/index'

/**
 * mock 原生的tigger
 *
 */
Element.prototype.trigger = function (eventName) {
  this.dispatchEvent(new Event(eventName))
}

describe('open a teleport', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  it('should append div to body when call PopupComponent component', () => {
    const component = <div></div>
    const children = h('h1', 'test')

    mount(PopupComponent(component, children))

    expect(document.querySelector('body div')).not.toBeNull()

    expect(
      getComputedStyle(
        document.querySelector('body div'),
        null
      ).getPropertyValue('z-index')
    ).toBe('2000')
  })

  it('should render children when pass chidlren to PopupComponent ', () => {
    const component = <div></div>
    const children = h('h1', 'test')

    mount(PopupComponent(component, children))

    expect(document.body.innerHTML).toContain(`<h1>test</h1>`)
  })

  it('should auto increament z-index when render', () => {
    const component = <div className="el-popup__wrapper"></div>
    const children = h('h1', 'test')

    mount(PopupComponent(component, children))

    mount(PopupComponent(component, children))

    expect(
      getComputedStyle(
        document.querySelectorAll('body  .el-popup__wrapper')[1],
        null
      ).getPropertyValue('z-index')
    ).toBe('2003')
  })

  it('click modal should destory component and teleport when closeOnClickModal eq true ', async () => {
    let clicked = false

    const props = {
      closeOnClickModal: true,
      onClose: () => (clicked = true)
    }

    const component = <div className="el-popup__wrapper"></div>

    mount(PopupComponent(component), { props })

    document.querySelector('.el-popup__wrapper').trigger('click')

    await nextTick()
    expect(document.querySelector('body .el-popup__wrapper')).toBeNull()
    expect(clicked).toBeTruthy()
  })

  it('click modal should not destory component and teleport when closeOnClickModal eq false', async () => {
    let clicked = false

    const component = <div className="el-popup__wrapper"></div>

    const props = {
      closeOnClickModal: false,
      onClose: () => (clicked = true)
    }

    mount(PopupComponent(component), {
      props
    })

    document.querySelector('.el-popup__wrapper').trigger('click')

    await flushPromises()
    expect(document.querySelector('body  .el-popup__wrapper')).not.toBeNull()
    expect(clicked).toBeFalsy()
  })

  it('lockScroll', async () => {
    const component = <div className="el-popup__wrapper"></div>

    const popupComponent = PopupComponent(component)

    const parentCompoent = defineComponent({
      setup() {
        const show = ref(true)
        const onClose = () => (show.value = false)
        return {
          show,
          onClose
        }
      },
      render({ show, onClose }) {
        if (!show) {
          return null
        }

        return (
          <popupComponent
            lockScroll={true}
            closeOnClickModal={true}
            onClose={onClose}
          />
        )
      }
    })
    mount(parentCompoent)

    expect(document.querySelector('.el-popup-parent--hidden')).toBeTruthy()
    document.querySelector('.el-popup__wrapper').trigger('click')
    await flushPromises()

    expect(document.querySelector('.el-popup-parent--hidden')).toBeNull()
  })

  it.only('should lock-scroll if exist popupComponent', async () => {
    const component = <div className="el-popup__wrapper"></div>

    const popupComponent = PopupComponent(component)

    const parentCompoent = defineComponent({
      setup() {
        const show = ref(true)
        const onClose = () => (show.value = false)
        return {
          show,
          onClose
        }
      },
      render({ show, onClose }) {
        if (!show) {
          return null
        }

        return (
          <popupComponent
            lockScroll={true}
            closeOnClickModal={true}
            onClose={onClose}
          />
        )
      }
    })

    const parentCompoent1 = defineComponent({
      setup() {
        const show = ref(true)
        const onClose = () => (show.value = false)
        return {
          show,
          onClose
        }
      },
      render({ show, onClose }) {
        if (!show) {
          return null
        }

        return (
          <popupComponent
            lockScroll={true}
            closeOnClickModal={true}
            onClose={onClose}
          />
        )
      }
    })

    mount(popupComponent)
    mount(parentCompoent1)

    expect(document.querySelector('.el-popup-parent--hidden')).toBeTruthy()
    document.querySelectorAll('.el-popup__wrapper')[0].trigger('click')
    await flushPromises()

    expect(document.querySelector('.el-popup-parent--hidden')).not.toBeNull()
  })

  describe('transition', () => {
    it('should render transition when props transitionClass exist', async () => {
      const props = {
        transitionClass: 'el-out'
      }
      const component = <div></div>

      mount(PopupComponent(component), {
        props
      })

      expect(document.body.innerHTML).toContain('transition-stub')
    })

    it('should not render transition when props transitionClass not exist', async () => {
      const component = <div></div>

      mount(PopupComponent(component))

      expect(document.body.innerHTML).not.toContain('transition-stub')
    })
  })
})
