import { createStore } from 'vuex'
import modules from "./modules"

export default createStore({
    namespaced: true,
    modules: modules
})
