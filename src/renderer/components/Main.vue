<template>
  <div class="container" style="margin-top: 1rem;">
    <execute-modal :lastPrice="lastPrice" :market="selectedMarket" :strategy="strategy" :open="executeModalShown" @close-modal="executeModalShown = false"></execute-modal>

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
          <el-input-number style="width: 100%" v-model="pollTimeout" @change="updateGui()"></el-input-number>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <h3>Strategy</h3>
          </div>
          <strategy-form :strategy-model="strategy" @strategy-changed="submitStrategy"></strategy-form>
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
          <vue-chart
              :rows="marketData.map(x => [null, x.last, x.buy, x.sell])"
              :columns="[{ type: 'string', label: '' },{ type: 'number', label: 'Last' }, { type: 'number', label: 'Buy' }, { type: 'number', label: 'Sell' }]"
              :options="chartOptions"
          ></vue-chart>
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
  import { getApiKey, getApiSecret, setApiKey, setApiSecret, storePrefix, initExchange, handleError } from '../helper';

  export default {
    data: () => ({
      // polling
      pollTimeout: 5000,
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
      // chart
      marketData: [],
      chartStrategy: this.strategies ? this.strategies[0] : {},
      tickerInterval: null,
      lastPrice: null,
      chartOptions: {
        annotations: {
          duration: 1000,
          easing: 'out',
        },
        hAxis: {
          title: 'time',
        },
        vAxis: {
          title: 'price',
        },
      },
      // orders
      executeModalShown: false,
      openOrders: [],
      orderHistory: []
    }),

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

      getTicker() {
        this.$store.state.exchange.fetchTicker(this.selectedMarket).catch(handleError(this))
          .then(tick => {
            this.lastPrice = tick;
            this.marketData.push({last: tick.last,
              buy: this.$store.state.running ? this.$store.state.settings.buy : null,
              sell: this.$store.state.running ? this.$store.state.settings.sell : null
            });
            if (this.marketData.length > 100) {
              this.marketData.splice(0, 1);
            }
          });
      },

      updateGui(market) {
        if (!!market === true) {
          this.marketData = [];
          localStorage.setItem(`${storePrefix}CURRENCY`, market);
          this.market = market;
          this.selectedMarket = market;
          clearInterval(this.tickerInterval);
          this.getTicker();
          this.tickerInterval = setInterval(this.getTicker.bind(this), this.pollTimeout);
        }

        if (!this.market) {
          return
        }
        if (this.$store.state.exchange.hasFetchOrders) {
          this.$store.state.exchange.fetchOrders(this.market).catch(handleError(this))
            .then(orders => {
              this.orderHistory = orders.filter(o => o.status === 'closed');
              console.log(orders)
              this.openOrders = orders.filter(o => o.status === 'open');
            });
        } else {
          this.$message({ type: 'error', message: 'Fetch Orders is not supportet by ' + this.$store.state.exchange.id })
        }
      },

      findMarket(queryString, cb) {
        const markets = this.markets.filter(m => m.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        cb([...new Set(markets)].map(m => ({ value: m })));
      },

      submitStrategy(value) {
        localStorage.setItem(`${storePrefix}STRATEGY`, JSON.stringify(value));
      },

      deleteStrategy(strategy) {
        this.strategies = this.strategies.filter(s => s.uid !== strategy.uid)
      },

      useStrategy() {
        if (this.strategy && this.strategy.volume > 0 && this.strategy.buyAt > 0 && this.strategy.sellAt > 0) {
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
            )
          }
        })

      },

      cancel(sell) {
        this.$store.commit('SET_RUNNING', { running: false });
        this.cancelOrder(this.$store.state.settings.buyOrder.id);
        this.cancelOrder(this.$store.state.settings.sellOrder.id);
        if (sell) {
          const rate = this.marketData[this.marketData.length - 1].last;
          this.$store.state.exchange.createLimitSellOrder(this.selectedMarket, this.$store.state.settings.quantity, rate)
            .catch(handleError(this))
            .then(res => {
              this.$message({
                message: 'Sell-Order placed successfully',
                type: 'success',
              });
            })
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
