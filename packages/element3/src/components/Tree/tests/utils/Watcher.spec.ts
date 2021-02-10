import { Watcher } from '../../src/utils/Watcher'

describe('Watcher.ts', () => {
  it('watch a tree property value listen `set/obj/put`', () => {
    const tree = {
      key: 1,
      text: 'hello',
      childs: [
        {
          key: 2,
          text: 'hello2'
        },
        {
          key: 3,
          text: 'hello3'
        }
      ]
    }

    const watcher = new Watcher(tree)
    const _tree = watcher.proxy

    const cb = jest.fn()
    watcher.bindHandler('set/obj/put', cb)

    _tree.text = 'Test'
    _tree.childs[0].text = 'Test'

    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenNthCalledWith(1, {
      target: tree,
      key: 'text',
      value: 'Test',
      currentNode: tree
    })
    expect(cb).toHaveBeenNthCalledWith(2, {
      target: tree.childs[0],
      key: 'text',
      value: 'Test',
      currentNode: tree.childs[0]
    })
  })

  it('watch a tree property value listen `set/obj/add`', () => {
    type Tree = { key: number; text: string; childs?: Tree[]; new?: string }
    const tree: Tree = {
      key: 1,
      text: 'hello',
      childs: [
        {
          key: 2,
          text: 'hello2'
        },
        {
          key: 3,
          text: 'hello3'
        }
      ]
    }

    const watcher = new Watcher(tree)
    const _tree = watcher.proxy

    const cb = jest.fn()
    watcher.bindHandler('set/obj/add', cb)

    _tree.new = 'Test'

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenNthCalledWith(1, {
      target: tree,
      key: 'new',
      value: 'Test',
      currentNode: tree
    })
  })

  it('watch a tree property value listen `set/obj/del`', () => {
    type Tree = { key: number; text: string; childs?: Tree[]; new?: string }
    const tree: Tree = {
      key: 1,
      text: 'hello',
      childs: [
        {
          key: 2,
          text: 'hello2'
        },
        {
          key: 3,
          text: 'hello3'
        }
      ]
    }

    const watcher = new Watcher(tree)
    const _tree = watcher.proxy

    const cb = jest.fn()
    watcher.bindHandler('set/obj/del', cb)

    delete _tree.text

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenNthCalledWith(1, {
      target: tree,
      key: 'text',
      value: null,
      currentNode: tree
    })
  })

  it('watch a tree property value listen `get/obj`', () => {
    type Tree = { key: number; text: string; childs?: Tree[]; new?: string }
    const tree: Tree = {
      key: 1,
      text: 'hello',
      childs: [
        {
          key: 2,
          text: 'hello2'
        },
        {
          key: 3,
          text: 'hello3'
        }
      ]
    }

    const watcher = new Watcher(tree)
    const _tree = watcher.proxy

    const cb = jest.fn()
    watcher.bindHandler('get/obj', cb)

    _tree.text

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenNthCalledWith(1, {
      target: tree,
      key: 'text',
      value: null,
      currentNode: tree
    })
  })

  it('watch a tree child listen `get/arr`', () => {
    type Tree = { key: number; text: string; childs?: Tree[]; new?: string }
    const tree: Tree = {
      key: 1,
      text: 'hello',
      childs: [
        {
          key: 2,
          text: 'hello2'
        },
        {
          key: 3,
          text: 'hello3'
        }
      ]
    }

    const watcher = new Watcher(tree)
    const _tree = watcher.proxy

    const cb = jest.fn()
    watcher.bindHandler('get/arr', cb)

    _tree.childs[0]

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenNthCalledWith(1, {
      target: tree.childs,
      key: '0',
      value: null,
      currentNode: tree
    })
  })

  it('watch a tree child listen `set/arr/put`', () => {
    type Tree = { key: number; text: string; childs?: Tree[]; new?: string }
    const tree: Tree = {
      key: 1,
      text: 'hello',
      childs: [
        {
          key: 2,
          text: 'hello2'
        },
        {
          key: 3,
          text: 'hello3'
        }
      ]
    }

    const watcher = new Watcher(tree)
    const _tree = watcher.proxy

    const cb = jest.fn()
    watcher.bindHandler('set/arr/put', cb)

    _tree.childs[0] = {
      key: 999,
      text: 'test'
    }

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenNthCalledWith(1, {
      target: tree.childs,
      key: '0',
      value: {
        key: 999,
        text: 'test'
      },
      currentNode: tree
    })
  })

  it('watch a tree child listen `set/arr/add`', () => {
    type Tree = { key: number; text: string; childs?: Tree[]; new?: string }
    const tree: Tree = {
      key: 1,
      text: 'hello',
      childs: [
        {
          key: 2,
          text: 'hello2'
        },
        {
          key: 3,
          text: 'hello3'
        }
      ]
    }

    const watcher = new Watcher(tree)
    const _tree = watcher.proxy

    const cb = jest.fn()
    watcher.bindHandler('set/arr/add', cb)

    _tree.childs.push({
      key: 999,
      text: 'test'
    })

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenNthCalledWith(1, {
      target: tree.childs,
      key: '2',
      value: {
        key: 999,
        text: 'test'
      },
      currentNode: tree
    })
  })

  it('watch a tree child listen `set/arr/del`', () => {
    type Tree = { key: number; text: string; childs?: Tree[]; new?: string }
    const tree: Tree = {
      key: 1,
      text: 'hello',
      childs: [
        {
          key: 2,
          text: 'hello2'
        },
        {
          key: 3,
          text: 'hello3'
        }
      ]
    }

    const watcher = new Watcher(tree)
    const _tree = watcher.proxy

    const cb = jest.fn()
    watcher.bindHandler('set/arr/del', cb)

    delete _tree.childs[0]

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenNthCalledWith(1, {
      target: tree.childs,
      key: '0',
      value: null,
      currentNode: tree
    })
  })

  it('about obj1->arr->arr->obj2->arr currentNode expect obj1 next obj2', () => {
    const obj = {
      id: 1,
      arr: [
        [
          {
            id: 2,
            arr: [
              [
                {
                  id: 3
                }
              ]
            ]
          }
        ]
      ]
    }

    const watcher = new Watcher(obj)

    const fn1 = jest.fn()
    watcher.bindHandler('get/obj', fn1)

    const fn2 = jest.fn()
    watcher.bindHandler('get/arr', fn2)

    watcher.proxy.arr[0][0].arr[0][0].id

    expect(fn1).toBeCalledTimes(3)
    expect(fn1).toHaveBeenNthCalledWith(1, {
      target: obj,
      key: 'arr',
      value: null,
      currentNode: obj
    })
    expect(fn1).toHaveBeenNthCalledWith(2, {
      target: obj.arr[0][0],
      key: 'arr',
      value: null,
      currentNode: obj.arr[0][0]
    })
    expect(fn1).toHaveBeenNthCalledWith(3, {
      target: obj.arr[0][0].arr[0][0],
      key: 'id',
      value: null,
      currentNode: obj.arr[0][0].arr[0][0]
    })
    expect(fn2).toBeCalledTimes(4)
    expect(fn2).toHaveBeenNthCalledWith(1, {
      target: obj.arr,
      key: '0',
      value: null,
      currentNode: obj
    })
    expect(fn2).toHaveBeenNthCalledWith(2, {
      target: obj.arr[0],
      key: '0',
      value: null,
      currentNode: obj
    })
    expect(fn2).toHaveBeenNthCalledWith(3, {
      target: obj.arr[0][0].arr,
      key: '0',
      value: null,
      currentNode: obj.arr[0][0]
    })
    expect(fn2).toHaveBeenNthCalledWith(4, {
      target: obj.arr[0][0].arr[0],
      key: '0',
      value: null,
      currentNode: obj.arr[0][0]
    })
  })
})
