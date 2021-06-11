import ElPagination from './src/Pagination.vue'

ElPagination.install = function (app) {
  app.component(ElPagination.name, ElPagination)
}

export { ElPagination }
