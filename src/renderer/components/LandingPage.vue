<template>
  <div id="wrapper" v-if="!apiKey || !apiSecret">
    <el-form>
      <el-form-item label="API Key">
        <el-input style="width: 100%" v-model="apiModel.key"></el-input>
      </el-form-item>
      <el-form-item label="API Secret">
        <el-input style="width: 100%" v-model="apiModel.secret"></el-input>
      </el-form-item>
      <el-button @click="submit">Submit</el-button>
    </el-form>
  </div>
  <div class="container" style="margin-top: 1rem;" v-else>
    <execute-modal :market="market" :strategy="selectedStrategy" :open="executeModalShown" @close-modal="executeModalShown = false"></execute-modal>
    <el-row :gutter="20">
      <el-col>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>Market</h3>
          </div>
          <el-input style="width: 100%" v-model="market"></el-input>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <h3>Strategies</h3>            
          </div> 
        <strategy-table :strategies="strategies" @use-strategy="val => useStrategy(val)" @delete-strategy="val => deleteStrategy(val)"></strategy-table>
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
  </div>
</template>

<script>
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