<template>
  <h1>Teal Dice Page</h1>

  <three-dice />
</template>


<script>
import ThreeDice from "@/components/threeDice/ThreeDice"

export default {
  name: 'Dice',
  components: {
      ThreeDice
  }
}
</script>
