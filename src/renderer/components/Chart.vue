<template>
  <vue-chart
      :rows="$store.state.marketData.map(x => [null, x.last, x.buy, x.sell])"
      :columns="[{ type: 'string', label: '' },{ type: 'number', label: 'Last' }, { type: 'number', label: 'Buy' }, { type: 'number', label: 'Sell' }]"
      :options="chartOptions"
  ></vue-chart>
</template>

<script>
  import { handleError } from '../helper';
  export default {
    name: 'pnd-chart',
    props: ['strategy', 'pollingTimeout', 'market'],
    data: () => ({
      marketData: [],
      tickerInterval: null,
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
    }),
    created() {
      this.createTicker(this.pollingTimeout);
    },
    watch: {
      pollingTimeout(newVal, oldVal) {
        this.createTicker(newVal);
      }
    },
    methods: {
      createTicker(pollingTimeout) {
        clearInterval(this.tickerInterval);
        this.tickerInterval = setInterval(this.updateTicker.bind(this), pollingTimeout);
        this.updateTicker();
      },
      updateTicker() {
        if (!this.market) {
          return;
        }
        this.$store.state.exchange.fetchTicker(this.market).catch(handleError(this))
          .then(tick =>
            this.$store.commit('ADD_MARKETDATA', {last: tick.last,
              buy: this.$store.state.running ? this.$store.state.settings.buy : null,
              sell: this.$store.state.running ? this.$store.state.settings.sell : null
            })
          );
      }
    }
  }
</script>
