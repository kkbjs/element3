import { mount } from '@vue/test-utils'
import { Pager } from '../../src/entity/Pager'
import Total from '../../src/parts/Total.vue'

describe('Total.vue', () => {
  it('show total', () => {
    const wrapper = mount(Total, {
      props: {
        pager: new Pager({
          total: 10,
          size: 1,
          current: 2,
          viewCount: 7
        })
      }
    })

    expect(wrapper.text()).toBe(`共 ${10} 条`)
  })
})
