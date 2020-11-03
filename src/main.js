import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter } from "vue-router"
import { DefaultApolloClient } from '@vue/apollo-composable'
import { getToken } from '@/composables/authToken'

import App from './App.vue'
import Store from './store'
import Router from './router'
import DialogWindow from './components/Dialog'

// plugins
import apolloClient from './plugins/apollo'
import "./plugins/vee-validate";

const store = createStore(Store)
const router = createRouter(Router);
const app = createApp(App)

app.component('DialogWindow', DialogWindow) // register global component
app.provide(DefaultApolloClient, apolloClient)
app.use(store)
app.use(router)
app.mount('#app')

// TODO: move elsewhere
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!getToken()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})
