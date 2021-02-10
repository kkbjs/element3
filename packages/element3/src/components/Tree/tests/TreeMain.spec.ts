import { mount } from '@vue/test-utils'
import { h, nextTick, reactive, ref } from 'vue'
import { t } from '../../../locale'
import TreeMain from '../src/TreeMain.vue'

describe('TreeMain.vue', () => {
  it('show tree data', () => {
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
        label: 'Node2'
      }
    ]
    const wrapper = mount(TreeMain, {
      props: {
        modelValue: rawNodes,
        renderAfterExpand: false
      }
    })

    expect(wrapper.find('#TreeNode1').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode11').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode2').exists()).toBeTruthy()
  })

  it('when modelValue is null', () => {
    const rawNodes = []
    const wrapper = mount(TreeMain, {
      props: {
        modelValue: rawNodes,
        renderAfterExpand: false
      }
    })

    expect(wrapper.text()).toEqual(t('el.tree.emptyText'))
  })
  it('reactive tree data', async () => {
    const wrapper = mount({
      template: `
        <el-Tree-main v-model="nodes" :renderAfterExpand="false"></el-Tree-main>
      `,
      components: { elTreeMain: TreeMain },
      setup() {
        const nodes = ref([
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
            label: 'Node2'
          }
        ])
        return {
          nodes
        }
      }
    })

    expect(wrapper.find('#TreeNode1').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode11').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode2').exists()).toBeTruthy()
    wrapper.vm.nodes.push({
      id: 3,
      label: 'Node3'
    })
    await nextTick()
    expect(wrapper.find('#TreeNode3').exists()).toBeTruthy()
    wrapper.vm.nodes.push({
      id: 4,
      label: 'Node4'
    })
    await nextTick()
    expect(wrapper.find('#TreeNode4').exists()).toBeTruthy()
  })
  it('reactive tree data(OptionsAPI)', async () => {
    const wrapper = mount({
      template: `
        <el-Tree-main v-model="nodes" :renderAfterExpand="false"></el-Tree-main>
      `,
      components: { elTreeMain: TreeMain },
      data() {
        return {
          nodes: [
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
              label: 'Node2'
            }
          ]
        }
      }
    })

    expect(wrapper.find('#TreeNode1').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode11').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode2').exists()).toBeTruthy()
    wrapper.vm.nodes.push(
      reactive({
        id: 3,
        label: 'Node3'
      })
    )
    await nextTick()
    expect(wrapper.find('#TreeNode3').exists()).toBeTruthy()
  })

  it('Realize node multi - selection function', async () => {
    const wrapper = mount({
      template: `
        <el-Tree-main v-model="nodes" v-model:checked="checked" show-checkbox :renderAfterExpand="false"></el-Tree-main>
      `,
      components: { elTreeMain: TreeMain },
      setup() {
        const nodes = ref([
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
            label: 'Node2'
          }
        ])
        const checked = ref([1])
        return {
          nodes,
          checked
        }
      }
    })

    await nextTick()
    expect(wrapper.find('#TreeNode1').classes()).toContain('is-checked')
    expect(wrapper.find('#TreeNode11').classes()).toContain('is-checked')
    expect(wrapper.vm.checked).toEqual([1, 11])

    const node2Checkbox = wrapper
      .findComponent('#TreeNode2')
      .findComponent({ name: 'ElCheckbox' })

    await node2Checkbox.trigger('click')
    expect(wrapper.vm.checked).toEqual([1, 11, 2])
  })

  it('Based on the check-on-click-node implementation, whether the node is selected when the node is clicked', async () => {
    const wrapper = mount({
      template: `
        <el-tree-main v-model="nodes" v-model:checked="checked" show-checkbox check-on-click-node :renderAfterExpand="false"></el-tree-main>
      `,
      components: { elTreeMain: TreeMain },
      setup() {
        const nodes = ref([
          {
            id: 1,
            label: 'Node1'
          },
          {
            id: 2,
            label: 'Node2'
          }
        ])
        const checked = ref([])
        return {
          nodes,
          checked
        }
      }
    })

    await nextTick()

    const node2 = wrapper.find('#TreeNode2 .el-tree-node__content')

    await node2.trigger('click')
    expect(wrapper.vm.checked).toEqual([2])
  })

  it('Implement, in the case of displaying checkboxes, whether to strictly follow the parent-child discordant practice', async () => {
    const wrapper = mount({
      template: `
        <el-tree-main v-model="nodes" v-model:checked="checked" show-checkbox check-strictly :renderAfterExpand="false"></el-tree-main>
      `,
      components: { elTreeMain: TreeMain },
      setup() {
        const nodes = ref([
          {
            id: 1,
            label: 'Node1',
            children: [
              {
                id: 2,
                label: 'Node2'
              }
            ]
          }
        ])
        const checked = ref([])
        return {
          nodes,
          checked
        }
      }
    })

    await nextTick()

    const node2 = wrapper.find('#TreeNode2 .el-tree-node__content input')

    await node2.trigger('click')
    expect(wrapper.vm.checked).toEqual([2])
  })

  it('expand a node', async () => {
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
      }
    ]
    const wrapper = mount(TreeMain, {
      props: {
        modelValue: rawNodes,
        renderAfterExpand: false
      }
    })
    await wrapper.find('#TreeNode1 .el-tree-node__expand-icon').trigger('click')
    expect(wrapper.find('#TreeNode1').classes()).toContain('is-expanded')
  })

  it('expand a node and vModel expanded', async () => {
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
    const expanded = ref([1])
    const wrapper = mount(TreeMain, {
      props: {
        modelValue: rawNodes,
        renderAfterExpand: false,
        expanded: expanded,
        'onUpdate:expanded'(v) {
          expanded.value = v
        }
      }
    })
    await nextTick()
    await wrapper.find('#TreeNode2 .el-tree-node__expand-icon').trigger('click')
    expect(wrapper.find('#TreeNode1').classes()).toContain('is-expanded')
    expect(expanded.value).toEqual([1, 2])
  })

  it('Test asynchronously loaded data', async () => {
    const rawNodes = ref([])
    const wrapper = mount(TreeMain, {
      props: {
        modelValue: rawNodes.value,
        defaultExpandAll: true,
        async: true,
        asyncLoader(node, resolve) {
          if (node.level > 1) {
            return resolve([])
          }
          if (node.level === 0) {
            return resolve([{ id: 1, label: 'test' }])
          }
          resolve([
            {
              id: 2,
              label: 'test'
            },
            {
              id: 3,
              label: 'test',
              isLeaf: true
            }
          ])
        },
        renderAfterExpand: false,
        'onUpdate:modelValue'(v) {
          rawNodes.value = v
        }
      }
    })
    await nextTick()
    expect(wrapper.find('#TreeNode1').exists()).toBeTruthy()
    expect(rawNodes.value).toEqual([
      {
        id: 1,
        label: 'test',
        children: [
          {
            id: 2,
            label: 'test',
            children: []
          },
          {
            id: 3,
            label: 'test',
            children: []
          }
        ]
      }
    ])
  })

  it('render-content method DIY node content', () => {
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
        label: 'Node2'
      }
    ]
    const wrapper = mount(TreeMain, {
      props: {
        modelValue: rawNodes,
        renderAfterExpand: false,
        renderContent({ node, data }) {
          return h('span', node.level + data.label)
        }
      }
    })

    expect(wrapper.text()).toBe('1Node12Node1-11Node2')
  })

  it('#default slot method DIY node content', () => {
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
        label: 'Node2'
      }
    ]
    const wrapper = mount(TreeMain, {
      props: {
        modelValue: rawNodes,
        renderAfterExpand: false
      },
      slots: {
        default({ node, data }) {
          return h('span', node.level + data.label)
        }
      }
    })

    expect(wrapper.text()).toBe('1Node12Node1-11Node2')
  })
})
