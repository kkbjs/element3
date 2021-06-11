<template>
  <span class="el-pagination__sizes">
    <el-select
      :modelValue="pager.size"
      :popperClass="pager.style.popperClass"
      :size="'mini'"
      :disabled="pager.style.disabled"
      @update:modelValue="pager.changeSize($event)"
    >
      <el-option
        v-for="item in pager.sizes"
        :value="item"
        :label="item + t('el.pagination.pagesize')"
        :key="item"
      >
      </el-option>
    </el-select>
  </span>
</template>

<script lang="ts">
import ElSelect from '../../../../../packages/select'
import ElOption from '../../../../../packages/option'
import { useLocale } from '../../../../composables/locale'
import { Pager } from '../entity/Pager'

export default {
  components: {
    ElSelect,
    ElOption
  },

  props: {
    pager: Pager
  },

  setup() {
    const t = useLocale()

    return {
      t
    }
  }
}
</script>

<style scoped></style>
