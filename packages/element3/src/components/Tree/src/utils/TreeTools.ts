import { isObject } from '../../../../utils/types'

export class TreeTools {
  private tree
  private childKey
  constructor(tree, childKey) {
    this.tree = tree
    this.childKey = childKey
  }

  depthEach(callback) {
    const dfs = (node) => {
      const forChild = () => node[this.childKey]
      const forChildItem = (index) => forChild()[index]
      callback(node)
      for (let i = 0; i < forChild()?.length; i++) {
        dfs(forChildItem(i))
      }
    }
    dfs(this.tree)
  }

  depthMap(callback, mapChildKey) {
    const dfs = (node) => {
      const forChild = () => node[this.childKey]
      const forChildItem = (index) => forChild()[index]
      const _node = callback(node)
      const _child = []
      for (let i = 0; i < forChild()?.length; i++) {
        _child.push(dfs(forChildItem(i)))
      }
      if (isObject(_node)) _node[mapChildKey] = _child
      return _node
    }
    return dfs(this.tree)
  }
}
