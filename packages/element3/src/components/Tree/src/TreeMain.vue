<template>
  <div
    class="el-tree"
    :class="{
      'el-tree--highlight-current': highlightCurrent
    }"
    role="Tree"
    @keydown="handleKeydown"
  >
    <el-tree-node
      v-for="child in tree.rootProxy.children"
      :node="child"
      :key="child.id"
    >
    </el-tree-node>
    <div class="el-tree__empty-block" v-if="tree.isEmpty">
      <span class="el-tree__empty-text">{{ emptyText }}</span>
    </div>
    <div
      v-show="
        dragState.current &&
        (dragState.drop === 'top' || dragState.drop === 'bottom')
      "
      class="el-tree__drop-indicator"
      ref="dropIndicator"
    ></div>
  </div>
</template>

<script lang="ts">
import {
  getCurrentInstance,
  onMounted,
  onUpdated,
  PropType,
  provide,
  ref,
  watchEffect
} from 'vue'
import { t } from '../../../locale'
import ElTreeNode from './TreeNode.vue'
import { Tree } from './entity/Tree'
import { AsyncLoader, ID } from './entity/TreeNode'
import { DefaultNodeKey, RawNodeBase } from './types'
import { isFunction } from '../../../utils/types'
export default {
  name: 'ElTreeMain',
  components: { ElTreeNode },
  props: {
    modelValue: { type: Array, default: () => [] },
    emptyText: { type: String, default: () => t('el.tree.emptyText') },
    defaultNodeKey: Object as PropType<DefaultNodeKey<RawNodeBase>>,
    indent: { type: Number, default: 18 },

    checked: { type: Array as PropType<ID[]>, default: () => [] },
    showCheckbox: Boolean,
    checkOnClickNode: Boolean,
    checkStrictly: Boolean,

    iconClass: { type: String, default: 'el-icon-caret-right' },
    renderAfterExpand: { type: Boolean, default: true },
    accordion: Boolean,
    autoExpandParent: { type: Boolean, default: true },
    expandOnClickNode: { type: Boolean, default: true },
    expanded: { type: Array as PropType<ID[]>, default: () => [] },
    defaultExpandAll: Boolean,

    async: Boolean,
    asyncLoader: Function as PropType<AsyncLoader>,

    renderContent: Function,

    highlightCurrent: Boolean,
    currentNodeKey: [String, Number],

    draggable: { type: Boolean, default: false },
    allowDrag: Function,
    allowDrop: Function
  },
  emits: [
    'update:modelValue',
    'update:checked',
    'update:expanded',
    'node-click',
    'node-contextmenu',
    'check-change',
    'check',
    'current-change',
    'node-expand',
    'node-collapse',
    'node-drag-start',
    'node-drag-enter',
    'node-drag-leave',
    'node-drag-over',
    'node-drag-end',
    'node-drop'
  ],
  setup(props, ctx) {
    const elTree = getCurrentInstance().proxy
    provide('elTree', elTree)
    const tree = new Tree(props.modelValue, props.defaultNodeKey)
    ctx.emit('update:modelValue', tree.rawNodesProxy)
    // ctx.expose(tree.rootProxy)

    if (props.async) tree.bindAsyncLoader(props.asyncLoader)

    useExpanded(tree)
    useCheckbox(tree)

    const {
      dragState,
      dropIndicator,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
      handleDrop
    } = useDrag()

    useTabKeyDown()

    const { handleKeydown } = useDirectionKeyDown()

    return {
      tree,

      dragState,
      dropIndicator,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
      handleDrop,
      handleKeydown
    }
  }
}

function useExpanded(tree) {
  const ctx = getCurrentInstance()
  const props: any = ctx.proxy.$props
  tree.expandNodeByIds(props.expanded)
  watchEffect(
    () => {
      tree.expandNodeByIds(props.expanded)
    },
    {
      flush: 'post'
      // exec after wait component flush
    }
  )
  watchEffect(() => {
    ctx.emit('update:expanded', tree.getExpandedNodeIds())
  })
}

function useCheckbox(tree) {
  const ctx = getCurrentInstance()
  const props: any = ctx.proxy.$props
  tree.setStrictly(props.checkStrictly)
  tree.setCheckedByIds(props.checked)
  watchEffect(
    () => {
      tree.setCheckedByIds(props.checked)
    },
    {
      flush: 'post'
      // exec after wait component flush
    }
  )
  watchEffect(() => {
    ctx.emit('update:checked', tree.getCheckedIds())
  })

  if (props.defaultExpandAll) tree.expandAll(true)
}

