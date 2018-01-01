import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '@/components/Welcome';
import Home from '@/components/Home';
import Passthrough from '@/components/Passthrough';

import General from '@/components/general/General';
import GeneralIndex from '@/components/general/GeneralIndex';
import GenTaxes from '@/components/general/GenTaxes';
import GenStat from '@/components/general/stat/GenStat';
import GenDamage from '@/components/general/damage/GenDamage';
import GenGuild from '@/components/general/guild/GenGuild';

import Items from '@/components/items/Items';
import Item from '@/components/items/Item';
import ItemSearch from '@/components/items/ItemSearch';
import ItemHome from '@/components/items/ItemHome';
import ItemCashShop from '@/components/items/ItemCashShop';
import ItemNpcShops from '@/components/items/ItemNpcShops';
import ItemCrafting from '@/components/items/ItemCrafting';

import Text from '@/components/Text';
import UiStrings from '@/components/uistrings/UiStrings';
import UiStringBrowse from '@/components/uistrings/UiStringBrowse';
import UiStringMidLup from '@/components/uistrings/UiStringMidLup';

import NotFound from '@/components/NotFound';

import Auth from '@/components/auth/Auth';
import AuthCallback from '@/components/auth/AuthCallback';

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
      path: '/auth',
      name: 'Auth',
      component: Auth
    },
    {
      path: '/auth/discordcb',
      name: 'DiscordAuthCb',
      component: AuthCallback
    },
    {
      path: '/general',
      component: General,
      children: [
        {
          path: '',
          component: GeneralIndex,
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
          path: 'taxes',
          component: GenTaxes,
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
      meta: {
        auth: true
      },
      children: [
        {
          path: '',
          name: 'item-home',
          component: ItemHome
        },
        {
          path: 'search',
          name: 'item-search',
          component: ItemSearch
        },
        {
          path: ':itemId',
          name: 'item-view',
          component: Item
        },
        {
          path: 'cash',
          name: 'item-cash-shop',
          component: ItemCashShop
        },
        {
          path: 'npcshop',
          name: 'item-npc-shop',
          component: ItemNpcShops
        },
        {
          path: 'crafting',
          name: 'item-crafting',
          component: ItemCrafting
        }
      ]
    },
    {
      path: '/text',
      component: Text,
      meta: {
        auth: true
      },
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
