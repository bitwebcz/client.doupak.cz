import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Login from '@/components/Login.vue'


const createTestStore = (state = {}, actions = {}) => createStore({
  state: {
      ...state,
      auth: {
          loading: false,
          isLogged: false
      },
  },
  actions: {
     ...actions,
     // login: () => jest.fn(),
     // logout: () => jest.fn()
  }
})
const store = createTestStore()

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
        ]
    }
})

describe('Login.vue', () => {

    // async if we need to wait for button trigger
    it('works somehow', async () => {

      const wrapper = mount(Login, setupMount())

      expect(store.state.auth.loading).toBe(false)
      expect(store.state.auth.isLogged).toBe(false)
      expect(wrapper.html()).toContain('<button>Sign in</button>')

      const emailInput = wrapper.find('input[name=email]')
      await emailInput.setValue('my@mail.com')
      expect(emailInput.element.value).toBe('my@mail.com')

      const passInput = wrapper.find('input[name=password]')
      await passInput.setValue('jaban')
      expect(passInput.element.value).toBe('jaban')

      await wrapper.find('button').trigger('click')
      console.log(wrapper)


      // expect(wrapper.html()).toContain('not valid')
      // expect(store.state.auth.loading).toBe(true)
      // expect(wrapper.html()).toContain('loading')
      // expect(spy).toHaveBeenCalled()
    })
})
