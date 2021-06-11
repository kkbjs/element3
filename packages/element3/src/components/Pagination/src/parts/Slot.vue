<script lang="ts">
import { inject } from 'vue'
import { Pager } from '../entity/Pager'
export default {
  props: {
    pager: Pager
  },
  setup(props) {
    const defaultSlotloader = inject<any>('pagination/slot/default')
    return () => {
      return defaultSlotloader && defaultSlotloader(props.pager)
    }
  }
}
</script>
