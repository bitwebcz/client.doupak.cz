<template>
  <button @click="increment">
    Count is: {{ state.count }}, double is: {{ state.double }}
  </button>

  <br>
  {{ recentPosts }}

  <br>
  stored data: {{ sotredData }}

  <br>
  path: {{ currentRoute }}
</template>

<script>
import { reactive, computed, onMounted, ref } from "vue"
import { useStore } from "vuex"
import { useRouter, useRoute } from "vue-router"
import usePosts from "@/composables/posts"

export default {
  setup() {
    const state = reactive({
      count: 0,
      double: computed(() => state.count * 2),
    })

    function increment() {
      state.count++
    }


    // In-component store
    const store = useStore()
    const sotredData = computed(() => store.state.auth.total)

    // In-component routing
    const router = useRouter()
    router.beforeEach((to, from, next) => {
      next()
    })
    // In-component routing information
    const currentRoute = useRoute().path



    let recentPosts = ref([])
    const { posts, fetchPosts } = usePosts()
    onMounted(() => fetchPosts())
    recentPosts = computed(() => {
      return posts.value.slice(-10)
    })


    return {
      state,
      increment,
      recentPosts,
      sotredData,
      currentRoute
    }
  }
}
</script>
