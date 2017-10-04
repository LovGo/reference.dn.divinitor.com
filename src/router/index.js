import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Text from '@/components/Text';
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
      path: '/text',
      component: Text,
      children: [
        {
          path: 'uistring',
          component: UiStrings,
          children: [
            {
              path: '',
              redirect: 'browse'
            },
            {
              path: 'browse',
              component: UiStringBrowse
            },
            {
              path: 'midlup',
              component: UiStringMidLup
            },
            {
              path: '*',
              name: 'NotFound',
              component: NotFound
            }
          ]
        },
        {
          path: '',
          redirect: 'uistring'
        },
        {
          path: 'server',
          redirect: '/text/uistring'  //  TODO
        },
        {
          path: 'prohibit',
          redirect: '/text/uistring'  //  TODO
        },
        {
          path: '*',
          name: 'NotFound',
          component: NotFound
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
