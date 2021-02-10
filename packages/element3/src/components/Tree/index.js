import _ElTree from './src/Tree.vue'

export const ElTree = Object.assign({}, _ElTree, {
  install: function (app) {
    app.component(_ElTree.name, _ElTree)
  }
})
