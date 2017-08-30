import bittrex from 'node.bittrex.api';
import ElementUI from 'element-ui';
import Vue from 'vue';
import axios from 'axios';
import VueCharts from 'vue-charts';
import 'element-ui/lib/theme-default/index.css';

import App from './App';
import router from './router';

import StrategyTable from './components/StrategyTable.vue';
import StrategyForm from './components/StrategyForm.vue';
import Orders from './components/Orders.vue';
import ExecuteModal from './components/ExecuteModal.vue';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.prototype.$bus = new Vue();

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueCharts);

Vue.component('strategy-table', StrategyTable);
Vue.component('strategy-form', StrategyForm);
Vue.component('orders', Orders);
Vue.component('execute-modal', ExecuteModal);

Vue.prototype.$bittrex = bittrex;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>',
}).$mount('#app');
