import Vue from 'vue'
import VueApollo from '@vue/apollo-option'
import { ApolloClient, ApolloLink, createHttpLink } from '@apollo/client/core'
import type { NextLink, Operation, FetchResult } from '@apollo/client/core'
import { RestLink } from 'apollo-link-rest'
import { setContext } from '@apollo/client/link/context'
import { InMemoryCache } from '@apollo/client/cache'
import { persistCacheSync } from 'apollo3-cache-persist'
import camelCase from 'camelcase'
import { snakeCase } from 'snake-case'

import store from '@/store'

// Install the vue plugin
Vue.use(VueApollo)

const PROJECT_ID_RE = /gid:\/\/gitlab\/Project\/(\d+)/

const mapId = (obj: unknown): unknown => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(mapId)
  }

  return Object.fromEntries(Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'object') {
      return [key, mapId(value)]
    } else if (key === 'id' && typeof value === 'string') {
      return [key, value.replace(PROJECT_ID_RE, '$1')]
    } else {
      return [key, value]
    }
  }))
}

class RemoveDirectiveLink extends ApolloLink {
  public request (
    operation: Operation,
    forward: NextLink
  ) {
    return forward(operation).map((res) => mapId(res) as FetchResult)
  }
}

// Http endpoint
const httpEndpoint = `${window.APP_CONFIG.gitlab}/api/graphql`
const restEndpoint = `${window.APP_CONFIG.gitlab}/api/v4`

const httpLink = createHttpLink({
  uri: httpEndpoint
})

const restLink = new RestLink({
  uri: restEndpoint,
  fieldNameNormalizer: (key: string) => camelCase(key),
  fieldNameDenormalizer: (key: string) => snakeCase(key)
})

const directiveLink = new RemoveDirectiveLink()

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

const link = authLink
  .concat(restLink)
  .concat(directiveLink)
  .concat(httpLink)

const cache = new InMemoryCache()

persistCacheSync({
  cache,
  storage: window.localStorage
})

const client = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      pollInterval: 60000
    }
  }
})

const provider = new VueApollo({
  defaultClient: client
})

export { provider, client }
