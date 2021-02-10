import { reactive } from 'vue'
import { isFunction } from '../../../../utils/types'
import { RawNodeBase } from '../types'
import { Watcher } from '../utils/Watcher'

export type ID = string | number

let idSeed = 0

export type HandlerCb = (
  currentNode: TreeNode,
  parentNode: TreeNode,
  level: number
) => boolean | void | Promise<void>

export type AsyncState = 'notLoaded' | 'loaded' | 'loading'

export type AsyncLoader = (node: TreeNode, resolve: Resolver) => void

export type Resolver = (nodes: TreeNode[]) => void

export type MoveRelative = 'prev' | 'inner' | 'next'

export interface TreeNodePublicProp {
  id: ID
  label: string
  children: TreeNode[]
  isChecked: boolean
  isLeaf: boolean
}

export type TK = Extract<keyof TreeNode, keyof TreeNodePublicProp>

export class TreeNode<RawNode = any> implements TreeNodePublicProp {
  id: ID
  label: string
  parent: TreeNode
  children: TreeNode[] = []
  private _isLeaf: boolean
  private _isChecked: boolean
  private _isStrictly: boolean
  private _isDisabled: boolean
  private _isExpanded: boolean
  private _isRendered = false
  private _isVisible: boolean
  private _isAsync: boolean
  private _asyncLoader: AsyncLoader
  private _asyncState: AsyncState
  private _data: RawNode
  private _mapper: any

  get data(): RawNode {
    if (!this._data && this._mapper) {
      this._data = this._mapper.getRawNode(this)
    }
    return this._data
  }

  get asyncState(): AsyncState {
    return this._asyncState
  }

  get asyncLoader() {
    if (typeof this._asyncLoader === 'function') {
      return this._asyncLoader
    }
    return (this._asyncLoader = this.parent?.asyncLoader)
  }

  get isAsync(): boolean {
    if (this._isAsync) {
      return this._isAsync
    }
    return (this._isAsync = this.parent?.isAsync ?? false)
  }

  get isVisible(): boolean {
    return this._isVisible
  }

  set isVisible(v: boolean) {
    this._isVisible = v
  }

  get isRendered(): boolean {
    return this._isRendered
  }

  get isExpanded(): boolean {
    return this._isExpanded
  }

  get isDisabled(): boolean {
    return this._isDisabled
  }

  set isDisabled(v: boolean) {
    this._isDisabled = v
  }

  get isStrictly(): boolean {
    if (this._isStrictly) {
      return true
    }

    return (this._isStrictly = this.parent?.isStrictly ?? false)
  }

  get isIndeterminate(): boolean {
    if (this.isStrictly) {
      return false
    }

    const checkedLen = this.getCheckedNodes().length
    if (this.isLeaf || checkedLen === 0) {
      return false
    }

    return checkedLen !== this.children.length
  }

  get isChecked(): boolean {
    if (
      this.isLeaf ||
      this.isStrictly ||
      (this.isAsync && this._asyncState !== 'loaded')
    ) {
      return this._isChecked
    }

    return (this._isChecked =
      this.getCheckedNodes().length === this.children.length)
  }

  get level(): number {
    return (this.parent?.level ?? -1) + 1
  }

  get isLeaf(): boolean {
    if (this.isAsync && this._asyncState !== 'loaded') {
      return this._isLeaf
    }
    return this.children.length === 0
  }

  set isLeaf(v: boolean) {
    this._isLeaf = v
  }

  get index(): number {
    return this.parent.children.findIndex((node) => node === this)
  }

  constructor(
    id: ID,
    label: string,
    children: TreeNode[] = [],
    {
      isLeaf = false,
      isChecked = false,
      isStrictly = false,
      isDisabled = false,
      isExpanded = false,
      isVisible = true,
      isAsync = false,
      asyncLoader = null,
      data = null,
      mapper = null
    } = {}
  ) {
    this.id = id ?? idSeed++
    this.label = label
    this._isLeaf = isLeaf
    this._isStrictly = isStrictly
    this._isDisabled = isDisabled
    this._isExpanded = isExpanded
    this._isVisible = isVisible
    this._isAsync = isAsync
    this._asyncLoader = asyncLoader
    this._asyncState = 'notLoaded'
    this._data = data
    this._mapper = mapper ?? this.parent?.getMapper()

    this.setChecked(isChecked)

    this.appendChild(...children)
  }
  getMapper(): any {
    return this._mapper ?? this.parent?.getMapper()
  }

  setChecked(v = !this._isChecked) {
    if (this._isDisabled) {
      return
    }
    this.setCheckedUnlimited(v)
  }

  setCheckedUnlimited(v = !this._isChecked): void {
    this._isChecked = v
    if (!this.isStrictly) {
      this.children.forEach((node) => node.setCheckedUnlimited(v))
    }
  }

  setStrictly(v: boolean): void {
    this._isStrictly = v
  }

