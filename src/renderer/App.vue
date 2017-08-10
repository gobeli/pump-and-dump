<template>
  <div id="app">
    <div v-for="message in messages" class="notification is-danger" style="margin-bottom: 0">
      <button @click="deleteMessage(message)" class="delete"></button>
      {{message.text}}
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'pump-and-dump',
    data: () => ({
      messages: []
    }),
    created() {
      this.$bus.$on('error', err => {
        const message = { text: err.message || 'Unhandled error occured', uid: new Date().getTime() };
        this.messages.push(message);
      });
    },
    methods: {
      deleteMessage(message) {
        this.messages = this.messages.filter(m => m.uid !== message.uid);
      }
    }
  };
</script>

<style>
  /* CSS */
</style>
