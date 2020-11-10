import { createApp } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
// global component
import DialogWindow from './components/Dialog'
// store
import store from './store'
// router
import router from './router'
// other plugins
import apolloClient from './plugins/apollo'
import './plugins/vee-validate'

const app = createApp(App)
app.component('DialogWindow', DialogWindow)
app.provide(DefaultApolloClient, apolloClient)
app.use(store)
app.use(router)
app.mount('#app')
