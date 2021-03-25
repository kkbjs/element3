import { t } from '../../../../src/locale'
const props = {
  inputPattern: {
    type: RegExp,
    default: null
  },
  inputValidator: {
    type: [Function],
    default: null
  },
  inputErrorMessage: {
    type: String,
    default: () => t('el.messagebox.error')
  },
  modalFade: {
    type: Boolean,
    default: true
  },
  callback: {
    type: Function,
    default: () => {}
  },
  closeOnHashChange: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  distinguishCancelAndClose: {
    type: Boolean,
    default: false
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  cancelButtonLoading: {
    type: Boolean,
    default: false
  },
  roundButton: {
    type: Boolean,
    default: false
  },
  cancelButtonClass: {
    type: String,
    default: null
  },
  confirmButtonClass: {
    type: String,
    default: null
  },
  showCancelButton: {
    type: Boolean,
    default: false
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  confirmButtonText: {
    type: String,
    default: () => t('el.messagebox.cancel')
  },
  cancelButtonText: {
    type: String,
    default: () => t('el.messagebox.confirm')
  },
  category: {
    type: String,
    default: 'alert',
    validator(val) {
      return ['confirm', 'prompt', 'alert'].includes(val)
    }
  },
  inputValue: {
    type: String,
    default: ''
  },
  inputPlaceholder: {
    type: String,
    default: ''
  },
  inputType: {
    type: String,
    default: 'text'
  },
  showInput: {
    type: Boolean,
    default: false
  },
  dangerouslyUseHTMLString: {
    type: Boolean,
    default: false
  },
  message: {
    type: [Object, String],
    default() {
      return {}
    }
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  modalAppendToBody: {
    type: Boolean,
    default: false
  },
  modal: {
    type: Boolean,
    default: true
  },
  center: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: null
  },
  customClass: {
    type: String,
    default: null
  },
  type: {
    type: [String, null],
    default: null,
    validator(val) {
      return (
        ['success', 'warning', 'info', 'error'].includes(val) || val === null
      )
    }
  },
  iconClass: {
    type: String,
    default: null
  },
  showClose: {
    type: Boolean,
    default: true
  },
  beforeClose: {
    type: Function,
    default: null
  }
}
export default props
