import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter } from "vue-router"
import { DefaultApolloClient } from '@vue/apollo-composable'

import App from './App.vue'
import Store from './store'
import Router from './router'
import apolloClient from './plugins/apollo'

const store = createStore(Store)
const router = createRouter(Router);
const app = createApp(App)

app.provide(DefaultApolloClient, apolloClient)
app.use(store)
app.use(router)
app.mount('#app')
