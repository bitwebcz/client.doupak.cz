const state = () => ({
    count: 1,
    total: 2
})

const getters = {
    isAdmin () {  } // -> getters['account/isAdmin']
}

const actions = {
    login () {  } // -> dispatch('account/login')
}

const mutations = {
    login () {  } // -> commit('account/login')
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
