<template>
  <span class="el-pagination__jump">
    {{ t('el.pagination.goto') }}
    <el-input
      :modelValue="pager.current"
      class="el-pagination__editor is-in-pagination"
      :min="1"
      :max="pager.count"
      type="number"
      :disbaled="pager.style.disabled"
      @update:modelValue="pager.jump(Number($event))"
    />
    {{ t('el.pagination.pageClassifier') }}
  </span>
</template>
<script lang="ts">
import { ElInput } from '../../../../components/Input'
import { useLocale } from '../../../../composables/locale'
import { Pager } from '../entity/Pager'

export default {
  props: {
    pager: Pager
  },
  components: { ElInput },
  setup() {
    const t = useLocale()
    return {
      t
    }
  }
}
</script>
