<template>
  <table>
    <thead>
      <tr>
        <th>Volume</th>
        <th>Buy at</th>
        <th>Sell at</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="strategy in strategies">
        <td>{{strategy.volume}} BTC</td>
        <td>{{strategy.buyAt}}%</td>
        <td>{{strategy.sellAt}}%</td>
        <td>
          <button class="button is-info" @click="$emit('use-strategy', strategy)">Use</button>
          <button class="button is-danger" @click="$emit('delete-strategy', strategy)">Delete</button>
        </td>
      </tr>  
    </tbody>
  </table>
</template>
<script>
  export default {
    name: 'strategy-table',
    props: ['strategies'],
  }
</script>