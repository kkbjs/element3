export interface ElPaginationProps {
  layout?: string
  pagerCount?: number
  currentPage?: number
  pageCount?: number
  total?: number
  pageSize?: number
  hideOnSinglePage?: boolean
  pageSizes?: number[]
  popperClass?: string
  nextText?: string
  prevText?: string
  disabled?: boolean
  small?: boolean
  background?: boolean
}

declare class ElPagination {
  $props: ElPaginationProps
}

export type Keep<S> = {
  [key in keyof ElPaginationProps & S]?: ElPaginationProps[key]
}

export default ElPagination
