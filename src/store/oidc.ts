import { vuexOidcCreateStoreModule } from 'vuex-oidc'

/* eslint-disable @typescript-eslint/camelcase */
export default vuexOidcCreateStoreModule({
  authority: `${window.APP_CONFIG.gitlab}`,
  loadUserInfo: false,
  metadata: {
    authorization_endpoint: `${window.APP_CONFIG.gitlab}/oauth/authorize`,
    token_endpoint: `${window.APP_CONFIG.gitlab}/oauth/token`,
    revocation_endpoint: `${window.APP_CONFIG.gitlab}/oauth/revoke`,
    introspection_endpoint: `${window.APP_CONFIG.gitlab}/oauth/introspect`,
    userinfo_endpoint: `${window.APP_CONFIG.gitlab}/oauth/userinfo`,
    jwks_uri: `${window.APP_CONFIG.gitlab}/oauth/discovery/keys`
  },
  clientId: window.APP_CONFIG.oidcClientId || '',
  redirectUri: `${window.APP_CONFIG.publicUrl}/oidc/callback`,
  scope: 'openid profile email read_api read_user api',
  responseType: 'token',
  automaticSilentRenew: true
}, {
  namespaced: true,
  publicRoutePaths: ['/oidc/']
})
