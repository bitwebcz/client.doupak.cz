<template>
<h2>Store examples</h2>
<div>
    <p>{{ count }}</p>
    <p>{{ configCount }}</p>
</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    name: 'StoreExamples',
    computed: {
        ...mapState('auth', [
            'count',
            'total'
        ]),
        ...mapState('config', {
          configCount: state => state.count
        }),
        ...mapGetters('auth', [
          'someGetter', // -> this.someGetter
          'someOtherGetter', // -> this.someOtherGetter
        ])
    },
    methods: {
      ...mapActions('auth', [
        'foo', // -> this.foo()
        'bar' // -> this.bar()
      ])
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
