import { Module } from 'vuex'
import { NotificationProgrammatic as Notification } from 'buefy'

type State = {
  ready: boolean;
  registered: boolean;
  cached: boolean;
  updatefound: boolean;
  updated: boolean;
  offline: boolean;
  error?: Error;
}

const swModule: Module<State, unknown> = {
  namespaced: true,
  state: () => ({
    ready: false,
    registered: false,
    cached: false,
    updatefound: false,
    updated: false,
    offline: false
  }),
  mutations: {
    ready (state) {
      state.ready = true
    },
    registered (state) {
      state.registered = true
    },
    cached (state) {
      state.cached = true
    },
    updatefound (state) {
      state.ready = true
    },
    updated (state) {
      state.updated = true
    },
    offline (state) {
      state.offline = true
    },
    error (state, error: Error) {
      state.error = error
    }
  },
  actions: {
    ready ({ commit }) {
      commit('ready')
    },
    registered ({ commit }) {
      commit('registered')
    },
    cached ({ commit }) {
      commit('cached')
    },
    updatefound ({ commit }) {
      commit('updatefound')
    },
    updated ({ commit }, registration?: ServiceWorkerRegistration) {
      commit('updated')
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
      Notification.open({
        message: 'A new version is available. Please refresh!',
        position: 'is-bottom-right',
        hasIcon: true
      })
    },
    offline ({ commit }) {
      commit('offline')
    },
    error ({ commit }, error?: Error) {
      commit('error', error)
    }
  }
}

export default swModule
