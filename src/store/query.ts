import { ActionContext, ActionTree, Module } from 'vuex'

export interface State {
  pollInterval: number;
}

export interface Actions extends ActionTree<State, unknown> {
  setPollInterval(ctx: ActionContext<State, unknown>, pollInterval: number)
}

const queryModule: Module<State, unknown> = {
  namespaced: true,
  state: () => ({
    pollInterval: 60000
  }),
  mutations: {
    setPollInterval (state: State, pollInterval: number): void {
      state.pollInterval = pollInterval
    }
  },
  actions: {
    setPollInterval ({ commit }: ActionContext<State, unknown>, pollInterval: number): void {
      commit('setPollInterval', pollInterval)
    }
  }
}

export default queryModule
