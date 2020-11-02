<template>
  <ul v-if="result && result.users">
    <li v-for="user of result.users" :key="user.id">
      {{ user.id }} {{ user.name }}
    </li>
  </ul>
</template>

<script>
import { queries } from "@/components/ApolloExamples.gql";
import { useQuery } from '@vue/apollo-composable'

export default {
  setup () {
    const filters = {};
    const page = 1;
    const { result } = useQuery(
        queries.catalog({filters}),
        {
            first: 25,
            page: page,
            fulltext: filters.fulltext
              ? `%${filters.fulltext.toLowerCase()}%`
              : `%`
        }
    )

    return {
      result,
    }
  },
}
</script>
