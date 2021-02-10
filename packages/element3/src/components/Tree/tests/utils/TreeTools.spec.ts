import { TreeTools } from '../../src/utils/TreeTools'

describe('TreeTools.ts', () => {
  it('depth traversal tree data', () => {
    const tree = {
      id: 1,
      label: 'hello',
      children: [
        {
          id: 2,
          label: 'hello2'
        },
        {
          id: 3,
          label: 'hello3'
        }
      ]
    }
    const treeTools = new TreeTools(tree, 'children')
    const cb = jest.fn()
    treeTools.depthEach(cb)

    expect(cb).toBeCalledTimes(3)
    expect(cb).toHaveBeenNthCalledWith(1, tree)
    expect(cb).toHaveBeenNthCalledWith(2, tree.children[0])
    expect(cb).toHaveBeenNthCalledWith(3, tree.children[1])
  })

  it('depth traversal mapping tree data', () => {
    const tree = {
      id: 1,
      label: 'hello',
      children: [
        {
          id: 2,
          label: 'hello2'
        },
        {
          id: 3,
          label: 'hello3'
        }
      ]
    }
    const treeTools = new TreeTools(tree, 'children')
    const cb = jest.fn((node) => ({ key: node.id, text: node.label }))
    const result = treeTools.depthMap(cb, 'children')

    expect(cb).toBeCalledTimes(3)
    expect(Object.keys(result)).toEqual(['key', 'text', 'children'])
    expect(Object.keys(result.children[0])).toEqual(['key', 'text', 'children'])
    expect(Object.keys(result.children[1])).toEqual(['key', 'text', 'children'])
  })
})
