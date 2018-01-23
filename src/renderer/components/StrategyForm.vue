<template>
  <el-form label-position="top" label-width="100px" :model="strategyModel">
    <el-form-item label="Volume">
      <el-input-number :step="0.01" style="width: 100%" v-model="strategyModel.volume"></el-input-number>
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
  import { storePrefix } from '../helper';

  export default {
    name: 'pnd-strategy-form',
    props: ['strategyModel'],
    watch: {
      strategyModel: {
        handler(newVal) {
          localStorage.setItem(`${storePrefix}STRATEGY`, JSON.stringify(newVal));
        },
        deep: true
      }
    }
  }
</script>
