import type { VuexOidcState } from 'vuex-oidc'
import Vue from 'vue'
import Vuex from 'vuex'

import oidc from './oidc'
import sw from './sw'

Vue.use(Vuex)

export interface RootState {
  oidc: VuexOidcState
}

export default new Vuex.Store<RootState>({
  modules: {
    oidc,
    sw
  }
})
