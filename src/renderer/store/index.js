import Vue from 'vue';
import Vuex from 'vuex';
import ccxt from 'ccxt';

Vue.use(Vuex);

const state = {
  exchange: null,
  running: false,
  marketData: [],
  settings: {
    quantity: 0,
    buy: 0,
    sell: 0,
  },
};

const mutations = {
  ADD_MARKETDATA(state, payload) {
    state.marketData = [...state.marketData, payload];
    if (state.marketData.length > 100) {
      state.marketData = state.marketData.slice(1, 100);
    }
  },
  CLEAR_MARKETDATA(state, payload) {
    state.marketData = [];
  },
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

const getters = {
  lastPrice: state => {
    const latest = state.marketData[state.marketData.length - 1];
    return latest ? latest.last : null;
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters
});
