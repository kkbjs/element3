import { RawNodeBase } from '../types'
import { Tools } from '../utils/Tools'
import { Watcher } from '../utils/Watcher'
import { TreeNode } from './TreeNode'
import { DefaultNodeKey } from '../types'
import { reactive, toRaw } from 'vue'

const { createMap, reversalNodeKeyMap } = Tools

export class TreeMapper<RawNode extends RawNodeBase> {
  private _toTreeNode: WeakMap<RawNode, TreeNode> = new WeakMap()
  private _toRawNode: WeakMap<TreeNode, RawNode> = new WeakMap()
  private _toRawNodeKey: Map<string, string>
  private _toTreeNodeKey: Map<string, string>
  private _rawNodeWatcher: Watcher<RawNode>
  private _treeNodeWatcher: Watcher<TreeNode>
  private _rawNode: RawNode
  private _treeNode: TreeNode

  get rawNode(): RawNode {
    return this._rawNode
  }

  get treeNode(): TreeNode {
    return this._treeNode
  }

  get rawNodeProxy(): RawNode {
    return this._rawNodeWatcher.proxy
  }

  get treeNodeProxy(): TreeNode {
    return this._treeNodeWatcher.proxy
  }

  constructor(rawNode: RawNode, keyMap: DefaultNodeKey<RawNode>) {
    this.initNodeKey(keyMap)
    this.convertNode(rawNode)
    this.reactiveNode()
    this.withRawNodeHandler()
    this.withTreeNodeHandler()
  }

  private initNodeKey(keyMap: DefaultNodeKey<RawNode>) {
    this._toRawNodeKey = createMap(keyMap)
    this._toTreeNodeKey = reversalNodeKeyMap(this._toRawNodeKey)
  }

  private convertNode(rawNode: RawNode) {
    this._rawNode = rawNode
    this._treeNode = this.convertToTreeNode(rawNode)
  }

  private reactiveNode() {
    this._rawNodeWatcher = new Watcher(this._rawNode)
    this._treeNodeWatcher = new Watcher(this._treeNode)
  }

  convertToTreeNode(rawNode: RawNode): TreeNode {
    const treeNode = TreeNode.create(
      rawNode[this._toRawNodeKey.get('id')],
      rawNode[this._toRawNodeKey.get('label')],
      this.convertToTreeNodes(rawNode[this._toRawNodeKey.get('children')]),
      {
        isDisabled: rawNode[this._toRawNodeKey.get('isDisabled')],
        isLeaf: rawNode[this._toRawNodeKey.get('isLeaf')],
        isAsync: rawNode[this._toRawNodeKey.get('isAsync')],
        mapper: this
      }
    )
    const _rawNode = reactive(rawNode) as RawNode
    this._toTreeNode.set(_rawNode, treeNode)
    this._toRawNode.set(treeNode, _rawNode)
    return treeNode
  }

  convertToRawNode(treeNode: TreeNode): RawNode {
    const rawNode: any = {}

    if (this._toRawNodeKey.get('id')) {
      rawNode[this._toRawNodeKey.get('id')] = treeNode.id
    }
    if (this._toRawNodeKey.get('label')) {
      rawNode[this._toRawNodeKey.get('label')] = treeNode.label
    }
    if (this._toRawNodeKey.get('children')) {
      rawNode[this._toRawNodeKey.get('children')] = this.convertToRawNodes(
        treeNode.children
      )
    }
    const _treeNode = reactive(treeNode) as TreeNode
    const _rawNode = reactive(rawNode) as RawNode
    this._toTreeNode.set(_rawNode, _treeNode)
    this._toRawNode.set(_treeNode, _rawNode)
    return rawNode
  }

  convertToTreeNodes(rawNodes: RawNode[]): TreeNode[] {
    return rawNodes?.map((node: RawNode) => this.convertToTreeNode(node))
  }

  convertToRawNodes(treeNodes: TreeNode[]): RawNode[] {
    return treeNodes?.map((node: TreeNode) => this.convertToRawNode(node))
  }

  private withRawNodeHandler(): void {
    this._rawNodeWatcher.bindHandler(
      'set/arr/add',
      ({ currentNode, value }) => {
        this.forTreeNodeAppendChild(
          this.getTreeNode(currentNode),
          this.convertToTreeNode(value)
        )
      }
    )

    this._rawNodeWatcher.bindHandler('set/arr/del', ({ currentNode, key }) => {
      this.forTreeNodeRemoveChild(this.getTreeNode(currentNode), Number(key))
    })

    this._rawNodeWatcher.bindHandler(
      'set/arr/put',
      ({ currentNode, key, value }) => {
        this.forTreeNodeUpdateChild(
          this.getTreeNode(currentNode),
          Number(key),
          this._toTreeNode.get(value) ?? this.convertToTreeNode(value)
        )
      }
    )

    this._rawNodeWatcher.bindHandler(
      'set/obj/put',
      ({ currentNode, key, value }) => {
        this.forTreeNodeUpdateValue(
          this.getTreeNode(currentNode),
          this._toTreeNodeKey.get(key),
          value
        )
      }
    )

    this._rawNodeWatcher.bindHandler(
      'set/obj/add',
      ({ currentNode, key, value }) => {
        this.forTreeNodeUpdateValue(
          this.getTreeNode(currentNode),
          this._toTreeNodeKey.get(key),
          value
        )
      }
    )
  }

