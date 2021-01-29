import { UnknownObject } from '../types'
import { Tools } from '../utils/Tools'
import { Watcher } from '../utils/Watcher'
import { TreeNode } from './TreeNode'

const { createMap, reversalNodeKeyMap } = Tools

export class TreeMapper<RawNode extends UnknownObject> {
  private _toTreeNode: WeakMap<RawNode, TreeNode>
  private _toRawNode: WeakMap<TreeNode, RawNode>
  private _toRawNodeKey: Map<string, string>
  private _toTreeNodeKey: Map<string, string>
  private _rawNodeWatcher: Watcher<RawNode>
  private _treeNodeWatcher: Watcher<TreeNode>
  rawNode: RawNode
  treeNode: TreeNode

  constructor(rawNode: RawNode, keyMap) {
    this._toTreeNode = new WeakMap()
    this._toRawNode = new WeakMap()
    this._toRawNodeKey = createMap(keyMap)
    this._toTreeNodeKey = reversalNodeKeyMap(this._toRawNodeKey)
    // init

    this.rawNode = rawNode
    this.treeNode = this.convertToTreeNode(rawNode)
    // build TreeNode

    this._rawNodeWatcher = new Watcher(this.rawNode)
    this._treeNodeWatcher = new Watcher(this.treeNode)
    this.withRawNodeHandler()
    this.withTreeNodeHandler()
    // for rawNode and treeNode reactive
  }

  getRawNodeProxy(): RawNode {
    return this._rawNodeWatcher.getProxy()
  }

  getTreeNodeProxy(): TreeNode {
    return this._treeNodeWatcher.getProxy()
  }

  convertToTreeNode(rawNode: RawNode): TreeNode {
    const treeNode = new TreeNode(
      rawNode[this._toRawNodeKey.get('id')],
      rawNode[this._toRawNodeKey.get('label')],
      this.convertToTreeNodes(rawNode[this._toRawNodeKey.get('children')]),
      {
        isChecked: rawNode[this._toRawNodeKey.get('isChecked')],
        isLeaf: rawNode[this._toRawNodeKey.get('isLeaf')]
      }
    )
    this._toTreeNode.set(rawNode, treeNode)
    this._toRawNode.set(treeNode, rawNode)
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

    this._toTreeNode.set(rawNode, treeNode)
    this._toRawNode.set(treeNode, rawNode)
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
        const currentTreeNode = this._toTreeNode.get(currentNode)
        this.forTreeNodeAppendChild(
          currentTreeNode,
          this.convertToTreeNode(value)
        )
      }
    )

    this._rawNodeWatcher.bindHandler('set/arr/del', ({ currentNode, key }) => {
      const currentTreeNode = this._toTreeNode.get(currentNode)
      this.forTreeNodeRemoveChild(currentTreeNode, Number(key))
    })

    this._rawNodeWatcher.bindHandler(
      'set/arr/put',
      ({ currentNode, key, value }) => {
        const currentTreeNode = this._toTreeNode.get(currentNode)
        this.forTreeNodeUpdateChild(
          currentTreeNode,
          Number(key),
          this._toTreeNode.get(value) ?? this.convertToTreeNode(value)
        )
      }
    )

    this._rawNodeWatcher.bindHandler(
      'set/obj/put',
      ({ currentNode, key, value }) => {
        const currentTreeNode = this._toTreeNode.get(currentNode)
        this.forTreeNodeUpdateValue(
          currentTreeNode,
          this._toTreeNodeKey.get(key),
          value
        )
      }
    )

    this._rawNodeWatcher.bindHandler(
      'set/obj/add',
      ({ currentNode, key, value }) => {
        const currentTreeNode = this._toTreeNode.get(currentNode)
        this.forTreeNodeUpdateValue(
          currentTreeNode,
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
        const currentRawNode = this._toRawNode.get(currentNode)
        this.forRawNodeAppendChild(currentRawNode, this.convertToRawNode(value))
      }
    )

    this._treeNodeWatcher.bindHandler('set/arr/del', ({ currentNode, key }) => {
      const currentRawNode = this._toRawNode.get(currentNode)
      this.forRawNodeRemoveChild(currentRawNode, Number(key))
    })

    this._treeNodeWatcher.bindHandler(
      'set/arr/put',
      ({ currentNode, key, value }) => {
        const currentRawNode = this._toRawNode.get(currentNode)
        this.forRawNodeUpdateChild(
          currentRawNode,
          Number(key),
          this.convertToRawNode(value)
        )
      }
    )

    this._treeNodeWatcher.bindHandler(
      'set/obj/put',
      ({ currentNode, key, value }) => {
        const currentRawNode = this._toRawNode.get(currentNode)
        this.forRawNodeUpdateValue(
          currentRawNode,
          this._toRawNodeKey.get(key),
          value
        )
      }
    )

    this._treeNodeWatcher.bindHandler(
      'set/obj/add',
      ({ currentNode, key, value }) => {
        const currentRawNode = this._toRawNode.get(currentNode)
        this.forRawNodeUpdateValue(
          currentRawNode,
          this._toRawNodeKey.get(key),
          value
        )
      }
    )
  }

  forTreeNodeAppendChild(
    currentTreeNode: TreeNode,
    newTreeNode: TreeNode
  ): void {
    currentTreeNode.children.push(newTreeNode)
  }

  forTreeNodeUpdateValue(
    currentTreeNode: TreeNode,
    key: string,
    value: any
  ): void {
    if (key === 'children') {
      currentTreeNode[key] = this.convertToTreeNodes(value)
    } else {
      currentTreeNode[key] = value
    }
  }

  forTreeNodeRemoveChild(currentTreeNode: TreeNode, index: number): void {
    // Here, the unused nodes of ToRawNode and ToTreeNode are automatically released through the WeakMap feature
    currentTreeNode.children.splice(index, 1)
  }

  forTreeNodeUpdateChild(
    currentTreeNode: TreeNode,
    index: number,
    childNode: TreeNode
  ): void {
    currentTreeNode.children[index] = childNode
  }

  forRawNodeAppendChild(currentRawNode: RawNode, newRawNode: RawNode): void {
    currentRawNode[this._toRawNodeKey.get('children')].push(newRawNode)
  }

  forRawNodeUpdateValue(
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

  forRawNodeRemoveChild(currentRawNode: RawNode, index: number): void {
    // Here, the unused nodes of ToRawNode and ToTreeNode are automatically released through the WeakMap feature
    currentRawNode[this._toRawNodeKey.get('children')].splice(index, 1)
  }

  forRawNodeUpdateChild(
    currentRawNode: RawNode,
    index: number,
    childNode: RawNode
  ): void {
    currentRawNode[this._toRawNodeKey.get('children')][index] = childNode
  }
}
