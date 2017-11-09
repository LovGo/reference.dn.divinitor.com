// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import StatLineChart from '@/components/general/stat/StatLineChart';
import StatEqualLineChart from '@/components/general/stat/StatEqualLineChart';
import store from './store';
import VueResource from 'vue-resource';
import infiniteScroll from 'vue-infinite-scroll';
import filters from './filters';
import Chart from 'chart.js';

Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 14;
Chart.defaults.global.defaultFontColor = "#A6AEB3";

Vue.config.productionTip = false;

Vue.use(require("vue-moment"));
Vue.use(VueResource);
Vue.use(infiniteScroll);
Vue.use(filters);

Vue.component('stat-line-chart', StatLineChart);
Vue.component('stat-equal-line-chart', StatEqualLineChart);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created() {
    this.$store.dispatch('init');
  }
});

