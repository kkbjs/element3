import { getCurrentInstance, onMounted } from 'vue'

export function useTree(refName) {
  const instance: any = getCurrentInstance()
  return {
    filter(value) {
      return instance.proxy.$refs[refName].filter(value)
    },
    updateKeyChildren(key, data) {
      return instance.proxy.$refs[refName].updateKeyChildren(key, data)
    },
    getCheckedNodes() {
      return instance.proxy.$refs[refName].getCheckedNodes()
    },
    setCheckedNodes(nodes) {
      return instance.proxy.$refs[refName].setCheckedNodes(nodes)
    },
    getCheckedKeys() {
      return instance.proxy.$refs[refName].getCheckedKeys()
    },
    setCheckedKeys(ids) {
      return instance.proxy.$refs[refName].setCheckedKeys(ids)
    },
    setChecked(id, checked, deep) {
      return instance.proxy.$refs[refName].setChecked(id, checked, deep)
    },
    getHalfCheckedNodes() {
      return instance.proxy.$refs[refName].getHalfCheckedNodes()
    },
    getHalfCheckedKeys() {
      return instance.proxy.$refs[refName].getHalfCheckedKeys()
    },
    getCurrentKey() {
      return instance.proxy.$refs[refName].getCurrentKey()
    },
    getCurrentNode() {
      return instance.proxy.$refs[refName].getCurrentNode()
    },
    setCurrentKey(key) {
      return instance.proxy.$refs[refName].setCurrentKey(key)
    },
    setCurrentNode(node) {
      return instance.proxy.$refs[refName].setCurrentNode(node)
    },
    getNode(target) {
      return instance.proxy.$refs[refName].getNode(target)
    },
    remove(target) {
      return instance.proxy.$refs[refName].remove(target)
    },
    append(data, parentNode) {
      return instance.proxy.$refs[refName].append(data, parentNode)
    },
    insertBefore(data, node) {
      return instance.proxy.$refs[refName].insertBefore(data, node)
    },
    insertAfter(node, data) {
      return instance.proxy.$refs[refName].insertAfter(node, data)
    },
    findOne(target) {
      return instance.proxy.$refs[refName].findOne(target)
    },
    findMany(callback) {
      return instance.proxy.$refs[refName].findMany(callback)
    }
  }
}
