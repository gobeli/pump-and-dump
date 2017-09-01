import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  running: false,
  settings: {
    quantity: 0,
    buy: 0,
    sell: 0,
  },
};

const mutations = {
  SET_RUNNING(state, payload) {
    if (payload.running) {
      state.settings = payload.settings;
    }
    state.running = payload.running;
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
