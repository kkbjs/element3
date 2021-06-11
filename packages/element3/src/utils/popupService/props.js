export const props = {
  lockScroll: {
    type: Boolean,
    default: false
  },
  visiable: {
    type: Boolean
  },
  closeOnClickModal: {
    type: Boolean,
    default: false
  },
  target: {
    type: String,
    default: 'body'
  },
  transitionClass: {
    type: String
  },
  afterLeaveHandler: {
    type: Function
  },
  onClose: Function
}
