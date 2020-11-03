<template>
    <aside />

    <header>
        <nav>
          <router-link :to="{ name: 'Home' }">Home</router-link> |
          <router-link :to="{ name: 'About' }">About</router-link>
        </nav>
    </header>

    <main>
        <router-view />
    </main>

    <footer>
        <login />
    </footer>
</template>

<script>
import Login from '@/components/Login'

export default {
    name: "AppLayout",
    components: {
      Login
    }
}
</script>
