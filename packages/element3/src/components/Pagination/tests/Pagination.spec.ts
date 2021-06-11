import { mount } from '@vue/test-utils'
import Pagination from '../src/Pagination.vue'
import Prev from '../src/parts/Prev.vue'
import Next from '../src/parts/Next.vue'
import Pager from '../src/parts/Pager.vue'
import Total from '../src/parts/Total.vue'
import { h, nextTick, ref } from 'vue'

describe('Pagination.vue', () => {
  it('Realize layout prev,pager,next', () => {
    const wrapper = mount(Pagination, {
      props: {
        layout: 'prev, pager, next, total',
        currentPage: 2,
        pageCount: 5
      }
    })

    expect(wrapper.findComponent(Prev).exists()).toBeTruthy()
    expect(wrapper.findComponent(Next).exists()).toBeTruthy()
    expect(wrapper.findComponent(Pager).exists()).toBeTruthy()
    expect(wrapper.findComponent(Total).exists()).toBeTruthy()
  })
  it('Realize simple paging display', () => {
    const wrapper = mount(Pagination, {
      props: {
        layout: 'prev, pager, next',
        currentPage: 2,
        pageCount: 5
      }
    })

    const pager = wrapper.vm.pager

    expect(wrapper.findComponent(Pager).vm.pager).toBe(pager)
    expect(pager.current).toBe(2)
    expect(pager.count).toBe(5)
  })
  it('Calculate page numbers by Total and pageSize', () => {
    const wrapper = mount(Pagination, {
      props: {
        layout: 'prev, pager, next, total',
        currentPage: 2,
        pageSize: 10,
        total: 100
      }
    })

    const pager = wrapper.vm.pager

    expect(wrapper.findComponent(Total).vm.pager).toBe(pager)
    expect(pager.current).toBe(2)
    expect(pager.count).toBe(10)
  })

  it('Hide when there is only one page', () => {
    const wrapper = mount(Pagination, {
      props: {
        layout: 'pager',
        currentPage: 1,
        pageSize: 1,
        total: 1,
        hideOnSinglePage: true
      }
    })

    expect(wrapper.findComponent(Pager).exists()).toBeFalsy()
  })

  it('click prev/next button currentPage', async () => {
    const currentPage = ref(2)
    const wrapper = mount(Pagination, {
      props: {
        layout: 'prev, next',
        currentPage: (currentPage as unknown) as number,
        pageCount: 10,
        'onUpdate:currentPage': (v) => (currentPage.value = v)
      }
    })

    await wrapper.findComponent(Prev).trigger('click')
    expect(currentPage.value).toBe(1)
    await wrapper.findComponent(Next).trigger('click')
    expect(currentPage.value).toBe(2)
  })

  it('vModel currentPage', async () => {
    const currentPage = ref(2)
    const wrapper = mount(Pagination, {
      props: {
        layout: 'pager',
        currentPage: (currentPage as unknown) as number,
        pageCount: 10,
        'onUpdate:currentPage': (v) => (currentPage.value = v)
      }
    })

    currentPage.value = 3
    await nextTick()
    expect(wrapper.find('.active').text()).toBe('3')
  })

  it('change size by ref', async () => {
    const currentPage = ref(2)
    const total = ref(100)
    const size = ref(10)
    const wrapper = mount(Pagination, {
      props: {
        layout: 'pager',
        currentPage: (currentPage as unknown) as number,
        total: (total as unknown) as number,
        pageSize: (size as unknown) as number,
        'onUpdate:currentPage': (v) => (currentPage.value = v)
      }
    })

    expect(wrapper.vm.pager.count).toBe(10)
    size.value = 20
    await nextTick()
    expect(wrapper.vm.pager.count).toBe(5)
  })

  it('click pager button currentPage', async () => {
    const currentPage = ref(2)
    const wrapper = mount(Pagination, {
      props: {
        layout: 'pager',
        currentPage: (currentPage as unknown) as number,
        pageCount: 100,
        'onUpdate:currentPage': (v) => (currentPage.value = v)
      }
    })
    const pages = wrapper.findAll('.number')

    await pages[0].trigger('click')
    expect(currentPage.value).toBe(1)

    await wrapper.find('.btn-quicknext').trigger('click')
    expect(currentPage.value).toBe(4)
  })

  it('click test sizes change pageSize', () => {
    const currentPage = ref(2)
    const total = ref(100)
    const size = ref(10)

    const wrapper = mount(Pagination, {
      props: {
        layout: 'sizes',
        currentPage: (currentPage as unknown) as number,
        total: (total as unknown) as number,
        pageSize: (size as unknown) as number,
        pageSizes: [10, 20, 30],
        'onUpdate:currentPage': (v) => (currentPage.value = v),
        'onUpdate:pageSize': (v) => (size.value = v)
      }
    })

    wrapper.vm.pager.size = 20

    expect(wrapper.vm.pager.count).toBe(5)
  })

  it('sizes part popperClass', () => {
    const currentPage = ref(2)
    const total = ref(100)
    const size = ref(10)

    const wrapper = mount(Pagination, {
      props: {
        layout: 'sizes',
        currentPage: (currentPage as unknown) as number,
        total: (total as unknown) as number,
        pageSize: (size as unknown) as number,
        pageSizes: [10, 20, 30],
        popperClass: 'test',
        'onUpdate:currentPage': (v) => (currentPage.value = v),
        'onUpdate:pageSize': (v) => (size.value = v)
      }
    })

    expect(wrapper.find('.test').exists()).toBeTruthy()
  })

  it('Achieve right-aligned layout', () => {
    const wrapper = mount(Pagination, {
      props: {
        layout: 'prev, pager, next, ->, total',
        currentPage: 2,
        pageCount: 5
      }
    })

    expect(wrapper.find('.btn-prev').exists()).toBeTruthy()
    expect(wrapper.findAll('.el-pager .number')).toHaveLength(5)
    expect(wrapper.find('.el-pager .number.active').text()).toBe('2')
    expect(wrapper.find('.btn-next').exists()).toBeTruthy()
    expect(wrapper.find('.el-pagination__rightwrapper').exists()).toBeTruthy()
    expect(wrapper.find('.el-pagination__total').exists()).toBeTruthy()
  })

  it('When layout is set to slot, customize slots based on #default', () => {
    const wrapper = mount(Pagination, {
      props: {
        layout: 'slot',
        currentPage: 2,
        pageCount: 5
      },
      slots: {
        default(pager) {
          return h(
            'div',
            {
              class: 'slot'
            },
            'Current: ' + pager.current
          )
        }
      }
    })

    expect(wrapper.find('.slot').exists()).toBeTruthy()
    expect(wrapper.find('.slot').text()).toBe('Current: 2')
  })

  it('Customize Prev and Next content', () => {
    const wrapper = mount(Pagination, {
      props: {
        layout: 'prev, next',
        currentPage: 2,
        pageCount: 5,
        prevText: 'PrevPage',
        nextText: 'NextPage'
      }
    })

    expect(wrapper.findComponent(Prev).text()).toBe('PrevPage')
    expect(wrapper.findComponent(Next).text()).toBe('NextPage')
  })

  it('jump page number', async () => {
    const currentPage = ref(1)
    const wrapper = mount(Pagination, {
      props: {
        layout: 'jumper',
        currentPage: (currentPage as unknown) as number,
        'onUpdate:currentPage': (v) => (currentPage.value = v),
        pageCount: 5
      }
    })

    const jumperInput = wrapper.find('input')
    await jumperInput.setValue('5')

    expect(currentPage.value).toBe(5)
  })

  it('test disable effect', async () => {
    const disabled = ref(false)
    const currentPage = ref(1)
    const wrapper = mount(Pagination, {
      props: {
        currentPage: (currentPage as unknown) as number,
        pageCount: 5,
        disabled: (disabled as unknown) as boolean,
        'onUpdate:currentPage': (v) => (currentPage.value = v)
      }
    })

    const [leftBtn, rightBtn] = wrapper.findAll('button')

    expect(leftBtn.element.disabled).toBeTruthy()

    currentPage.value = 5
    await nextTick()
    expect(rightBtn.element.disabled).toBeTruthy()

    disabled.value = true
    await nextTick()
    expect(wrapper.vm.pager.style.disabled).toBeTruthy()
  })

  it('small pager', () => {
    const currentPage = ref(1)
    const wrapper = mount(Pagination, {
      props: {
        layout: 'pager',
        currentPage: (currentPage as unknown) as number,
        'onUpdate:currentPage': (v) => (currentPage.value = v),
        pageCount: 5,
        small: true
      }
    })
    expect(wrapper.find('.el-pagination--small').exists()).toBeTruthy()
  })

  it('Pager with background', () => {
    const currentPage = ref(1)
    const wrapper = mount(Pagination, {
      props: {
        layout: 'pager',
        currentPage: (currentPage as unknown) as number,
        'onUpdate:currentPage': (v) => (currentPage.value = v),
        pageCount: 5,
        background: true
      }
    })
    expect(wrapper.find('.is-background').exists()).toBeTruthy()
  })

  it('When the page number changes, so does the Jumper', async () => {
    const currentPage = ref(1)
    const wrapper = mount(Pagination, {
      props: {
        layout: 'jumper, next',
        currentPage: (currentPage as unknown) as number,
        'onUpdate:currentPage': (v) => (currentPage.value = v),
        pageCount: 5,
        background: true
      }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('input').element.value).toBe('2')
  })
})
