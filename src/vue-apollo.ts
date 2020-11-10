import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { RestLink } from 'apollo-link-rest'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, FetchResult, NextLink, Operation } from 'apollo-link'
import { DirectiveNode, visit } from 'graphql'
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

  return Object.fromEntries(Object.entries(obj as object).map(([key, value]) => {
    if (typeof value === 'object') {
      return [key, mapId(value)]
    } else if (key === 'id' && typeof value === 'string') {
      return [key, value.replace(PROJECT_ID_RE, '$1')]
    } else {
      return [key, value]
    }
  }))
}

type RemoveDirectiveLinkSettings = {
  directive: string;
}
class RemoveDirectiveLink extends ApolloLink {
  private readonly directive: string;
  constructor ({ directive }: RemoveDirectiveLinkSettings) {
    super()
    this.directive = directive
  }

  public request (
    operation: Operation,
    forward: NextLink
  ) {
    operation.query = visit(operation.query, {
      Directive: (node: DirectiveNode) => {
        if (node.name.value === this.directive) {
          return null
        }
      }
    })
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

const directiveLink = new RemoveDirectiveLink({ directive: 'export' })

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

const client = new ApolloClient({
  link,
  cache
})

const provider = new VueApollo({
  defaultClient: client
})

export { provider, client }
