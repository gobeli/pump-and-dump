<template>
  <el-form>
    <el-form-item label="Exchange">
      <el-select style="width: 100%" v-model="apiModel.exchange" placeholder="Exchange" filterable>
        <el-option
          v-for="e in $ccxt.exchanges"
          :key="e"
          :label="e"
          :value="e">
        </el-option>
      </el-select>
    </el-form-item> 
    <el-form-item label="API Key">
      <el-input style="width: 100%" v-model="apiModel.key"></el-input>
    </el-form-item>
    <el-form-item label="API Secret">
      <el-input style="width: 100%" v-model="apiModel.secret"></el-input>
    </el-form-item>
    <el-button @click="submit">Submit</el-button>
  </el-form>
</template>
<script>
  import { setApiKey, setApiSecret, setExchange } from '../helper';

  export default {
    data: () => ({
      apiModel: {
        key: '',
        secret: '',
        exchange: ''
      }
    }),

    methods: {
      submit() {
        setApiKey(this.apiModel.key);
        setApiSecret(this.apiModel.secret);
        setExchange(this.apiModel.exchange);
        this.$router.go('/app');
      },
    }
  }
</script>
