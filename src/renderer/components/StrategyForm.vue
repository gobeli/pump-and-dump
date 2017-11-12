<template>
  <el-form label-position="top" label-width="100px" :model="strategyModel">
    <el-form-item label="Volume BTC">
      <el-input-number style="width: 100%" v-model="strategyModel.volume"></el-input-number>
    </el-form-item>
    <el-form-item label="Buy at %">
      <el-input-number style="width: 100%" v-model="strategyModel.buyAt"></el-input-number>
    </el-form-item>
    <el-form-item label="Sell at %">
      <el-input-number style="width: 100%" v-model="strategyModel.sellAt"></el-input-number>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    name: 'strategy-form',
    props: ['strategyModel'],
    watch: {
      strategyModel: {
        handler(newVal) {
          this.$emit('strategy-changed', newVal)
        },
        deep: true
      }
    }
  }
</script>