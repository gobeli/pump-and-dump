<template>
  <div>
    <div class="messages">
      <el-row class="message" :gutter="10">
        <el-col :span="6"><b>Type</b></el-col>
        <el-col :span="6"><b>Amount</b></el-col>
        <el-col :span="6"><b>Rate</b></el-col>
        <el-col :span="6"><b>Status</b></el-col>
      </el-row>
      <el-row v-for="order in orders.slice(0,5)" class="message" :gutter="10" :key="order.id">
        <el-col :span="6">
          {{order.side}}
        </el-col>
        <el-col :span="6">
          {{order.amount}}
        </el-col>
        <el-col :span="6">
          {{order.price}}
        </el-col>
        <el-col :span="6">
          {{order.status}}
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'pnd-orders',
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
