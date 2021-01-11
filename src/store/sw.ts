import { ActionContext, Module } from 'vuex'
import { NotificationProgrammatic as Notification } from 'buefy'

export interface State {
  ready: boolean
  registered: boolean
  cached: boolean
  updatefound: boolean
  updated: boolean
  offline: boolean
  error?: Error
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
    ready (state: State): void {
      state.ready = true
    },
    registered (state: State): void {
      state.registered = true
    },
    cached (state: State): void {
      state.cached = true
    },
    updatefound (state: State): void {
      state.ready = true
    },
    updated (state: State): void {
      state.updated = true
    },
    offline (state: State): void {
      state.offline = true
    },
    error (state: State, error: Error): void {
      state.error = error
    }
  },
  actions: {
    ready ({ commit }: ActionContext<State, unknown>): void {
      commit('ready')
    },
    registered ({ commit }: ActionContext<State, unknown>): void {
      commit('registered')
    },
    cached ({ commit }: ActionContext<State, unknown>): void {
      commit('cached')
    },
    updatefound ({ commit }: ActionContext<State, unknown>): void {
      commit('updatefound')
    },
    updated ({ commit }: ActionContext<State, unknown>, registration?: ServiceWorkerRegistration): void {
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
    offline ({ commit }: ActionContext<State, unknown>): void {
      commit('offline')
    },
    error ({ commit }: ActionContext<State, unknown>, error?: Error): void {
      commit('error', error)
    }
  }
}

export default swModule
