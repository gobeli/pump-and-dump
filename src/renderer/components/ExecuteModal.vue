<template>
  <div class="modal" :class="{ 'is-active': open }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Use Strategy</p>
        <button @click="$emit('close-modal')" class="delete"></button>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <h3>Trade {{marketSummary.MarketName}}</h3>
          <p>Buy: <strong>{{buy}} {{market}}</strong> at <strong>{{bid}}</strong> bid</p>
          <p>Sell for: <strong>{{sell}} BTC</strong> at <strong>{{ask}}</strong> ask</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <a class="button is-info" @click="submit()">Submit</a>
      </footer>
    </div>
  </div>
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
      buy() {
        if (this.marketSummary && this.strategy) {
          return this.strategy.volume / this.bid
        }
      },
      sell() {
        if (this.marketSummary && this.strategy) {
          return this.strategy.volume * (1 + (this.strategy.sellAt / 100));
        }
      }
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
        this.$bittrex.buylimit({ market: `BTC-${this.market}`, quantity: this.buy, rate: this.rateBuy }, (data, err) => { console.log(handleResponse(data, err, this)) });
        this.$bittrex.selllimit({ market: `BTC-${this.market}`, quantity: this.buy, rate: this.rateSell }, (data, err) => { console.log(handleResponse(data, err, this)) });
        this.$bus.$emit('update');
      }
    }
  }
</script>