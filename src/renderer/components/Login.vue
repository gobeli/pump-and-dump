<template>
  <el-form>
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
  import { setApiKey, setApiSecret } from '../helper';

  export default {
    data: () => ({
      apiModel: {
        key: '',
        secret: '',
      },
    }),

    methods: {
      submit() {
        setApiKey(this.apiModel.key);
        setApiSecret(this.apiModel.secret);
        this.$router.go('/app');
      },
    }
  }
</script>
