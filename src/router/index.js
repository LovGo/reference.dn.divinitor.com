import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '@/components/Welcome';
import Home from '@/components/Home';
import Passthrough from '@/components/Passthrough';

import General from '@/components/general/General';
import GenStat from '@/components/general/stat/GenStat';
import GenDamage from '@/components/general/damage/GenDamage';
import GenGuild from '@/components/general/guild/GenGuild';

import Items from '@/components/items/Items';
import Item from '@/components/items/Item';

import Text from '@/components/Text';
import UiStrings from '@/components/uistrings/UiStrings';
import UiStringBrowse from '@/components/uistrings/UiStringBrowse';
import UiStringMidLup from '@/components/uistrings/UiStringMidLup';

import NotFound from '@/components/NotFound';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   component: Passthrough,
    //   children: [
    //     {
    //       path: '',
    //       component: Welcome
    //     },
    //     {
    //       path: '/:region',
    //       component: Home,
    //     }
    //   ]
    // },
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/general',
      component: General,
      children: [
        {
          path: '',
          redirect: 'stat'
        },
        {
          path: 'stat/:statName?',
          component: GenStat,
        },
        {
          path: 'damage',
          component: GenDamage,
        },
        {
          path: 'guild',
          component: GenGuild,
        },
        {
          path: '*',
          component: NotFound
        }
      ]
    },
    {
      path: '/items',
      component: Items,
      children: [
        {
          path: ':itemId',
          name: 'item-view',
          component: Item
        }
      ]
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
          component: NotFound
        }
      ]
    },
    {
      path: '*',
      component: NotFound
    }
  ]
});
