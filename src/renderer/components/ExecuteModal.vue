<template>
  <el-dialog
    title="Use Strategy"
    :visible.sync="open"
    size="tiny"
    :before-close="() => $emit('close-modal')">
    <h3>Trade {{market}} ({{lastPrice}})</h3>
    <p>Buy: <strong>{{quantity}} {{market}}</strong> at <strong>{{bid}}</strong></p>
    <p>Sell at <strong>{{ask}}</strong></p>
    <el-button type="primary" @click="submit()">Ok</el-button>
  </el-dialog>

</template>
<script>
  import { mapGetters } from 'vuex';

  import { handleError } from '../helper';

  export default {
    name: 'pnd-execute-modal',
    props: ['open', 'strategy', 'market'],
    watch: {
      open() {
        this.update();
      },
      strategy() {
        this.update();
      },
      market() {
        this.update();
      }
    },
    computed: {
      ...mapGetters([
        'lastPrice',
      ]),
      rateBuy() {
        return 1 + (this.strategy.buyAt / 100);
      },
      rateSell() {
        return 1 + (this.strategy.sellAt / 100);
      },
      bid() {
        return this.lastPrice && this.lastPrice * this.rateBuy;
      },
      ask() {
        return this.lastPrice &&  this.lastPrice * this.rateSell;
      },
      quantity() {
        if (this.lastPrice && this.strategy) {
          return this.strategy.volume / this.bid;
        }
      },
    },
    methods: {
      update() {
        if (!this.market || this.market.length < 3) {
          return;
        }
      },
      submit() {
        let buyOrder;
        this.$store.state.exchange.createLimitBuyOrder(this.market, this.quantity, this.bid)
          .then(b => {
            this.$message({
              message: 'Buy-Order placed successfully',
              type: 'success',
            });
            buyOrder = b;
          })
          .then(() => this.$store.state.exchange.createLimitSellOrder(this.market, this.quantity, this.ask))
          .then(s => {
            this.$message({
              message: 'Sell-Order placed successfully',
              type: 'success',
            });
            this.$bus.$emit('update');
            this.$emit('close-modal');
            this.$store.commit('SET_RUNNING', { running: true, settings: { buy: this.bid, sell: this.ask, quantity: this.quantity, buyOrder, sellOrder: s } });
          })
          .catch(handleError(this));
      }
    }
  }
</script>
