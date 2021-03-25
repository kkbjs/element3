import { App } from 'vue'
import {
  ElementUIComponent,
  ElementUIComponentSize,
  ElementUIHorizontalAlignment
} from './component'

export { ElAlert } from './alert'
export { ElAside } from './aside'
export { ElAutocomplete } from './autocomplete'
export { ElBadge } from './badge'
export { ElBreadcrumb } from './breadcrumb'
export { ElBreadcrumbItem } from './breadcrumb-item'
export { ElButton } from './button'
export { ElButtonGroup } from './button-group'
export { ElCard } from './card'
export { ElCarousel } from './carousel'
export { ElCarouselItem } from './carousel-item'
export { ElCascader } from './cascader'
export { ElCheckbox } from './checkbox'
export { ElCheckboxButton } from './checkbox-button'
export { ElCheckboxGroup } from './checkbox-group'
export { ElRow } from './row'
export { ElCol } from './col'
export { ElMain } from './main'
export { ElContainer } from './container'
export { ElHeader } from './header'
export { ElFooter } from './footer'
export { ElProgress } from './progress'
export { ElPagination } from './pagination'
export { ElSelect } from './select'
export { ElRadioButton } from './radio-button'
export { ElInput } from './input'
export { ElInputNumber } from './input-number'
export { ElRadio } from './radio'
export { ElRadioGroup } from './radio-group'
export { ElSlider } from './slider'
export { ElSwitch } from './switch'
export { ElLink } from './link'
export { ElAvatar } from './avatar'
export { ElTag } from './tag'
export { ElRate } from './rate'
export { Message } from './message'
export { useNotify } from './notification'
export { ElLoading } from './loading'
export { Msgbox } from './message-box'
export { ElSteps } from './steps'
export { ElUpload } from './upload'
export { ElTabs } from './tabs'
export { ElPageHeader } from './page-header'
export { ElDropdown } from './dropdown'
export { ElCollapse } from './collapse'
export { ElCollapseItem } from './collapse-item'
export { ElColorPicker } from './color-picker'
export { ElDatePicker } from './date-picker'
export { ElDialog } from './dialog'
export { ElDropdownItem } from './dropdown-item'
export { ElDropdownMenu } from './dropdown-menu'
export { ElForm } from './form'
export { ElFormItem } from './form-item'
export { ElMenu } from './menu'
export { ElMenuItem } from './menu-item'
export { ElMenuItemGroup } from './menu-item-group'
export { ElOption } from './option'
export { ElOptionGroup } from './option-group'
export { ElPopover } from './popover'
export { ElStep } from './step'
export { ElSubmenu } from './submenu'
export { ElTable } from './table'
export { ElTableColumn } from './table-column'
export { ElTabPane } from './tab-pane'
export { ElTimeline } from './timeline'
export { ElTimelineItem } from './timeline-item'
export { ElTimePicker } from './time-picker'
export { ElTimeSelect } from './time-select'
export { ElTooltip } from './tooltip'
export { ElTransfer } from './transfer'
export { ElDivider } from './divider'
export { ElIcon } from './icon'
export { ElCalendar } from './calendar'
export { ElImage } from './image'
export { ElBacktop } from './backtop'
export { ElInfiniteScroll } from './infinite-scroll'
export { ElDrawer } from './drawer'
export { ElTree } from './tree'
export { ElPopconfirm } from './popconfirm'
export { ElCascaderPanel } from './cascader-panel'
export { ElScrollbar } from './scrollbar'

export interface InstallationOptions {
  locale: any
  i18n: any
  size: string
}

/** The version of element3 */
export const version: string

/**
 * Install all element3 components into Vue.
 * Please do not invoke this method directly.
 * Call `app.use(ElementUI)` to install.
 */
export function install(app: App, ...options: any[]): any

/** Element3 component common definition */
export type Component = ElementUIComponent

/** Component size definition for button, input, etc */
export type ComponentSize = ElementUIComponentSize

/** Horizontal alignment */
export type HorizontalAlignment = ElementUIHorizontalAlignment

/** set GlobalOptions */
export type GlobalOptions = {
  size?: number | string
  zIndex?: number
}
export function setupGlobalOptions(opts: GlobalOptions): void
