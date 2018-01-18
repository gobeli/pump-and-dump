import ccxt from 'ccxt';
import ElementUI from 'element-ui';
import Vue from 'vue';
import axios from 'axios';
import VueCharts from 'vue-charts';

import Store from './store';
import App from './App';
import router from './router';

import StrategyForm from './components/StrategyForm.vue';
import Orders from './components/Orders.vue';
import ExecuteModal from './components/ExecuteModal.vue';
import Chart from './components/Chart.vue';

import 'element-ui/lib/theme-chalk/index.css';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.prototype.$bus = new Vue();

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueCharts);

Vue.component('pnd-strategy-form', StrategyForm);
Vue.component('pnd-orders', Orders);
Vue.component('pnd-execute-modal', ExecuteModal);
Vue.component('pnd-chart', Chart);

Vue.prototype.$ccxt = ccxt;

/* eslint-disable no-new */
new Vue({
  components: { App },
  store: Store,
  router,
  template: '<App/>',
}).$mount('#app');
