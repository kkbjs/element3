<script lang="ts">
import { TreeNode } from './entity/TreeNode'
import { h, inject } from 'vue'
export default {
  name: 'ElNodeContent',

  props: {
    node: {
      required: true,
      type: TreeNode
    }
  },

  setup(props) {
    const elTree: any = inject('elTree')
    return () => {
      if (typeof elTree.$slots.default === 'function') {
        return elTree.$slots.default({
          node: props.node,
          data: props.node.data
        })
      }
      if (typeof elTree.renderContent === 'function') {
        return elTree.renderContent({
          node: props.node,
          data: props.node.data
        })
      }

      return h(
        'span',
        {
          class: 'el-tree-node__label'
        },
        props.node.label
      )
    }
  }
}
</script>