  private withTreeNodeHandler(): void {
    this._treeNodeWatcher.bindHandler(
      'set/arr/add',
      ({ currentNode, value }) => {
        this.forRawNodeAppendChild(
          this.getRawNode(currentNode),
          this.convertToRawNode(value)
        )
      }
    )

    this._treeNodeWatcher.bindHandler('set/arr/del', ({ currentNode, key }) => {
      this.forRawNodeRemoveChild(this.getRawNode(currentNode), Number(key))
    })

    this._treeNodeWatcher.bindHandler(
      'set/arr/put',
      ({ currentNode, key, value }) => {
        this.forRawNodeUpdateChild(
          this.getRawNode(currentNode),
          Number(key),
          this.convertToRawNode(value)
        )
      }
    )

    this._treeNodeWatcher.bindHandler(
      'set/obj/put',
      ({ currentNode, key, value }) => {
        this.forRawNodeUpdateValue(
          this.getRawNode(currentNode),
          this._toRawNodeKey.get(key),
          value
        )
      }
    )

    this._treeNodeWatcher.bindHandler(
      'set/obj/add',
      ({ currentNode, key, value }) => {
        this.forRawNodeUpdateValue(
          this.getRawNode(currentNode),
          this._toRawNodeKey.get(key),
          value
        )
      }
    )
  }

  private forTreeNodeAppendChild(
    currentTreeNode: TreeNode,
    newTreeNode: TreeNode
  ): void {
    newTreeNode.parent = currentTreeNode
    currentTreeNode.children.push(newTreeNode)
  }

  private forTreeNodeUpdateValue(
    currentTreeNode: TreeNode,
    key: string,
    value: any
  ): void {
    if (key === 'children') {
      const treeNodes = this.convertToTreeNodes(value)
      treeNodes.forEach((node) => (node.parent = currentTreeNode))
      currentTreeNode[key] = treeNodes
    } else {
      currentTreeNode[key] = value
    }
  }

  private forTreeNodeRemoveChild(
    currentTreeNode: TreeNode,
    index: number
  ): void {
    // Here, the unused nodes of ToRawNode and ToTreeNode are automatically released through the WeakMap feature
    currentTreeNode.children.splice(index, 1)
  }

  private forTreeNodeUpdateChild(
    currentTreeNode: TreeNode,
    index: number,
    childNode: TreeNode
  ): void {
    childNode.parent = currentTreeNode
    currentTreeNode.children[index] = childNode
  }

  private forRawNodeAppendChild(
    currentRawNode: RawNode,
    newRawNode: RawNode
  ): void {
    if (!(currentRawNode[this._toRawNodeKey.get('children')] instanceof Array))
      (currentRawNode as any)[this._toRawNodeKey.get('children')] = []

    currentRawNode[this._toRawNodeKey.get('children')].push(newRawNode)
  }

  private forRawNodeUpdateValue(
    currentRawNode: RawNode,
    key: string,
    value: any
  ): void {
    if (key === this._toRawNodeKey.get('children')) {
      Reflect.set(currentRawNode, key, this.convertToRawNodes(value))
    } else if (Reflect.has(currentRawNode, key)) {
      Reflect.set(currentRawNode, key, value)
    }
  }

  private forRawNodeRemoveChild(currentRawNode: RawNode, index: number): void {
    // Here, the unused nodes of ToRawNode and ToTreeNode are automatically released through the WeakMap feature
    currentRawNode[this._toRawNodeKey.get('children')].splice(index, 1)
  }

  private forRawNodeUpdateChild(
    currentRawNode: RawNode,
    index: number,
    childNode: RawNode
  ): void {
    if (!(currentRawNode[this._toRawNodeKey.get('children')] instanceof Array))
      (currentRawNode as any)[this._toRawNodeKey.get('children')] = []
    currentRawNode[this._toRawNodeKey.get('children')][index] = childNode
  }

  getRawNode(treeNode: TreeNode): RawNode {
    return (
      this._toRawNode.get(Watcher.getRaw(treeNode)) ??
      this._toRawNode.get(treeNode) ??
      this._toRawNode.get(reactive(treeNode) as TreeNode)
    )
  }

  getTreeNode(rawNode: RawNode): TreeNode {
    return (
      this._toTreeNode.get(Watcher.getRaw(rawNode)) ??
      this._toTreeNode.get(rawNode) ??
      this._toTreeNode.get(reactive(rawNode) as RawNode)
    )
  }
}
