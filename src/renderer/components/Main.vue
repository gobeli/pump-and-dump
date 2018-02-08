<template>
  <div class="container" style="margin-top: 1rem;">
    <pnd-execute-modal :use-modal="useModal" :market="selectedMarket" :strategy="strategy" :open="executeModalShown" @close-modal="executeModalShown = false"></pnd-execute-modal>

    <el-dialog
      title="Use Strategy"
      :visible.sync="strategyModalShown"
      :before-close="_ => strategyModalShown = false">
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>Market</h3>
          </div>
          <el-autocomplete style="width: 100%" class="inline-input"
            :disabled="$store.state.running"
            @select="updateGui($event.value)"
            v-model="market"
            :fetch-suggestions="findMarket" placeholder="Market" :trigger-on-focus="false"></el-autocomplete>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <h3>Polling Timeout (MS)</h3>
          </div>
          <el-input-number style="width: 100%" v-model="pollingTimeout" @change="updateGui()"></el-input-number>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <h3>Strategy</h3>
          </div>
          <pnd-strategy-form :strategy-model="strategy"></pnd-strategy-form>
          <div style="float: left">
            <el-checkbox v-model="useModal">Use Modal</el-checkbox>
          </div>
          <el-button style="float: right; margin-bottom: 20px" type="primary" v-if="!$store.state.running" @click="useStrategy">Use</el-button>
          <el-button-group style="float: right; margin-bottom: 20px" v-if="$store.state.running">
            <el-button type="danger" @click="cancel(false)">Cancel</el-button>
            <el-button type="danger" @click="cancel(true)">Cancel and sell</el-button>
          </el-button-group>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <h3>{{market}}</h3>
          </div>
          <pnd-chart :pollingTimeout="pollingTimeout" :strategy="running ? strategy : null" :market="selectedMarket"></pnd-chart>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col>
        <el-card>
          <div slot="header" class="clearfix">
            <h3>Orders</h3>
          </div>
          <pnd-orders :orders="orders"></pnd-orders>
        </el-card>
      </el-col>
    </el-row>
    <el-button type="primary" @click="logout">Logout</el-button>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import {setApiKey, setApiSecret, storePrefix, initExchange, handleError } from '../helper';

  export default {
    data: () => ({
      // polling
      pollingTimeout: 5000,
      // market
      market: '',
      markets: [],
      selectedMarket: '',
      // strategies
      strategy: {
        volume: 0,
        buyAt: 0,
        sellAt: 0
      },
      strategyModalShown: false,
      running: false,
      useModal: true,
      // orders
      executeModalShown: false,
      orders: []
    }),

    computed: {
      ...mapGetters([
        'lastPrice',
      ])
    },

    created() {
      this.initialize();
      this.$bus.$on('update', _ => this.updateGui(null));
    },

    methods: {
      logout() {
        setApiKey(null);
        setApiSecret(null);
        this.$router.push('/login');
      },

      initialize() {
        initExchange(this.$store);
        const strategy = JSON.parse(localStorage.getItem(`${storePrefix}STRATEGY`));
        if (strategy && strategy !== 'null') {
          this.strategy = strategy;
        }
        this.$store.state.exchange.loadMarkets().catch(handleError(this))
          .then(m => {
            this.markets = Object.keys(m);
          });
        this.updateGui(localStorage.getItem(`${storePrefix}CURRENCY`));
      },

      updateGui(market) {
        if (!!market === true) {
          this.$store.commit('CLEAR_MARKETDATA');
          localStorage.setItem(`${storePrefix}CURRENCY`, market);
          this.market = market;
          this.selectedMarket = market;
        }

        if (this.market) {
          this.fetchOrders();
        }
      },

      fetchOrders() {
        if (this.$store.state.exchange.hasFetchOrders) {
          this.$store.state.exchange.fetchOrders(this.market)
            .then(orders => {
              this.orders = orders;
            }).catch(handleError(this));
        } else {
          this.$message({ type: 'error', message: 'Fetch Orders is not supportet by ' + this.$store.state.exchange.id })
        }
      },

      findMarket(queryString, cb) {
        const markets = this.markets.filter(m => m.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        cb([...new Set(markets)].map(m => ({ value: m })));
      },

      useStrategy() {
        if (this.strategy && this.strategy.volume > 0 && this.strategy.buyAt >= 0 && this.strategy.sellAt > 0) {
          this.executeModalShown = true;
        } else {
          this.$message({ message: 'Strategy is invalid', type: 'error' });
        }
      },

      cancelOrder(id) {
        this.$store.state.exchange.fetchOrder(this.$store.state.settings.buyOrder.id).then(o => {
          if (o.status === 'open') {
            this.$store.state.exchange.cancelOrder(id).then(() =>
              this.$message({
                message: 'Order cancelled',
                type: 'success',
              })
            ).then(() => this.$bus.$emit('update'))
          }
        }).catch(handleError(this))
      },

      cancel(sell) {
        this.$store.commit('SET_RUNNING', { running: false });
        this.cancelOrder(this.$store.state.settings.buyOrder.id);
        this.cancelOrder(this.$store.state.settings.sellOrder.id);
        if (sell) {
          this.$store.state.exchange.createLimitSellOrder(this.selectedMarket, this.$store.state.settings.quantity, this.lastPrice)
            .catch(handleError(this))
            .then(res =>
              this.$message({
                message: 'Sell-Order placed successfully',
                type: 'success',
              })
            ).then(() => this.$bus.$emit('update'));
        }
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
