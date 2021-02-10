import { mount } from '@vue/test-utils'
import { ref, nextTick, onMounted } from 'vue'
import ElTree from '../src/Tree.vue'
import { useTree } from './../src/useTree'

describe('Tree.vue', () => {
  it('test filter-node-method and filter', async () => {
    const rawNodes = [
      {
        id: 1,
        label: 'Node1',
        children: [
          {
            id: 11,
            label: 'Node1-1'
          }
        ]
      },
      {
        id: 2,
        label: 'Node2',
        children: [
          {
            id: 21,
            label: 'Node2-1'
          }
        ]
      }
    ]

    const wrapper = mount(ElTree, {
      props: {
        data: rawNodes,
        renderAfterExpand: false,
        expandAllNode: true,
        filterNodeMethod: (value, rawNode) => rawNode.label.includes(value)
        // There is a label filter by default
      }
    })

    wrapper.vm.filter('2-1')
    await nextTick()
    expect(wrapper.findAll('.is-hidden').map((w) => w.element.id)).toEqual([
      'TreeNode1',
      'TreeNode11'
    ])
  })

  it('test useTree method', () => {
    const rawNodes = [
      {
        id: 1,
        label: 'Node1',
        children: [
          {
            id: 11,
            label: 'Node1-1'
          }
        ]
      },
      {
        id: 2,
        label: 'Node2',
        children: [
          {
            id: 21,
            label: 'Node2-1'
          }
        ]
      }
    ]

    mount({
      template: `
        <el-tree :data="data" ref="tree"></el-tree>
      `,
      components: { ElTree },
      setup() {
        const { findOne } = useTree('tree')

        onMounted(() => {
          expect(findOne(11).id).toBe(11)
        })

        return {
          data: rawNodes
        }
      }
    })

    expect.assertions(1)
  })
})
