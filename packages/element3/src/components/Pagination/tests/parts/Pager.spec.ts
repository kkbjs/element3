import { mount } from '@vue/test-utils'
import { Pager } from '../../src/entity/Pager'
import ElPager from '../../src/parts/Pager.vue'

describe('Pager.vue', () => {
  it('show page pageCount <= pagerCount', () => {
    const pager = new Pager({ total: 5, size: 1, current: 3, viewCount: 7 })
    const wrapper = mount(ElPager, {
      props: {
        pager
      }
    })

    expect(wrapper.findAll('.number')).toHaveLength(5)
    expect(wrapper.findAll('.number').map((item) => item.text())).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5'
    ])
    expect(wrapper.find('.number.active').text()).toBe('3')
    expect(wrapper.findAll('.el-icon.more')).toHaveLength(0)
  })
  it('show page pageCount > pagerCount currentPage is 4', () => {
    const pager = new Pager({ total: 30, size: 1, current: 4, viewCount: 7 })

    const wrapper = mount(ElPager, {
      props: {
        pager
      }
    })

    expect(wrapper.findAll('.number')).toHaveLength(7)
    expect(wrapper.find('.el-icon.more.btn-quickprev').exists()).toBeFalsy()
    expect(wrapper.find('.el-icon.more.btn-quicknext').exists()).toBeTruthy()
  })
  it('show page pageCount > pagerCount currentPage is 27', () => {
    const pager = new Pager({ total: 30, size: 1, current: 27, viewCount: 7 })

    const wrapper = mount(ElPager, {
      props: {
        pager
      }
    })

    expect(wrapper.findAll('.number')).toHaveLength(7)
    expect(wrapper.find('.el-icon.more.btn-quickprev').exists()).toBeTruthy()
    expect(wrapper.find('.el-icon.more.btn-quicknext').exists()).toBeFalsy()
  })
  it('show page pageCount > pagerCount', () => {
    const pager = new Pager({ total: 30, size: 1, current: 10, viewCount: 7 })

    const wrapper = mount(ElPager, {
      props: {
        pager
      }
    })

    expect(wrapper.findAll('.number')).toHaveLength(7)
    expect(wrapper.findAll('.el-icon.more')).toHaveLength(2)
    expect(wrapper.find('.number.active').text()).toBe('10')
  })

  it('when pageCount less', () => {
    const pager = new Pager({ total: 2, size: 1, current: 1, viewCount: 7 })

    const wrapper = mount(ElPager, {
      props: {
        pager
      }
    })

    expect(wrapper.findAll('.number')).toHaveLength(2)
    expect(wrapper.findAll('.number').map((item) => item.text())).toEqual([
      '1',
      '2'
    ])
    expect(wrapper.find('.number.active').text()).toBe('1')
  })

  it('more btn mouse enter and leave', async () => {
    const pager = new Pager({ total: 100, size: 1, current: 50, viewCount: 7 })

    const wrapper = mount(ElPager, {
      props: {
        pager
      }
    })

    const quickPrev = wrapper.find('.btn-quickprev')
    const quickNext = wrapper.find('.btn-quicknext')

    await quickPrev.trigger('mouseenter')
    await quickNext.trigger('mouseenter')

    expect(quickPrev.classes()).toContain('el-icon-d-arrow-left')
    expect(quickNext.classes()).toContain('el-icon-d-arrow-right')

    await quickPrev.trigger('mouseleave')
    await quickNext.trigger('mouseleave')

    expect(quickPrev.classes()).toContain('el-icon-more')
    expect(quickNext.classes()).toContain('el-icon-more')
  })
})
