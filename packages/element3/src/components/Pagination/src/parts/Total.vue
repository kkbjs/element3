<template>
  <span
    class="el-pagination__total"
    :class="{
      disabled: pager.style.disabled
    }"
    v-text="`共 ${pager.total} 条`"
  ></span>
</template>

<script lang="ts">
import { Pager } from '../entity/Pager'
export default {
  props: {
    pager: Pager
  }
}
</script>
