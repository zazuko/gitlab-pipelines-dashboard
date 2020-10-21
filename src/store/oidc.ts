import { vuexOidcCreateStoreModule } from 'vuex-oidc'

/* eslint-disable @typescript-eslint/camelcase */
export default vuexOidcCreateStoreModule({
  authority: `${process.env.VUE_APP_GITLAB}`,
  loadUserInfo: false,
  metadata: {
    authorization_endpoint: `${process.env.VUE_APP_GITLAB}/oauth/authorize`,
    token_endpoint: `${process.env.VUE_APP_GITLAB}/oauth/token`,
    revocation_endpoint: `${process.env.VUE_APP_GITLAB}/oauth/revoke`,
    introspection_endpoint: `${process.env.VUE_APP_GITLAB}/oauth/introspect`,
    userinfo_endpoint: `${process.env.VUE_APP_GITLAB}/oauth/userinfo`,
    jwks_uri: `${process.env.VUE_APP_GITLAB}/oauth/discovery/keys`
  },
  clientId: process.env.VUE_APP_OIDC_CLIENT_ID || '',
  redirectUri: 'http://localhost:8080/oidc/callback',
  scope: 'openid profile email read_api read_user api',
  responseType: 'token'
}, {
  namespaced: true,
  publicRoutePaths: ['/oidc/']
})
