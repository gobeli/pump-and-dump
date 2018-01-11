import Vue from 'vue';
import Vuex from 'vuex';
import ccxt from 'ccxt';

Vue.use(Vuex);

const state = {
  exchange: null,
  running: false,
  settings: {
    quantity: 0,
    buy: 0,
    sell: 0,
  },
};

const mutations = {
  SET_EXCHANGE(state, payload) {
    state.exchange = new ccxt[payload.exchange]({
      apiKey: payload.key,
      secret: payload.secret,
    });
  },
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
