<template>
  <button
    type="button"
    class="btn-next"
    @click="pager.next()"
    :disabled="!pager.rightCount || pager.style.disabled"
  >
    <i class="el-icon el-icon-arrow-right"></i>
    <span v-if="pager.style.nextText" v-text="pager.style.nextText"></span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Pager } from '../entity/Pager'

export default defineComponent({
  props: {
    pager: Pager
  }
})
</script>
