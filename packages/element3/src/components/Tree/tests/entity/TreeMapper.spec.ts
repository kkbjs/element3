import { TreeMapper } from '../../src/entity/TreeMapper'
import { TreeNode } from './../../src/entity/TreeNode'

describe('TreeMapper.ts', () => {
  it('mapper a tree', () => {
    const rawNode = {
      text: 'Node1',
      childs: [
        {
          text: 'Node11',
          childs: [
            {
              text: 'Node111',
              childs: []
            }
          ]
        }
      ]
    }

    const mapper = new TreeMapper(rawNode, {
      label: 'text',
      children: 'childs'
    })

    const rawNodeProxy = mapper.rawNodeProxy
    const treeNodeProxy = mapper.treeNodeProxy

    expect(rawNodeProxy.text).toEqual(treeNodeProxy.label)
    expect(rawNodeProxy.childs[0].text).toEqual(treeNodeProxy.children[0].label)
    expect(rawNodeProxy.childs[0].childs[0].text).toEqual(
      treeNodeProxy.children[0].children[0].label
    )
  })

  it('properties of the response tree rawNode to treeNode', () => {
    const rawNode = {
      text: 'Node1',
      childs: [
        {
          text: 'Node11',
          childs: [
            {
              text: 'Node111',
              childs: []
            }
          ]
        }
      ]
    }

    const mapper = new TreeMapper(rawNode, {
      label: 'text',
      children: 'childs'
    })

    const rawNodeProxy = mapper.rawNodeProxy
    const treeNodeProxy = mapper.treeNodeProxy

    rawNodeProxy.text = 'HELLO'
    rawNodeProxy.childs[0].text = 'HELLO2'
    rawNodeProxy.childs[0].childs = [{ text: 'Hello12' } as any]

    expect(rawNodeProxy.text).toEqual(treeNodeProxy.label)
    expect(rawNodeProxy.childs[0].text).toEqual(treeNodeProxy.children[0].label)
    expect(rawNodeProxy.childs[0].childs[0].text).toEqual(
      treeNodeProxy.children[0].children[0].label
    )
  })

  it('properties of the response tree treeNode to rawNode', () => {
    const rawNode = {
      text: 'Node1',
      childs: [
        {
          text: 'Node11',
          childs: [
            {
              text: 'Node111',
              childs: []
            }
          ]
        }
      ]
    }

    const mapper = new TreeMapper(rawNode, {
      label: 'text',
      children: 'childs'
    })

    const rawNodeProxy = mapper.rawNodeProxy
    const treeNodeProxy = mapper.treeNodeProxy

    treeNodeProxy.label = 'HELLO'
    treeNodeProxy.children[0].label = 'HELLO2'
    treeNodeProxy.children[0].children = [new TreeNode(0, 'Test')]

    expect(rawNodeProxy.text).toEqual(treeNodeProxy.label)
    expect(rawNodeProxy.childs[0].text).toEqual(treeNodeProxy.children[0].label)
    expect(rawNodeProxy.childs[0].childs[0].text).toEqual(
      treeNodeProxy.children[0].children[0].label
    )
  })

  it('child nodes of the response tree rawNode to treeNode', () => {
    const rawNode = {
      text: 'Node1',
      childs: [
        {
          text: 'Node11',
          childs: [
            {
              text: 'Node111',
              childs: []
            }
          ]
        }
      ]
    }

    const mapper = new TreeMapper(rawNode, {
      label: 'text',
      children: 'childs'
    })

    const rawNodeProxy = mapper.rawNodeProxy
    const treeNodeProxy = mapper.treeNodeProxy

    rawNodeProxy.childs[0] = {
      text: 'Test',
      childs: [{ text: 'Test1', childs: [] }]
    }

    expect(treeNodeProxy.children[0].label).toEqual(rawNodeProxy.childs[0].text)
    expect(treeNodeProxy.children[0].children[0].label).toEqual(
      rawNodeProxy.childs[0].childs[0].text
    )

    rawNodeProxy.childs[0].childs.push({
      text: 'Test2',
      childs: []
    })
    expect(treeNodeProxy.children[0].children).toHaveLength(2)
    expect(treeNodeProxy.children[0].children[1].label).toEqual('Test2')

    rawNodeProxy.childs[0].childs.splice(0, 1, { text: 'test1', childs: [] })
    expect(treeNodeProxy.children[0].children).toHaveLength(2)

    rawNodeProxy.childs[0].childs.pop()
    expect(treeNodeProxy.children[0].children).toHaveLength(1)
  })

  it('child nodes of the response tree treeNode to rawNode', () => {
    const rawNode = {
      text: 'Node1',
      childs: [
        {
          text: 'Node11',
          childs: [
            {
              text: 'Node111',
              childs: []
            }
          ]
        }
      ]
    }

    const mapper = new TreeMapper(rawNode, {
      label: 'text',
      children: 'childs'
    })

    const rawNodeProxy = mapper.rawNodeProxy
    const treeNodeProxy = mapper.treeNodeProxy

    treeNodeProxy.children[0] = new TreeNode(88, 'Test', [
      new TreeNode(99, 'Test1')
    ])

    expect(treeNodeProxy.children[0].label).toEqual(rawNodeProxy.childs[0].text)
    expect(treeNodeProxy.children[0].children[0].label).toEqual(
      rawNodeProxy.childs[0].childs[0].text
    )

    treeNodeProxy.children[0].children.push(new TreeNode(66, 'Test2'))
    expect(treeNodeProxy.children[0].children).toHaveLength(2)
    expect(treeNodeProxy.children[0].children[1].label).toEqual('Test2')

    treeNodeProxy.children[0].children.splice(0, 1, new TreeNode(33, 'test9'))
    expect(treeNodeProxy.children[0].children).toHaveLength(2)

    treeNodeProxy.children[0].children.pop()
    expect(treeNodeProxy.children[0].children).toHaveLength(1)
  })

  it('Test whether the parent value of the child node is the current node when overwriting children', () => {
    const rawNode = {
      text: 'Node1',
      childs: []
    }

    const mapper = new TreeMapper(rawNode, {
      label: 'text',
      children: 'childs'
    })

    const rawNodeProxy = mapper.rawNodeProxy
    const treeNodeProxy = mapper.treeNodeProxy
    rawNodeProxy.childs = [
      {
        text: 'test'
      }
    ]
    expect(treeNodeProxy.children[0].parent).toEqual(treeNodeProxy)
  })

  it('move a node', () => {
    const rawNode = {
      id: 1,
      text: 'Node1',
      childs: [
        {
          id: 2,
          text: 'Node11',
          childs: [
            {
              id: 3,
              text: 'Node111',
              childs: []
            }
          ]
        }
      ]
    }

    const mapper = new TreeMapper(rawNode, {
      id: 'id',
      label: 'text',
      children: 'childs'
    })

    const rawNodeProxy = mapper.rawNodeProxy
    const treeNodeProxy = mapper.treeNodeProxy

    const node3 = treeNodeProxy.findOne(3)

    node3.move(treeNodeProxy, 'inner')
    expect(treeNodeProxy.children[1]).toBe(node3)
    expect(rawNodeProxy.childs[1].id).toBe(node3.id)

    node3.move(treeNodeProxy.findOne(2), 'prev')
    expect(treeNodeProxy.children[0]).toBe(node3)
    expect(rawNodeProxy.childs[0].id).toBe(node3.id)

    node3.move(treeNodeProxy.findOne(2), 'inner')
    expect(treeNodeProxy.children[0].children[0]).toBe(node3)
    expect(rawNodeProxy.childs[0].childs[0].id).toBe(node3.id)
  })
})