  getCheckedNodes(): TreeNode[] {
    return this.children.filter((node) => node.isChecked)
  }

  appendChild(...nodes: TreeNode[] | RawNode[]) {
    nodes.forEach((node) => {
      if (!(node instanceof TreeNode)) {
        node = this._mapper.convertToTreeNode(node)
      }
      node.parent = Watcher.getRaw(this)
      this.children.push(node)
    })
  }

  insertChild(index: number, ...nodes: TreeNode[] | RawNode[]) {
    nodes.forEach((node) => {
      if (!(node instanceof TreeNode)) {
        node = this._mapper.convertToTreeNode(node)
      }
      node.parent = Watcher.getRaw(this)
    })
    this.children.splice(index, 0, ...(nodes as TreeNode[]))
  }

  removeChild(index: number, num = 1) {
    this.children.splice(index, num)
  }

  findOne(target: ID | TreeNode | HandlerCb): TreeNode {
    let result
    this.depthEach((currentNode) => {
      if (
        target === currentNode.id ||
        target === currentNode ||
        (typeof target === 'function' &&
          target(currentNode, currentNode.parent, currentNode.level))
      ) {
        result = currentNode
        return true
      }
    })
    return result
  }

  findMany(target: string | HandlerCb) {
    const result = []
    this.depthEach((currentNode) => {
      if (
        (typeof target === 'string' && currentNode.label.includes(target)) ||
        (typeof target === 'function' &&
          target(currentNode, currentNode.parent, currentNode.level))
      ) {
        result.push(currentNode)
      }
    })
    return result
  }

  findChild(id: ID | TreeNode): TreeNode {
    return this.children.find((node) => node.id === id || node === id)
  }

  /**
   * Traverse upward
   */
  upwardEach(callback: HandlerCb, { isSkipSelf = true } = {}): Promise<void> {
    let current = isSkipSelf ? this.parent : this
    while (current) {
      if (callback(current, current.parent, current.level)) {
        return
      }
      current = current.parent
    }
  }

  /**
   * from current node start, down each
   */
  depthEach(upToDownCallBack: HandlerCb, downToUpCallBack?: HandlerCb): void {
    const dfs = (node, deep) => {
      for (let i = 0; i < node.children.length; i++) {
        const _node = node.children[i]
        if (isFunction(upToDownCallBack) && upToDownCallBack(_node, node, deep))
          return
        dfs(_node, deep + 1)
        if (isFunction(downToUpCallBack) && downToUpCallBack(node, _node, deep))
          return
      }
    }
    isFunction(upToDownCallBack) && upToDownCallBack(this, this.parent, 0)
    dfs(this, 1)
    isFunction(downToUpCallBack) && downToUpCallBack(this, this.parent, 0)
  }

  execAsyncLoader(cb = () => null) {
    if (this.isLeaf || !this.isAsync || this._asyncState !== 'notLoaded') {
      return
    }

    const resolver = (nodes: TreeNode[] | RawNode[]) => {
      this.appendChild(...nodes)
      this._asyncState = 'loaded'
      cb()
    }
    this._asyncState = 'loading'
    this.asyncLoader(this, resolver)
  }

  expand(
    v = !this._isExpanded,
    isAutoExpandParent = false,
    cb = () => null
  ): void {
    this._isExpanded = v
    if (v) {
      this._isRendered = true
      this.execAsyncLoader(cb)
    }
    if (!v && isAutoExpandParent) {
      this.children.forEach((node) => node.expand(false, true))
    }

    if (v && isAutoExpandParent) {
      this.parent?.expand(true, true)
    }
  }

  collapse(v = !this._isExpanded): void {
    const parent = this.parent
    if (!parent) {
      return
    }
    parent.children.forEach((node) => node.expand(false))
    this.expand(v)
  }

  show() {
    this._isVisible = true
    this.parent?.show()
  }
  hide() {
    this._isVisible = false
  }

  bindAsyncLoader(asyncLoader: AsyncLoader): void {
    this._isAsync = true
    this._asyncLoader = asyncLoader
  }

  remove() {
    if (!this.parent) {
      return
    }
    this.parent.removeChild(this.index)
    this.parent = null
  }

  move(target: TreeNode, relative: MoveRelative): boolean {
    if (target === this) {
      return false
    }

    if (this.findOne(target)) {
      return false
    }

    this.remove()
    switch (relative) {
      case 'prev':
        target.parent.insertChild(target.index, this)
        return true
      case 'inner':
        target.appendChild(this)
        target.expand(true, true)
        return true
      case 'next':
        target.parent.insertChild(target.index + 1, this)
        return true
    }
  }

  static create(
    id: ID,
    label: string,
    children: TreeNode[] = [],
    state: any = {}
  ): TreeNode {
    return reactive(new TreeNode(id, label, children, state)) as TreeNode
  }
}
