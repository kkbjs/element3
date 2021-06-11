export const props = {
  message: {
    type: [String, Object]
  },
  visiable: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    defalut: 'info',
    validator(val) {
      return ['success', 'warning', 'info', 'error'].includes(val)
    }
  },
  iconClass: String,
  showClose: Boolean,
  duration: Number,
  center: Boolean,
  customClass: String,
  dangerouslyUseHTMLString: Boolean,
  offset: Number
}
