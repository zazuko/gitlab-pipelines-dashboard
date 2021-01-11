import type { VuexOidcState } from 'vuex-oidc'
import Vue from 'vue'
import Vuex from 'vuex'
import { wrapStore } from 'vuex-composition-helpers'

import oidc from './oidc'
import query, { State as QueryState } from './query'
import sw, { State as SwState } from './sw'

Vue.use(Vuex)

export interface RootState {
  oidc: VuexOidcState,
  query: QueryState,
  sw: SwState,
}

const store = new Vuex.Store<RootState>({
  modules: {
    oidc,
    query,
    sw
  }
})

const {
  createNamespacedHelpers,
  useActions,
  useGetters,
  useMutations,
  useState
} = wrapStore(store)

export { createNamespacedHelpers, useActions, useGetters, useMutations, useState }

export default store
