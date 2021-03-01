import { mount } from '@vue/test-utils'
import Pagination from '../src/Pagination.vue'
import Prev from '../src/parts/Prev.vue'
import Next from '../src/parts/Next.vue'
import Pager from '../src/parts/Pager.vue'
import Total from '../src/parts/Total.vue'

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
})
