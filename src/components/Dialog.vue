<template>
  <button @click="open">
    <slot name="button">Dialog button</slot>
  </button>

  <teleport to="aside" v-if="state.opened">
      <div>
        <slot name="aside">Dialog text</slot>
        <button @click="close">Close</button>
      </div>
  </teleport>
</template>

<script>
import { reactive } from "vue"

export default {
    setup() {
      const state = reactive({
        opened: false
      })

      function open() {
        state.opened = true
      }

      function close() {
        state.opened = false
      }

      return {
          state,
          open,
          close
      }
    }
}
</script>
