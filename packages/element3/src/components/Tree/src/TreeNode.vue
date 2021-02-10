<template>
  <div
    v-show="node.isVisible"
    class="el-tree-node"
    :class="{
      'is-checked': node.isChecked,
      'is-focusable': !node.isDisabled,
      'is-expanded': node.isExpanded,
      'is-hidden': !node.isVisible,
      'is-current': elTree.dragState.current === node,
      'is-drop-inner':
        elTree.dragState.drop === 'inner' && elTree.dragState.current === node
    }"
    role="TreeNode"
    :aria-expanded="node.isExpanded"
    :aria-disabled="node.isDisabled"
    :aria-checked="node.isChecked"
    :aria-visible="node.isVisible"
    tabindex="-1"
    :id="'TreeNode' + node.id"
    :data-node-id="node.id"
    :draggable="elTree.draggable"
    @click.right.prevent="onRightEvent"
    @click.stop="onClickTreeNode"
    @dragstart.stop="elTree.handleDragStart(node, $event)"
    @dragover.stop="elTree.handleDragOver(node, $event)"
    @dragend.stop="elTree.handleDragEnd(node, $event)"
    @drop.stop="elTree.handleDrop(node, $event)"
  >
    <div
      class="el-tree-node__content"
      :style="{ 'padding-left': (node.level - 1) * elTree.indent + 'px' }"
      @click="onClickTreeNodeContent"
    >
      <span
        :class="[
          { expanded: node.isExpanded, 'is-leaf': node.isLeaf },
          'el-tree-node__expand-icon',
          elTree.iconClass
        ]"
        @click.stop="onClickTreeNodeExpand"
      >
      </span>
      <el-checkbox
        v-if="elTree.showCheckbox"
        :modelValue="node.isChecked"
        :indeterminate="node.isIndeterminate"
        :disabled="node.isDisabled"
        @click.prevent.stop="onClickCheckbox"
      >
      </el-checkbox>
      <span
        v-if="node.asyncState === 'loading'"
        class="el-tree-node__loading-icon el-icon-loading"
      ></span>
      <el-node-content :node="node"></el-node-content>
    </div>
    <el-collapse-transition>
      <div
        v-show="node.isExpanded"
        v-if="!elTree.renderAfterExpand || node.isRendered"
        class="el-tree-node__children"
        role="group"
        :aria-expanded="node.isExpanded"
      >
        <el-tree-node
          v-for="child in node.children"
          :key="child.id"
          :node="child"
        >
        </el-tree-node>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script lang="ts">
import ElCollapseTransition from '../../../transitions/collapse-transition'
import ElNodeContent from './NodeContent.vue'
import { ElCheckbox } from '../../../index'
import { TreeNode } from './entity/TreeNode'
import { getCurrentInstance, inject } from 'vue'
export default {
  name: 'ElTreeNode',

  components: {
    ElCollapseTransition,
    ElNodeContent,
    ElCheckbox
  },

  props: {
    node: TreeNode
  },

  setup(props) {
    const vm = getCurrentInstance().proxy
    const elTree: any = inject('elTree', {
      indent: 10,
      checkOnClickNode: false,
      accordion: false,
      autoExpandParent: true,
      expandOnClickNode: true
    })
    const onClickCheckbox = () => {
      elTree.$emit(
        'check',
        elTree.tree.getCheckedNodes(),
        elTree.tree.getCheckedIds(),
        elTree.tree.getHalfCheckedNodes(),
        elTree.tree.getHalfCheckedIds()
      )
      props.node.setChecked()
      elTree.$emit(
        'check-change',
        props.node.data,
        props.node.isChecked,
        props.node.findMany((node) => node.isChecked)
      )
    }

    const onClickTreeNodeExpand = () => {
      if (elTree.accordion) props.node.collapse()
      else props.node.expand(!props.node.isExpanded, elTree.autoExpandParent)
    }

    const onClickTreeNodeContent = () => {
      if (elTree.checkOnClickNode) {
        onClickCheckbox()
      }
      if (elTree.expandOnClickNode) {
        onClickTreeNodeExpand()
      }
      if (elTree.currentNodeKey === props.node.id) {
        elTree.$emit('current-change', props.node.data, props.node)
      }
      props.node.isExpanded
        ? elTree.$emit('node-expand', props.node.data, props.node)
        : elTree.$emit('node-collapse', props.node.data, props.node)

      elTree.$emit(
        'check-change',
        props.node.data,
        props.node.isChecked,
        props.node.findMany((node) => node.isChecked)
      )
    }

    const onClickTreeNode = () => {
      elTree.$emit('node-click', props.node.data, props.node, vm)
    }

    const onRightEvent = (e) => {
      elTree.$emit('node-contextmenu', props.node, e)
    }

    return {
      elTree,
      onClickCheckbox,
      onClickTreeNodeContent,
      onClickTreeNode,
      onClickTreeNodeExpand,
      onRightEvent
    }
  }
}
</script>
