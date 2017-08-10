<template>
  <form>
    <div class="field">
      <label for="volume">Volume BTC</label>   
      <div class="control">
        <input class="input" type="number" name="volume" v-model="strategyModel.volume"><br>
      </div>
    </div>
    <div class="field">
      <label for="buyAt">Buy at %</label>   
      <div class="control">
        <input class="input" type="number" name="buyAt" v-model="strategyModel.buyAt"><br>
      </div>
    </div>
    <div class="field">
      <label for="sellAt">Sell at %</label>   
      <div class="control">
        <input class="input" type="number" name="sellAt" v-model="strategyModel.sellAt"><br>
      </div>
    </div>
    <button class="button is-info" @click="$emit('submit-strategy', strategyModel)">Submit</button>
  </form>
</template>
<script>
  export default {
    name: 'strategy-form',
    props: ['strategyModel']
  }
</script>