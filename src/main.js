import Vue from 'vue';
import App from './App.vue';
// import vueg from 'vueg';
import wx from 'weixin-js-sdk';
import dayjs from 'dayjs';
import numeral from 'numeral';
import VueClipboard from 'vue-clipboard2';
import { sync } from 'vuex-router-sync';

import 'babel-polyfill';

import router from '@/router';
import store from '@/store';

import '@/config/global';
import UiInstall from '@/config/ui-install';
import YchCompoents from '@/components';
import YchFilters from '@/filters';

sync(store, router);

Vue.prototype.$_date = dayjs;
Vue.prototype.$_number = numeral;
window.$_wx = Vue.prototype.$_wx = wx;

window.$router = router;

Vue.config.productionTip = false;

// Vue.use(vueg, router, options);
Vue.use(UiInstall);
Vue.use(YchCompoents);
Vue.use(YchFilters);
Vue.use(VueClipboard);

if (process.env.NODE_ENV === 'development') {
  let VConsole = require('vconsole/dist/vconsole.min.js');
  let vConsole = new VConsole(); // eslint-disable-line
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