function useTabKeyDown() {
  const instance = getCurrentInstance()
  const { proxy } = instance

  const initCheckbox = () => {
    const checkboxItems = proxy.$el.querySelectorAll('input[type=checkbox]')
    Array.prototype.forEach.call(checkboxItems, (checkbox) => {
      checkbox.setAttribute('tabindex', -1)
    })
  }
  const initTabIndex = () => {
    const treeItems = proxy.$el.querySelectorAll('.is-focusable[role=TreeItem]')
    const checkedItem = proxy.$el.querySelectorAll('.is-checked[role=TreeItem]')
    if (checkedItem.length) {
      checkedItem[0].setAttribute('tabindex', 0)
      return
    }
    treeItems[0] && treeItems[0].setAttribute('tabindex', 0)
  }

  onMounted(initTabIndex)
  onUpdated(initCheckbox)
}

function useDirectionKeyDown() {
  const instance = getCurrentInstance()
  const { proxy } = instance
  const handleKeydown = (ev) => {
    const currentItem = ev.target
    if (currentItem.className.indexOf('el-tree-node') === -1) return
    const { key } = ev
    const treeItems = proxy.$el.querySelectorAll('.is-focusable[role=TreeNode]')
    const treeItemArray = Array.prototype.slice.call(treeItems)
    const currentIndex = treeItemArray.indexOf(currentItem)
    let nextIndex
    if (['ArrowUp', 'ArrowDown'].indexOf(key) > -1) {
      // up、down
      ev.preventDefault()
      if (key === 'ArrowUp') {
        // up
        nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0
      } else {
        nextIndex =
          currentIndex < treeItemArray.length - 1 ? currentIndex + 1 : 0
      }
      treeItemArray[nextIndex].focus() // 选中
    }
    if (['ArrowLeft', 'ArrowRight'].indexOf(key) > -1) {
      // left、right 展开
      currentItem.click() // 选中
      ev.preventDefault()
    }
    const hasInput = currentItem.querySelector('[type="checkbox"]')
    if (['Enter', 'Space'].indexOf(key) > -1 && hasInput) {
      // space enter选中checkbox
      hasInput.click()
      ev.preventDefault()
    }
  }

  return {
    handleKeydown
  }
}

function useDrag() {
  const instance = getCurrentInstance()
  const { emit, proxy } = instance
  const props: any = proxy.$props

  const dropIndicator = ref()

  const dragState = {
    start: null /* TreeNode */,
    current: null /* TreeNode */,
    last: null /* TreeNode */,
    drop: '' /* String => prev | inner | next */
  }
  const handleDragStart = (node, e) => {
    if (isFunction(props.allowDrag) && !props.allowDrag(node, e)) {
      e.preventDefault()
      return false
    }
    dragState.start = node
    emit('node-drag-start', node, e)
  }
  const handleDragOver = (node, e) => {
    dragState.current = node
    if (dragState.start === node) return
    const margin = 7 /*px*/
    const target = e.path.find((item) => item.id === 'TreeNode' + node.id)
    const currentBound = target.getBoundingClientRect()
    const mourseY = e.clientY

    if (currentBound.top + margin > mourseY) {
      dropIndicator.value.style.top = target.offsetTop + 'px'
      dropIndicator.value.style.left = node.level * props.indent + 'px'
      dragState.drop = 'prev'
    } else if (currentBound.top + currentBound.height - margin < mourseY) {
      dropIndicator.value.style.top =
        target.offsetTop + currentBound.height + 'px'
      dropIndicator.value.style.left = node.level * props.indent + 'px'
      dragState.drop = 'next'
    } else {
      dragState.drop = 'inner'
      node.expand(true)
    }

    // wrap in try catch to address IE's error when first param is 'text/plain'
    // setData is required for draggable to work in FireFox
    // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
    e &&
      e.dataTransfer &&
      isFunction(e.dataTransfer.setData) &&
      e.dataTransfer.setData('text/plain', '')
    e.preventDefault()

    emit('node-drag-enter', dragState.start, node, e)
    emit('node-drag-over', dragState.start, node, e)
    emit('node-drag-leave', dragState.start, dragState.last, e)
    dragState.last = node
  }

  const handleDragEnd = (node, e) => {
    dragState.current = null
    emit('node-drag-end', dragState.start, node, e)
  }

  const handleDrop = (node, e) => {
    if (
      isFunction(typeof props.allowDrog) &&
      !props.allowDrog(dragState.start, node, dragState.drop, e)
    ) {
      e.preventDefault()
      return false
    }
    dragState.last = node
    dragState.start.move(node, dragState.drop)
    emit('node-drop', dragState.start, node, e)
  }

  return {
    dragState,
    dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop
  }
}
</script>
