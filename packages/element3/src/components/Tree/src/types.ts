import { TK } from './entity/TreeNode'

export type RawNodeBase = Record<string, any | RawNodeBase[]>

export type KeyMap = Record<string, string>

export type DefaultNodeKey<RawNode extends RawNodeBase> = {
  [k in TK]?: keyof RawNode
}
