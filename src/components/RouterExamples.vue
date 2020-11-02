<template>
<h2>Router examples</h2>
<div>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    (namespaced)
    <router-link :to="{ name: 'Home' }">Home</router-link> |
    <router-link :to="{ name: 'About' }">About</router-link> |
    <router-link :to="{ name: 'RouterExamples', params: { name: 'lojza' } }">Route test</router-link>


    <br>
    Parameter name: {{ name }}
</div>
</template>

<script>
export default {
    name: 'StoreExamples',
    props: ["name"],
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
