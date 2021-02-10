<template>
  <el-tree :data="data" show-checkbox ref="tree"> </el-tree>
  <el-button @click="onClick">点击获取ID=3的节点</el-button>
</template>
<script>
import { useTree } from 'element3'
export default {
  setup() {
    const { findOne } = useTree('tree')
    const data = [
      {
        id: 1,
        label: '一级 1',
        children: [
          {
            id: 4,
            label: '二级 1-1',
            children: [
              {
                id: 9,
                label: '三级 1-1-1'
              },
              {
                id: 10,
                label: '三级 1-1-2'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: '一级 2',
        children: [
          {
            id: 5,
            label: '二级 2-1'
          },
          {
            id: 6,
            label: '二级 2-2'
          }
        ]
      },
      {
        id: 3,
        label: '一级 3',
        children: [
          {
            id: 7,
            label: '二级 3-1'
          },
          {
            id: 8,
            label: '二级 3-2'
          }
        ]
      }
    ]
    const onClick = () => {
      console.log(findOne(3).appendChild({ id: 100, label: 'test' }))
    }
    return {
      data,
      onClick
    }
  }
}
</script>
