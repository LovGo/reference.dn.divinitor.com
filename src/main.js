// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import BigErrorBox from '@/components/util/BigErrorBox';
import SmallErrorBox from '@/components/util/SmallErrorBox';
import store from './store';
import VueResource from 'vue-resource';
import infiniteScroll from 'vue-infinite-scroll';
import filters from './filters';
import VueAnalytics from 'vue-analytics'

import Chart from 'chart.js';
Chart.defaults.global.defaultFontFamily = `Lato, "Segoe UI", Tahoma, Verdana, sans-serif`;
Chart.defaults.global.defaultFontSize = 14;
Chart.defaults.global.defaultFontColor = "#A6AEB3";

import StatLineChart from '@/components/general/stat/StatLineChart';
import StatEqualLineChart from '@/components/general/stat/StatEqualLineChart';
import ItemEnhanceRateChart from "@/components/items/ItemEnhanceRateChart";
import ItemEnhanceMaterialChart from "@/components/items/ItemEnhanceMaterialChart";

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
Vue.component('item-enhance-rate-line-chart', ItemEnhanceRateChart);
Vue.component('item-enhance-material-line-chart', ItemEnhanceMaterialChart);
Vue.component('big-error-box', BigErrorBox);
Vue.component('small-error-box', SmallErrorBox);

import Loader from "@/components/util/Loader";
Vue.component("load-indicator", Loader);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created() {
    this.$store.dispatch('init');

    let storedApiName = window.localStorage.getItem("api");
    if ("api" in this.$route.query || storedApiName) {
      let apiName = ((this.$route.query.api || storedApiName) || "api");
      if (!apiName.startsWith("/")) {
        apiName = "/" + apiName;
      }
      Vue.http.options.root = apiName;
      if (apiName !== "api") {
        window.localStorage.setItem("api", apiName);
      } else {
        window.localStorage.removeItem("api");
      }

      console.log("Using API '" + apiName + "'");
    } else {
      Vue.http.options.root = "/api";
    }

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

      let forceAuth = !!to.query.forceAuth;
      if (forceAuth) {
        console.log("Overriding auth check");
      }

      if (needAuth && !isAuth && !forceAuth) {
        next('/auth');
        return;
      }

      next();
    });
  }
});

