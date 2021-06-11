<template>
  <template v-for="(part, index) in layoutParts">
    <template v-if="typeof part === 'string'">
      <component :key="index" :is="part" :pager="pager"></component>
    </template>
    <template v-else>
      <div class="el-pagination__rightwrapper" :key="index">
        <layout :layout-parts="part"></layout>
      </div>
    </template>
  </template>
</template>

<script lang="ts">
import { inject } from 'vue'

import Pager from './parts/Pager.vue'
import Prev from './parts/Prev.vue'
import Next from './parts/Next.vue'
import Total from './parts/Total.vue'
import Sizes from './parts/Sizes.vue'
import Slot from './parts/Slot.vue'
import Jumper from './parts/Jumper.vue'

import { Pager as PagerCore } from './entity/Pager'

export default {
  name: 'Layout',
  props: {
    layoutParts: Array
  },
  components: {
    Pager,
    Total,
    Next,
    Prev,
    Sizes,
    Slot,
    Jumper
  },
  setup() {
    const pager = inject<PagerCore>('pagination/pager')

    return {
      pager
    }
  }
}
</script>
