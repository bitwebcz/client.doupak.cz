<template>
  <h1>Home Page</h1>

  <d10 />

  <d20 />

  <d4 />

  <storeExamples />
  <routerExamples />
  <apolloExamples />
  <compositionExamples />

  <br>

  <dialog-window>
      <template #button>Button text</template>
      <template #aside>Dialog windows text</template>
  </dialog-window>
</template>


<script>
import StoreExamples from "@/components/StoreExamples"
import RouterExamples from "@/components/RouterExamples"
import ApolloExamples from "@/components/ApolloExamples"
import CompositionExamples from "@/components/CompositionExamples"
// import D6 from "@/components/dice/D6"
import D20 from "@/components/dice/D20"
import D4 from "@/components/dice/D4"
import D10 from "@/components/dice/D10"

export default {
  name: 'Home',
  components: {
      StoreExamples,
      RouterExamples,
      ApolloExamples,
      CompositionExamples,
      // D6,
      D20,
      D4,
      D10
  }
}
</script>
