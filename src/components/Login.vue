<template>
  <dialog-window v-if="!isLogged">
      <template #button>Log in</template>

      <template #aside>
          loading: {{ loading }}
          <Form v-if="!isLogged" @submit="login" v-slot="{ errors }" :disabled="loading">
             <Field name="email" type="text" :class="{ 'is-invalid': errors.email }" rules="required|email" />
             <ErrorMessage name="email" />

             <Field name="password" type="password" :class="{ 'is-invalid': errors.password }" rules="required|min:6" autocomplete="on" />
             <ErrorMessage name="password" />

             <button>Sign in</button>
          </Form>
      </template>
  </dialog-window>

  <Form v-if="isLogged" @submit="logout" :disabled="loading">
     <button>Log out</button>
  </Form>
</template>

<script>
import { computed } from 'vue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import { useStore } from "vuex"

export default {
    name: "Login",
    components: {
        Field,
        Form,
        ErrorMessage
    },
    setup() {
      const store = useStore()

      const loading = computed(() => store.state.auth.loading)
      const isLogged = computed(() => store.state.auth.isLogged)

      const login = values => {
          store.dispatch("auth/login", values)
               .then(() => {
                  console.log('login okay')
               })
               .catch(() => {
                  console.log('login not okay')
               })
      }

      const logout = values => {
          store.dispatch("auth/logout", values)
               .then(() => {
                  console.log('logout okay')
               })
               .catch(() => {
                  console.log('logout not okay')
               })
      }

      return {
        login,
        logout,
        loading,
        isLogged
      }
    }
}
</script>
