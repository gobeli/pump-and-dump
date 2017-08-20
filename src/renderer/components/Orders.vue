<template>
  <div>
    <div class="messages">
      <el-row v-for="order in orders" class="message" :gutter="10" :key="order.OrderUuid">
        <el-col :span="12">
          {{order.OrderType.split('_')[1]}}
        </el-col>
        <el-col :span="12">
          <b>{{order.Quantity}}</b>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'orders',
    props: ['title', 'orders']
  }
</script>
<style lang="scss" scoped="false">
  .message {
    padding: 1rem;
    background-color: #f5f5f5;
    margin-bottom: .5rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
