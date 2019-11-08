import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import Blank from "@/views/Blank.vue";

const Auth = () => import(/* webpackChunkName: "auth" */ "@/views/Auth.vue");
const DiscordAuth = () => import(/* webpackChunkName: "auth" */ "@/components/auth/DiscordAuth.vue");
const StandaloneAuth = () => import(/* webpackChunkName: "auth" */ "@/components/auth/StandaloneAuth.vue");

import General from "@/views/General.vue";
import StatCalc from "@/components/general/StatCalc.vue";

const Jobs = () => import(/* webpackChunkName: "jobs" */ "@/views/Jobs.vue");
const JobView = () => import(/* webpackChunkName: "jobs" */ "@/components/job/JobView.vue");

//const Items = () => import(/* webpackChunkName: "items" */ "@/views/Items.vue");
const Items = () => import(/* webpackChunkName: "old-items" */ "@/old/items/Items.vue");
const Item = () => import(/* webpackChunkName: "old-items" */ "@/old/items/Item.vue");
const ItemSearch = () => import(/* webpackChunkName: "old-items" */ "@/old/items/ItemSearch.vue");
const ItemHome = () => import(/* webpackChunkName: "old-items" */ "@/old/items/ItemHome.vue");
const ItemToolkit = () => import(/* webpackChunkName: "old-items" */ "@/old/items/ItemToolkit.vue");
const ItemToolkitIndex = () => import(/* webpackChunkName: "old-items" */ "@/old/items/ItemToolkitIndex.vue");
const ItemDrop = () => import(/* webpackChunkName: "old-items" */ "@/old/items/ItemDrop.vue");
const ItemDropGroup = () => import(/* webpackChunkName: "old-items" */ "@/old/items/ItemDropGroup.vue");
const ItemShopToolkit = () => import(/* webpackChunkName: "items" */ "@/components/item/shop/ShopToolKit.vue");

const Maps = () => import(/* webpackChunkName: "maps" */ "@/views/Maps.vue");
const MapViewMock = () => import(/* webpackChunkName: "maps" */ "@/components/map/MapViewMock.vue");

const Monsters = () => import(/* webpackChunkName: "monsters" */ "@/views/Monsters.vue");

const Skills = () => import(/* webpackChunkName: "skills" */ "@/views/Skills.vue");
const SkillView = () => import(/* webpackChunkName: "skills" */ "@/components/skill/SkillView.vue");

// const Text = () => import(/* webpackChunkName: "text" */ "@/views/Text.vue");
const UiStrings = () => import(/* webpackChunkName: "text" */ "@/old/uistrings/UiStrings.vue");
const UiStringBrowse = () => import(/* webpackChunkName: "text" */ "@/old/uistrings/UiStringBrowse.vue");
const UiStringMidLup = () => import(/* webpackChunkName: "text" */ "@/old/uistrings/UiStringMidLup.vue");

const Resources = () => import(/* webpackChunkName: "resources" */ "@/views/Resources.vue");
const ResourcesHome = () => import(/* webpackChunkName: "resources" */ "@/old/resources/ResourcesHome.vue");
const GameClient = () => import(/* webpackChunkName: "resources" */ "@/old/resources/gameclient/GameClient.vue");

import NotFound from "@/views/NotFound.vue";

Vue.use(Router)

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: Home,
        },
        {
            path: "/auth",
            component: Auth,
            children: [
                {
                    path: "discord",
                    component: DiscordAuth,
                    meta: {
                        redemption: true,
                    },
                },
                {
                    path: "redirect",
                    component: StandaloneAuth,
                    name: "auth",
                    meta: {
                        redemption: true,
                    },
                }
            ],
        },
        {
            path: "/general",
            component: Blank,
            children: [
                {
                    path: "",
                    component: General,
                },
                {
                    // path: "stat/:statName?",
                    path: "stat",
                    component: StatCalc,
                },
            ],
        },
        {
            path: "/jobs",
            component: Blank,
            meta: {
                auth: true,
            },
            children: [
                {
                    path: "",
                    name: "jobs",
                    component: Jobs,
                },
                {
                    path: ":jobId",
                    name: "job-view",
                    component: JobView,
                    props: true,
                }
            ],
        },
        {
            path: "/items",
            component: Items,
            meta: {
                auth: true,
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
                path: 'toolkit',
                component: ItemToolkit,
                children: [
                  {
                    path: 'index',
                    name: 'item-toolkit',
                    component: ItemToolkitIndex
                  },
                  {
                    path: 'dropgroup/:id?',
                    name: 'item-drop-group',
                    component: ItemDropGroup
                  },
                  {
                    path: 'drop/:id?',
                    name: 'item-drop',
                    component: ItemDrop
                  },
                  {
                    path: 'itemshop/:id?',
                    name: 'item-shop',
                    component: ItemShopToolkit,
                  }
                ]
              }
            ]
        },
        {
            path: "/maps",
            component: Blank,
            children: [
                {
                    path: "",
                    name: "maps",
                    component: Maps,
                },
                {
                    path: ":id",
                    name: "map-view",
                    props: true,
                    component: MapViewMock,
                }
            ],
        },
        {
            path: "/monsters",
            component: Blank,
            children: [
                {
                    path: "",
                    name: "monsters",
                    component: Monsters,
                },
            ],
        },
        {
            path: "/skills",
            component: Blank,
            meta: {
                auth: true,
            },
            children: [
                {
                    path: "",
                    name: "skills",
                    component: Skills,
                },
                {
                    path: ":skillSlug",
                    name: "skill-view",
                    props: true,
                    component: SkillView,
                },
            ],
        },
        {
            path: "/text",
            component: Blank,
            meta: {
                auth: true,
            },
            children: [
                {
                    path: '',
                    redirect: 'uistring',
                },
                {
                    path: "uistring",
                    component: UiStrings,
                    children: [
                      {
                        path: '',
                        redirect: 'browse'
                      },
                      {
                        path: 'browse',
                        component: UiStringBrowse,
                        name: 'uistring-browse',
                      },
                      {
                        path: 'midlup',
                        name: 'uistring-midlup',
                        component: UiStringMidLup
                      },
                      {
                        path: '*',
                        component: NotFound
                      }
                    ]
                },
            ],
        },
        {
            path: "/resources",
            component: Blank,
            children: [
                {
                    path: "",
                    name: "resources",
                    component: ResourcesHome,
                },
                {
                  path: 'downloadgame',
                  name: 'resources-game-client',
                  component: GameClient
                }
            ],
        },
        {
            path: "*",
            component: NotFound,
        },
    ]
})
