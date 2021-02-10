import { Tree } from '../../src/entity/Tree'

describe('Tree.ts', () => {
  it('generate tree by rawNodes', () => {
    type RawNode = { key: number; text: string; childs?: RawNode[] }
    const rawNodes: RawNode[] = [
      {
        key: 1,
        text: 'Node1',
        childs: [
          {
            key: 11,
            text: 'Node011'
          }
        ]
      },
      {
        key: 2,
        text: 'Node2'
      }
    ]

    const tree = new Tree(rawNodes, {
      id: 'key',
      label: 'text',
      children: 'childs'
    })

    expect(tree.root.children).toHaveLength(2)
    expect(tree.root.children[0].id).toEqual(rawNodes[0].key)
    expect(tree.root.children[1].id).toEqual(rawNodes[1].key)
    expect(tree.root.children[0].children[0].id).toEqual(
      rawNodes[0].childs[0].key
    )
  })

  it('expand all node', () => {
    type RawNode = { key: number; text: string; childs?: RawNode[] }
    const rawNodes: RawNode[] = [
      {
        key: 1,
        text: 'Node1',
        childs: [
          {
            key: 11,
            text: 'Node011'
          }
        ]
      },
      {
        key: 2,
        text: 'Node2',
        childs: [
          {
            key: 21,
            text: 'Node021'
          }
        ]
      }
    ]

    const tree = new Tree(rawNodes, {
      id: 'key',
      label: 'text',
      children: 'childs'
    })

    tree.expandAll(true)

    expect(tree.root.isExpanded).toBeTruthy()
    expect(tree.root.findOne(1).isExpanded).toBeTruthy()
    expect(tree.root.findOne(2).isExpanded).toBeTruthy()
  })

  it('filter show node', () => {
    type RawNode = { key: number; text: string; childs?: RawNode[] }
    const rawNodes: RawNode[] = [
      {
        key: 1,
        text: 'Node1',
        childs: [
          {
            key: 11,
            text: 'Node011'
          }
        ]
      },
      {
        key: 2,
        text: 'Node2',
        childs: [
          {
            key: 21,
            text: 'Node021'
          }
        ]
      }
    ]

    const tree = new Tree(rawNodes, {
      id: 'key',
      label: 'text',
      children: 'childs'
    })

    const search = '11'

    tree.filter((node) => {
      return node.label.includes(search)
    })

    expect(tree.root.findOne(1).isVisible).toBeTruthy()
    expect(tree.root.findOne(11).isVisible).toBeTruthy()
    expect(tree.root.findOne(2).isVisible).toBeFalsy()
    expect(tree.root.findOne(21).isVisible).toBeFalsy()
  })
})
