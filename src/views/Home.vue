<template>
  <h1>Home Page</h1>

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
import StoreExamples from "@/components/StoreExamples";
import RouterExamples from "@/components/RouterExamples";
import ApolloExamples from "@/components/ApolloExamples";
import CompositionExamples from "@/components/CompositionExamples";

export default {
  name: 'Home',
  components: {
      StoreExamples,
      RouterExamples,
      ApolloExamples,
      CompositionExamples
  }
}
</script>
