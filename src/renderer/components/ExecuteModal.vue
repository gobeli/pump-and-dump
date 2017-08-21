<template>
  <el-dialog
    title="Use Strategy"
    :visible.sync="open"
    size="tiny"
    :before-close="() => $emit('close-modal')">
    <h3>Trade {{marketSummary.MarketName}}</h3>
    <p>Buy: <strong>{{quantity}} {{market}}</strong> at <strong>{{bid}}</strong> bid</p>
    <p>Sell at <strong>{{ask}}</strong> ask</p>
    <el-button type="primary" @click="submit()">Ok</el-button>
  </el-dialog>
  
</template>
<script>  
  import { handleResponse } from '../helper';

  export default {
    name: 'execute-modal',
    props: ['open', 'strategy', 'market'],
    data: () => ({
      marketSummary: {}
    }),
    watch: {
      strategy() {
        this.update();
      },
      market() {
        this.update();
      }
    },
    computed: {
      rateBuy() {
        return 1 + (this.strategy.buyAt / 100);
      },
      rateSell() {
        return 1 + (this.strategy.sellAt / 100);
      },
      bid() {
        return this.marketSummary.Bid * this.rateBuy;
      },
      ask() {
        return this.marketSummary.Ask * this.rateSell;
      },
      quantity() {
        if (this.marketSummary && this.strategy) {
          return this.strategy.volume / this.bid;
        }
      },
    },
    methods: {
      update() {
        if (!this.market || this.market.length < 3) { 
          return;
        }
        this.$bittrex.getmarketsummary({market: `BTC-${this.market}`}, 
          (data, err) => this.marketSummary = handleResponse(data, err, this)[0] || {});
      },
      submit() {
        this.$bittrex.buylimit({ market: `BTC-${this.market}`, quantity: this.quantity, rate: this.bid }, (data, err) => { 
          const res = handleResponse(data, err, this);
          if (res.uuid) {
            this.$message({
              message: 'Buy-Order successfull',
              type: 'success',
            });
          }
        });
        this.$bittrex.selllimit({ market: `BTC-${this.market}`, quantity: this.quantity, rate: this.ask }, (data, err) => {
          const res = handleResponse(data, err, this);
          if (res.uuid) {
            this.$message({
              message: 'Sell-Order successfull',
              type: 'success',
            });
          }
        });
        this.$bus.$emit('update');
        this.$emit('close-modal');
      }
    }
  }
</script>