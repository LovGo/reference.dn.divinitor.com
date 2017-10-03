// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import NavigationPane from '@/components/NavigationPane';
import LocaleSelect from '@/components/LocaleSelect';
import store from './store';
import VueResource from 'vue-resource';

Vue.config.productionTip = false;

Vue.use(require("vue-moment"));
Vue.use(VueResource);

Vue.component('navigation-pane', NavigationPane);
Vue.component('locale-select', LocaleSelect);

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

