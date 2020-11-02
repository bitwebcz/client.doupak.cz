<template>
  <h1>Home Page</h1>

  <storeExamples />
  <routerExamples />
  <apolloExamples />
  <compositionExamples />
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
