import apolloClient from '@/plugins/apollo'
import gql from "graphql-tag"
import { getToken, saveToken, destroyToken } from '@/composables/authToken'

const state = () => ({
    count: 1,
    total: 2,
    loading: false,
    isLogged: getToken()
})

const getters = {
    //
}

const actions = {
    login(context, payload) {
      context.commit("setLoading", {loading: true})

      return apolloClient
          .mutate({
            variables: {
              email: payload.email,
              password: payload.password
            },
            mutation: gql`
              mutation Login($email: String!, $password: String!) {
                login(data: { username: $email, password: $password }) {
                  accessToken
                  user {
                    id
                    name
                    email
                  }
                }
              }
            `
          })
          .then(result => {
            saveToken(result.data.login.accessToken)
            // ensure that the UI and store state reflects the current user's permissions
            apolloClient.resetStore()
            context.commit("setIsLogged", {isLogged: true})
          })
          .catch(error => {
            throw error
          })
          .finally(() => {
              context.commit("setLoading", {loading: false})
          })
    },
    logout(context, payload) {
      context.commit("setLoading", {loading: true})

      return apolloClient
          .mutate({
            variables: {
              email: payload.email,
              password: payload.password
            },
            mutation: gql`
                mutation {
                  logout {
                    status
                    message
                  }
                }
            `
          })
          .then(() => {
            destroyToken()
            apolloClient.resetStore()
            context.commit("setIsLogged", {isLogged: false})
          })
          .catch(error => {
            throw error
          })
          .finally(() => {
              context.commit("setLoading", {loading: false})
          })
    }
}

const mutations = {
    setLoading(state, payload) {
      state.loading = payload.loading
    },
    setIsLogged(state, payload) {
      state.isLogged = payload.isLogged
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
