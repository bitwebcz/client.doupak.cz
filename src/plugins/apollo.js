import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { getToken } from '../composables/authToken'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost/api/graphql',
  credentials: 'same-origin' // TODO: cange for another domain
})
// Cache implementation
const cache = new InMemoryCache()

// Create authorization link
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getToken()
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
})

export default apolloClient
