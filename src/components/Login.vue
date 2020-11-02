<template>
  <v-main :loading="loading">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card :loading="loading" :disabled="loading" class="elevation-12">
            <slot name="content" />
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "LayoutsAuth",
  metaInfo: {
    titleTemplate: "ISPIK %s"
  },
  computed: mapState({
    loading: state => state.core.auth.loading
  })
};
</script>
