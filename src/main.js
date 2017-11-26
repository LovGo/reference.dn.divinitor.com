// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import StatLineChart from '@/components/general/stat/StatLineChart';
import StatEqualLineChart from '@/components/general/stat/StatEqualLineChart';
import BigErrorBox from '@/components/util/BigErrorBox';
import SmallErrorBox from '@/components/util/SmallErrorBox';
import store from './store';
import VueResource from 'vue-resource';
import infiniteScroll from 'vue-infinite-scroll';
import filters from './filters';
import Chart from 'chart.js';
import VueAnalytics from 'vue-analytics'

Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 14;
Chart.defaults.global.defaultFontColor = "#A6AEB3";

Vue.config.productionTip = false;

Vue.use(require("vue-moment"));
Vue.use(VueResource);
Vue.use(infiniteScroll);
Vue.use(filters);
Vue.use(VueAnalytics, {
  id: 'UA-83957964-4',
  router,
  autoTracking: {
    exception: true
  }
});

Vue.component('stat-line-chart', StatLineChart);
Vue.component('stat-equal-line-chart', StatEqualLineChart);
Vue.component('big-error-box', BigErrorBox);
Vue.component('small-error-box', SmallErrorBox);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created() {
    this.$store.dispatch('init');

    //  Redirect on direct link if auth required
    if (this.$route.matched.some((route) => route.meta.auth)) {
      let isAuth = this.$store.getters.isAuthed;
      if (!isAuth) {
        this.$router.push('/auth');
      }
    }

    //  Navigation guards
    this.$router.beforeResolve((to, from, next) => {
      let isAuth = this.$store.getters.isAuthed;
      let needAuth = to.matched.some((route) => route.meta.auth);

      if (needAuth && !isAuth) {
        next('/auth');
        return;
      }

      next();
    })
  }
});

