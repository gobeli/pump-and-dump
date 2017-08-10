<template>
  <div>
    <h2>{{title}}</h2>
    <div class="message" v-for="order in orders">
      <div class="columns">
        <div class="column">
          {{order.orderType}}
        </div>
        <div class="column">
          <h3>{{order.quantity}}</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'orders',
    props: ['title', 'orders']
  }
</script>