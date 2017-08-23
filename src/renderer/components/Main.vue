<template>
  <div id="wrapper" v-if="!apiKey || !apiSecret">
  </div>
  <div class="container" style="margin-top: 1rem;" v-else>
    <execute-modal :market="selectedMarket" :strategy="selectedStrategy" :open="executeModalShown" @close-modal="executeModalShown = false"></execute-modal>
    <el-row :gutter="20">
      <el-col>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>Market</h3>
          </div>
          <el-autocomplete class="inline-input" 
            @select="update($event.value)" 
            v-model="market"
            :fetch-suggestions="findMarket" placeholder="Market" :trigger-on-focus="false"></el-autocomplete>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <h3>Strategies</h3>            
          </div> 
        <strategy-table :strategies="strategies" @use-strategy="useStrategy" @delete-strategy="deleteStrategy"></strategy-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <h3>Add Strategy</h3>                        
          </div>
          <strategy-form :strategy-model="strategyModel" @submit-strategy="submitStrategy()"></strategy-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <h3>Open Orders</h3>                        
          </div>
          <orders :orders="openOrders"></orders>        
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <h3>Order History</h3>                        
          </div>
          <orders :orders="orderHistory"></orders>        
        </el-card>
      </el-col>
    </el-row>
    <el-button type="primary" @click="logout">Logout</el-button>
  </div>
</template>

<script>
  import { handleResponse } from '../helper';
  import { getApiKey, getApiSecret, setApiKey, setApiSecret, storePrefix } from '../helper';

  export default {
    data: () => ({
      apiKey: '',
      apiSecret: '',
      markets: [],
      strategyModel: {
        buyAt: 0,
        sellAt: 0,
        volume: 0
      },
      market: '',
      selectedMarket: '',
      
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

    created() {
      this.apiKey = getApiKey();
      this.apiSecret = getApiSecret();
      this.initialize();
      this.$bus.$on('update', this.update.bind(this));
    },

    methods: {
      logout() {
        setApiKey(null);
        setApiSecret(null);
        this.$router.go('/login');
      },
      initialize() {
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
      update(market) {
        if (market) {
          localStorage.setItem(`${storePrefix}CURRENCY`, market);
          this.market = market;
          this.selectedMarket = market;
        }

        if (!this.market || this.market.length < 3) {
          return;
        }

        this.$bittrex.getopenorders(`BTC-${this.market}`, 
          (data, err) => this.openOrders = handleResponse(data, err, this));

        this.$bittrex.getorderhistory({market: `BTC-${this.market}`}, 
          (data, err) => this.orderHistory = handleResponse(data, err, this));
      },
      findMarket(queryString, cb) {
        let markets = this.markets.map(m => m.MarketCurrency);
        markets = markets.filter(m => m.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        cb([...new Set(markets)].map(m => ({ value: m })));
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
<style lang="scss" scoped="false">
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    h3 {
      margin: 0;
    }
  }
</style>