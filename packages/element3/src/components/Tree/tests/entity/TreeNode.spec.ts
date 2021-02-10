import { TreeNode } from '../../src/entity/TreeNode'

describe('TreeNode.ts', () => {
  it('init a tree', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node2'),
      new TreeNode(3, 'Node3')
    ])

    expect(treeNode.id).toEqual(1)
    expect(treeNode.label).toEqual('Node1')

    expect(treeNode.children[0].id).toEqual(2)
    expect(treeNode.children[0].label).toEqual('Node2')

    expect(treeNode.children[1].id).toEqual(3)
    expect(treeNode.children[1].label).toEqual('Node3')
  })

  it('test level depth', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node2'),
      new TreeNode(3, 'Node3')
    ])

    expect(treeNode.level).toEqual(0)
    expect(treeNode.children[0].level).toEqual(1)
    expect(treeNode.children[1].level).toEqual(1)
  })

  it('when node children is null then isLeaf with true', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node2'),
      new TreeNode(3, 'Node3')
    ])

    expect(treeNode.isLeaf).toBeFalsy()
    expect(treeNode.children[0].isLeaf).toBeTruthy()
    expect(treeNode.children[1].isLeaf).toBeTruthy()
  })

  it('test appendChild method', () => {
    const treeNode = new TreeNode(1, 'Node1', [])
    treeNode.appendChild(new TreeNode(2, 'Node2'), new TreeNode(3, 'Node3'))

    expect(treeNode.children).toHaveLength(2)
    expect(treeNode.children[0].id).toEqual(2)
    expect(treeNode.children[1].id).toEqual(3)
  })

  it('test insertChild method', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(11, 'Node2'),
      new TreeNode(12, 'Node2')
    ])
    treeNode.insertChild(1, new TreeNode(2, 'Node2'), new TreeNode(3, 'Node3'))

    expect(treeNode.children).toHaveLength(4)
    expect(treeNode.children[1].id).toEqual(2)
    expect(treeNode.children[2].id).toEqual(3)
  })

  it('test removeChild method', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(11, 'Node2'),
      new TreeNode(12, 'Node2')
    ])

    treeNode.removeChild(1)

    expect(treeNode.children).toHaveLength(1)
    expect(treeNode.children[0].id).toEqual(11)
  })

  it('test isChecked and isIndeterminate state', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1'),
      new TreeNode(3, 'Node1-2', [
        new TreeNode(4, 'Node1-2-1'),
        new TreeNode(5, 'Node1-2-2')
      ])
    ])

    root.setChecked(true)
    expect(root.isChecked).toBeTruthy()
    expect(root.isIndeterminate).toBeFalsy()
    expect(root.findOne(2).isChecked).toBeTruthy()
    expect(root.findOne(3).isChecked).toBeTruthy()
    expect(root.findOne(4).isChecked).toBeTruthy()
    expect(root.findOne(5).isChecked).toBeTruthy()

    const node3 = root.findOne(3)
    node3.setChecked(false)
    expect(root.isChecked).toBeFalsy()
    expect(node3.isChecked).toBeFalsy()
    expect(node3.findOne(3).isChecked).toBeFalsy()
    expect(node3.findOne(4).isChecked).toBeFalsy()
    expect(node3.findOne(5).isChecked).toBeFalsy()
    expect(root.isIndeterminate).toBeTruthy()

    const node2 = root.findOne(2)
    expect(node2.isChecked).toBeTruthy()
    node2.setChecked(false)
    expect(root.isChecked).toBeFalsy()
    expect(root.isIndeterminate).toBeFalsy()
  })

  it('find one node', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1'),
      new TreeNode(3, 'Node1-2', [new TreeNode(4, 'Node1-2-1')])
    ])

    expect(root.findOne(1)).toBe(root)
    expect(root.findOne(2)).toBe(root.children[0])
    expect(root.findOne(3)).toBe(root.children[1])
    expect(root.findOne(4)).toBe(root.children[1].children[0])
    expect(root.findOne(5)).toBeUndefined()
  })

  it('test method getCheckedNodes', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1', [], {
        isChecked: true
      }),
      new TreeNode(3, 'Node1-2', [], {
        isChecked: true
      })
    ])

    expect(root.getCheckedNodes()).toHaveLength(2)
  })

  it('test isStrictly', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(
        2,
        'Node1-1',
        [new TreeNode(3, 'Node1-1-1', [new TreeNode(4, 'Node1-1-1-1')])],
        {
          isStrictly: true
        }
      )
    ])

    expect(root.findOne(4).isStrictly).toBeTruthy()
    expect(root.findOne(2).isStrictly).toBeTruthy()
    expect(root.isStrictly).toBeFalsy()
  })

  it('test strictly and setChecked', () => {
    const root = new TreeNode(
      1,
      'Node1',
      [new TreeNode(2, 'Node1-1', [new TreeNode(4, 'Node1-1-1')])],
      {
        isStrictly: true
      }
    )

    root.findOne(2).setChecked(true)
    expect(root.findOne(2).isChecked).toBeTruthy()
    expect(root.isChecked).toBeFalsy()
    expect(root.isIndeterminate).toBeFalsy()
    expect(root.findOne(4).isChecked).toBeFalsy()

    root.setChecked(true)
    expect(root.isChecked).toBeTruthy()
    expect(root.findOne(2).isChecked).toBeTruthy()
    expect(root.findOne(4).isChecked).toBeFalsy()
  })

  it('test isDisabled is true setChecked method', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1', [new TreeNode(4, 'Node1-1-1')], {
        isDisabled: true
      })
    ])

    root.findOne(2).setChecked(true)
    expect(root.findOne(2).isChecked).toBeFalsy()
  })

  it('test expand method', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1', [new TreeNode(4, 'Node1-1-1')])
    ])

    root.expand(true)
    expect(root.isExpanded).toBeTruthy()
  })

  it('test isRendered', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1', [new TreeNode(4, 'Node1-1-1')])
    ])

    expect(root.isRendered).toBeFalsy()
    root.expand(true)
    expect(root.isRendered).toBeTruthy()
  })

  it('test collapse', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1', [new TreeNode(4, 'Node1-1-1')]),
      new TreeNode(3, 'Node1-2', [new TreeNode(5, 'Node1-2-1')])
    ])

    root.findOne(2).collapse(true)
    expect(root.findOne(2).isExpanded).toBeTruthy()
    expect(root.findOne(3).isExpanded).toBeFalsy()

    root.findOne(3).collapse(true)
    expect(root.findOne(3).isExpanded).toBeTruthy()
    expect(root.findOne(2).isExpanded).toBeFalsy()
  })

  it('test expand auto expand parent', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1', [new TreeNode(4, 'Node1-1-1')])
    ])

    root.findOne(4).expand(true, true)
    expect(root.isExpanded).toBeTruthy()
    expect(root.findOne(2).isExpanded).toBeTruthy()
  })

  it('set node isVisible', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1', [new TreeNode(4, 'Node1-1-1')])
    ])
    root.hide()
    expect(root.isVisible).toBeFalsy()
    root.show()
    expect(root.isVisible).toBeTruthy()
  })

  it('findOne Introduced to the callback ', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1', [new TreeNode(4, 'Node1-1-1')])
    ])
    const cb = jest.fn((node) => node.id === 2)
    const result = root.findOne(cb)
    expect(cb).toBeCalledTimes(2)
    expect(result.id).toBe(2)
  })

  it('findMary Introduced to the callback ', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(
        2,
        'Node1-1',
        [
          new TreeNode(4, 'Node1-1-1', [], {
            isExpanded: true
          })
        ],
        {
          isExpanded: true
        }
      )
    ])
    const cb = jest.fn((node) => node.isExpanded)
    const result = root.findMany(cb)
    expect(cb).toBeCalledTimes(3)
    expect(result.map((node) => node.id)).toEqual([2, 4])
  })

  it('async load node', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1', [
        new TreeNode(4, 'Node1-1-1', [], {
          isAsync: true,
          asyncLoader(node, resolve) {
            expect(root.findOne(4).asyncState).toEqual('loading')
            resolve([new TreeNode(5, 'AsyncNode')])
          }
        })
      ])
    ])
    expect(root.findOne(4).asyncState).toEqual('notLoaded')
    expect(root.findOne(4).isAsync).toBeTruthy()
    root.findOne(4).expand(true)
    expect(root.findOne(4).children).toHaveLength(1)
    expect(root.findOne(4).asyncState).toEqual('loaded')
  })

  it('move a node', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node2'),
      new TreeNode(3, 'Node3')
    ])

    root.findOne(3).move(root.findOne(2), 'inner')
    expect(root.findOne(2).children[0]).toBe(root.findOne(3))
    expect(root.children).toHaveLength(1)
  })
})
