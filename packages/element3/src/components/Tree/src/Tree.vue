<template>
  <el-tree-main
    ref="treeMain"
    v-model="_modelValue"
    :defaultNodeKey="_defaultNodeKey"
    :async="_async"
    :asyncLoader="_asyncLoader"
    :renderContent="_renderContent"
    :currentNodeKey="currentKey"
  >
  </el-tree-main>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import ElTreeMain from './TreeMain.vue'
/**
 * Compatibility layer components designed for older APIs.
 */
export default defineComponent({
  name: 'ElTree',
  components: { ElTreeMain },
  props: {
    data: Array,
    modelValue: Array,

    defaultNodeKey: Object,
    props: Object,

    filterNodeMethod: Function,

    async: Boolean,
    lazy: Boolean,

    asyncLoader: Function,
    load: Function,

    renderContent: Function,
    currentNodeKey: [String, Number]
  },
  emits: ['update:modelValue', 'update:data'],
  computed: {
    _modelValue: {
      get() {
        return this.modelValue ?? this.data
      },
      set(v) {
        this.$emit('update:modelValue', v)
        this.$emit('update:data', v)
      }
    },
    _defaultNodeKey() {
      return this.defaultNodeKey ?? this.props
    },
    _async() {
      return this.async || this.lazy
    },
    _asyncLoader() {
      return this.asyncLoader ?? this.load
    },
    _renderContent() {
      if (this.renderContent) {
        return this.renderContent
      }
      if (this.$slots.default) {
        return this.$slots.default
      }
      return null
    }
  },
  data() {
    return {
      currentKey: ''
    }
  },
  methods: {
    filter(value) {
      const tree = this.$refs.treeMain.tree
      if (typeof this.filterNodeMethod === 'function') {
        return tree.filter((currentNode) =>
          this.filterNodeMethod(
            value,
            tree.getRawNode(currentNode),
            currentNode
          )
        )
      } else {
        return tree.filter(value)
      }
    },
    updateKeyChildren(key, data) {
      this.findOne(key).appendChild(data)
    },
    getCheckedNodes() {
      this.$refs.treeMain.tree.getCheckedNodes()
    },
    setCheckedNodes(nodes) {
      this.$refs.treeMain.tree.setCheckedByIds(
        nodes.map((node) => node[this._defaultNodeKey.id])
      )
    },
    getCheckedKeys() {
      return this.$refs.treeMain.tree.getCheckedIds()
    },
    setCheckedKeys(ids) {
      this.$refs.treeMain.tree.setCheckedByIds(ids)
    },
    setChecked(id, checked, deep) {
      const node = this.findOne(id)
      node.setStrictly(deep)
      node.setChecked(checked)
    },
    getHalfCheckedNodes() {
      return this.$refs.treeMain.tree.getHalfCheckedNodes()
    },
    getHalfCheckedKeys() {
      return this.$refs.treeMain.tree.getHalfCheckedIds()
    },
    getCurrentKey() {
      return this.currentKey
    },
    getCurrentNode() {
      return this.findOne(this.currentKey)
    },
    setCurrentKey(key) {
      this.currentKey = key
    },
    setCurrentNode(node) {
      this.currentKey = node[this._defaultNodeKey.id]
    },
    getNode(target) {
      return this.findOne(target)
    },
    remove(target) {
      this.findOne(target).remove()
    },
    append(data, parentNode) {
      parentNode.appendChild(data)
    },
    insertBefore(data, node) {
      node.parent.insertChild(node.index, data)
    },
    insertAfter(node, data) {
      node.parent.insertChild(node.index + 1, data)
    },
    findOne(target) {
      return this.$refs.treeMain.tree.rootProxy.findOne(target)
    },
    findMany(callback) {
      return this.$refs.treeMain.tree.rootProxy.findMany(callback)
    }
  },
  created() {
    this.currentKey = this.currentNodeKey
  }
})
</script>
