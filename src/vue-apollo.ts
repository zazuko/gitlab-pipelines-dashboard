import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

import store from '@/store'

// Install the vue plugin
Vue.use(VueApollo)

// Http endpoint
const httpEndpoint = `${process.env.VUE_APP_GITLAB}/api/graphql`

const httpLink = createHttpLink({
  uri: httpEndpoint
})

const authLink = setContext(async (_req, ctx) => {
  let authorization
  if (store.state.oidc.access_token) {
    authorization = `Bearer ${store.state.oidc.access_token}`
  }
  return {
    ...ctx,
    headers: {
      ...ctx.headers,
      authorization
    }
  }
})

const link = authLink.concat(httpLink)

const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache
})

const provider = new VueApollo({
  defaultClient: client
})

export { provider, client }
