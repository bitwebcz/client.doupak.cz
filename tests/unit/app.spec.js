import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import App from '@/App.vue'
import store from '@/store'
import { DefaultApolloClient } from '@vue/apollo-composable'
import apolloClient from '@/plugins/apollo'

const setupMount = (plugins = [], isShallow = false) => ({
    shallow: isShallow, // automatically stub out all the child components
    global: {
        mocks: {
          $t: () => {},
          $toast: {
            error: () => {},
            success: () => {},
            alert: () => {}
          }
        },
        plugins: [
            ...plugins,
            store
        ],
        provide: {
           [DefaultApolloClient]: apolloClient
         }
    }
})

describe('App.vue', () => {

    // async if we need to wait for button trigger
    it('works somehow', async () => {

      const wrapper = mount(App, setupMount())

      expect(wrapper.html()).toContain('<button>Sign in</button>')
      // expect(store.state.auth.loading).toBe(false)
      // expect(store.state.auth.isLogged).toBe(false)
      // expect(wrapper.html()).toContain('<button>Sign in</button>')
      //
      // const emailInput = wrapper.find('input[name=email]')
      // await emailInput.setValue('my@mail.com')
      // expect(emailInput.element.value).toBe('my@mail.com')
      //
      // const passInput = wrapper.find('input[name=password]')
      // await passInput.setValue('jaban')
      // expect(passInput.element.value).toBe('jaban')
      //
      // await wrapper.find('button').trigger('click')
      // console.log(wrapper)


      // expect(wrapper.html()).toContain('not valid')
      // expect(store.state.auth.loading).toBe(true)
      // expect(wrapper.html()).toContain('loading')
      // expect(spy).toHaveBeenCalled()
    })
})
