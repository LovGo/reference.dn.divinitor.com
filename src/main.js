// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import NavigationPane from '@/components/NavigationPane';
import UiStringMidResult from '@/components/UiStringMidResult';
import GenStatSmall from '@/components/GenStatSmall';
import LocaleSelect from '@/components/LocaleSelect';
import store from './store';
import VueResource from 'vue-resource';
import infiniteScroll from 'vue-infinite-scroll';
import filters from './filters';

Vue.config.productionTip = false;

Vue.use(require("vue-moment"));
Vue.use(VueResource);
Vue.use(infiniteScroll);
Vue.use(filters);

Vue.component('navigation-pane', NavigationPane);
Vue.component('uistring-midresult', UiStringMidResult);
Vue.component('locale-select', LocaleSelect);
Vue.component('gen-stat-small', GenStatSmall);

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

