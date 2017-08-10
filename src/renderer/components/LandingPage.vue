<template>
  <div id="wrapper" v-if="!apiKey || !apiSecret">
    <label for="apiKey">Api Key</label>
    <input type="text" name="apiKey" v-model="apiModel.key">
    <label for="apiSecret">Api Secret</label>
    <input type="text" name="apiSecret" v-model="apiModel.secret">
    <button @click="submit">Submit</button>
  </div>
  <div class="container" style="margin-top: 1rem;" v-else>
    <execute-modal :market="market" :strategy="selectedStrategy" :open="executeModalShown" @close-modal="executeModalShown = false"></execute-modal>
    <div class="content">
      <div class="columns">
        <div class="column">
          <div class="card card-content">
            <h2>Market</h2>
            <div class="field">
              <div class="control">
                <input class="input" type="text" name="market" v-model="market"><br>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="card">
            <div class="card-content">
              <h2>Strategies</h2> 
              <strategy-table :strategies="strategies" @use-strategy="val => useStrategy(val)" @delete-strategy="val => deleteStrategy(val)"></strategy-table>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="card">
            <div class="card-content">
              <h2>Add Strategy</h2>
              <strategy-form :strategy-model="strategyModel" @submit-strategy="submitStrategy()"></strategy-form>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="card">
            <div class="card-content">
              <orders title="Open Orders" :orders="openOrders"></orders>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="card">
            <div class="card-content">
              <orders title="Order History" :orders="orderHistory"></orders>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation';
  import { handleResponse } from '../helper';

  const storePrefix = 'pump_and_dump_';

  export default {
    name: 'landing-page',
    data: () => ({
      markets: [],
      apiModel: {
        key: '',
        secret: '',
      },
      strategyModel: {
        buyAt: 0,
        sellAt: 0,
        volume: 0
      },
      apiKey: '',
      apiSecret: '',
      market: '',
      executeModalShown: false,
      get strategies() {
        return JSON.parse(localStorage.getItem(`${storePrefix}STRATEGIES`))
      },
      set strategies(value) {
        localStorage.setItem(`${storePrefix}STRATEGIES`, JSON.stringify(value));
      },
      selectedStrategy: {},
      openOrders: [],
      orderHistory: []
    }),
    watch: {
      market(val) {
        if (this.markets.map(m => m.MarketCurrency).includes(val)) {
          localStorage.setItem(`${storePrefix}CURRENCY`, val);
          this.update();
        }
      }
    },
    mounted() {
      this.initialize();
      this.$bus.$on('update', this.update.bind(this));
    },
    methods: {
      submit() {
        localStorage.setItem(`${storePrefix}APIKEY`, this.apiModel.key);
        localStorage.setItem(`${storePrefix}APISECRET`, this.apiModel.secret);
        this.initialize();
      },
      initialize() {
        this.apiSecret = localStorage.getItem(`${storePrefix}APISECRET`);
        this.apiKey = localStorage.getItem(`${storePrefix}APIKEY`);
        this.market = localStorage.getItem(`${storePrefix}CURRENCY`);
        if (this.apiSecret && this.apiKey) {
          this.$bittrex.options({
            'apikey' : this.apiKey,
            'apisecret' : this.apiSecret, 
          });
          this.$bittrex.getmarkets((data, err) => this.markets = handleResponse(data, err, this));
          if (this.market) {
            this.update();            
          }
        }
      },
      update() {
        if (!this.market || this.market.length < 3) {
          return;
        }
        this.$bittrex.getopenorders(`BTC-${this.market}`, 
          (data, err) => this.openOrders = handleResponse(data, err, this));

        this.$bittrex.getorderhistory({market: `BTC-${this.market}`}, 
          (data, err) => this.orderHistory = handleResponse(data, err, this));
      },
      submitStrategy() {
        const strategies = this.strategies || [];
        strategies.push(Object.assign({}, this.strategyModel, { uid: new Date().getTime() }));
        this.strategies = strategies;
        this.strategyModel = {};
      },
      deleteStrategy(strategy) {
        this.strategies = this.strategies.filter(s => s.uid !== strategy.uid)
      },
      useStrategy(strategy) {
        this.selectedStrategy = strategy;
        this.executeModalShown = true;
      }
    },
  };
</script>