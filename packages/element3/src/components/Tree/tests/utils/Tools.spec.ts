import { Tools } from '../../src/utils/Tools'

describe('Tools.ts', () => {
  it('createMap', () => {
    const nodeMap = {
      id: 'key',
      label: 'text'
    }
    const map = Tools.createMap(nodeMap)
    expect(map.get('id')).toEqual('key')
    expect(map.get('label')).toEqual('text')
  })

  it('reversalNodeKeyMap', () => {
    const nodeMap = {
      id: 'key',
      label: 'text'
    }

    const reNodeMap = Tools.reversalNodeKeyMap(Tools.createMap(nodeMap))
    expect(reNodeMap.get('key')).toEqual('id')
    expect(reNodeMap.get('text')).toEqual('label')
  })
})
