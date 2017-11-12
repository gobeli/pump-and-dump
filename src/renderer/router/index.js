import Vue from 'vue';
import Router from 'vue-router';
import { getApiKey, getApiSecret } from '../helper';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/app',
      name: 'landing-page',
      component: require('@/components/Main.vue').default,
      beforeEnter: (to, from, next) => {
        if (!getApiKey() || !getApiSecret()) {
          next('/login');
        }
        next();
      },
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/Login.vue').default,
      beforeEnter: (to, from, next) => {
        if (getApiKey() && getApiSecret()) {
          next('/app');
        }
        next();
      },
    },
    {
      path: '*',
      redirect: '/login',
    },
  ],
});
