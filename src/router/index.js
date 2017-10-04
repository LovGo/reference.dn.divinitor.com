import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import UiStrings from '@/components/UiStrings';
import UiStringBrowse from '@/components/UiStringBrowse';
import UiStringMidLup from '@/components/UiStringMidLup';

import NotFound from '@/components/NotFound';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },


    {
      path: '/uistring',
      component: UiStrings,
      children: [
        {
          path: '',
          component: UiStringBrowse
        },
        {
          path: 'browse',
          component: UiStringBrowse
        },
        {
          path: 'midlup',
          component: UiStringMidLup
        }
      ]
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
});
