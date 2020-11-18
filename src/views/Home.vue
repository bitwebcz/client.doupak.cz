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
import D20 from "@/components/cssDice/D20"
import D4 from "@/components/cssDice/D4"
import D10 from "@/components/cssDice/D10"

export default {
  name: 'Home',
  components: {
      StoreExamples,
      RouterExamples,
      ApolloExamples,
      CompositionExamples,
      D20,
      D4,
      D10
  }
}
</script>
