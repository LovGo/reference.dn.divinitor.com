import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { Route } from 'vue-router';
import store from "./store";
import * as Features from "./api/FeaturesProvider";
import * as Filters from "./filters/Filters";
import { Actions, MutationTypes } from "./storemutations";
import VueAnime from "vue-animejs";
import * as Globals from "./globals";
import * as Constants from "./constants";
//@ts-ignore
import VueMoment from "vue-moment";

import Axios, { AxiosRequestConfig } from "axios";

Vue.config.productionTip = false

//@ts-ignore
Vue.use(VueAnime);
Vue.use(Filters);
Vue.use(Features);
Vue.use(VueMoment);

interface IData {
}

new Vue({
    router,
    store,
    render: h => h(App),
    data(): IData {
        return {
        };
    },
    created() {
        this.$store.dispatch(Actions.Init);

        Features.init();

        this.configureApiRoute(this.$route);
        this.redirectDirectLinkIfUnauthenticatedNotEmbedded();
        this.configureRouterNavigation();
        this.applyAuthFilter();
        this.applyRegionOverride();
    },
    methods: {
        /**
         * Configures the API route to use if the query param or localstorage value is present
         */
        configureApiRoute(route: Route) {
            const storedApiRoute = <string>window.localStorage.getItem(Constants.ApiPathKey);
            if (storedApiRoute || route.query[Constants.ApiPathKey]) {
                let apiRouteName = ((route.query[Constants.ApiPathKey] || storedApiRoute) ||
                    Constants.DefaultApiPath);
                if (!apiRouteName.startsWith("/")) {
                    apiRouteName = "/" + apiRouteName;
                }

                Globals.ApiHttpClient.defaults.baseURL = apiRouteName;
                // console.log(`Using ${Globals.ApiHttpClient.defaults.baseURL}`);

                if (apiRouteName !== Constants.DefaultApiPath) {
                    window.localStorage.setItem(Constants.ApiPathKey, apiRouteName);
                } else {
                    window.localStorage.removeItem(Constants.ApiPathKey);
                }
            } else {
                Globals.ApiHttpClient.defaults.baseURL = Constants.DefaultApiPath;
                // console.log(`Using ${Globals.ApiHttpClient.defaults.baseURL}`);
            }
        },
        /**
         * Whether or not this instance is running embedded (e.g. in the blog)
         */
        isEmbedded(route?: Route): boolean {
            if (route) {
                return !!route.query.embed;
            }

            return !!this.$route.query.embed;
        },
        /**
         * Whether or not the current session is authenticated
         */
        isAuthenticated(): boolean {
            if (window.location.hostname === "localhost") {
                return true;
            }

            return this.$store.getters.authenticated;
        },
        /**
         * Redirects to auth page if accessing a route that requires auth when accessing a route directly
         */
        redirectDirectLinkIfUnauthenticatedNotEmbedded() {
            if (!this.isEmbedded() && this.$route.matched.some((r) => r.meta.auth) && !this.$fOn(this.$f.RequireLogin)) {
                if (!this.isAuthenticated()) {
                    this.$router.push({
                        name: "auth",
                        query: {
                            path: this.$route.fullPath,
                        },
                    });
                }
            }
        },
        /**
         * Overrides the region if a region query parameter is present
         */
        applyRegionOverride(route?: Route, routerAction?: Function) {
            const r = route || this.$route;

            if (Constants.RegionOverrideKey in r.query) {
                const region = r.query[Constants.RegionOverrideKey];
                this.$store.dispatch(Actions.SetRegionSoft, region);

                // Delete the region param so we don't infinitely loop
                let replacementQuery = {};
                Object.assign(replacementQuery, r.query);
                //@ts-ignore
                delete replacementQuery[Constants.RegionOverrideKey];
                if (routerAction) {
                    routerAction(replacementQuery);
                } else {
                    this.$router.replace({
                        path: this.$route.path,
                        query: replacementQuery,
                        params: this.$route.params,
                    });
                }
            }
        },
        /**
         * Configures router navigation guards
         */
        configureRouterNavigation() {
            this.$router.beforeResolve((to, from, next) => this.beforeResolve(to, from, next));
            this.$router.beforeEach((to, from, next) => this.beforeEach(to, from, next));
            this.$router.afterEach((to, from) => this.afterEach(to, from));
        },

        applyAuthFilter() {
            Globals.ApiHttpClient.interceptors.request.use((config: AxiosRequestConfig) => {
                const ret: AxiosRequestConfig = Object.assign({}, config);
                if (this.isAuthenticated()) {
                    ret.headers.Authorization = this.$store.getters.authToken;
                }

                return ret;
            });
        },

        beforeResolve(to: Route, from: Route, next: any): any {
            const isAuthed = this.isAuthenticated();
            const requiresAuth = to.matched.some((r) => r.meta.auth);
            const isEmbedded = this.isEmbedded(to) || this.isEmbedded(from);
            if (isEmbedded && from.fullPath != "/") {
                // Handle item IDs
                const toId = to.params[Constants.QueryParameterNames.ItemId];
                const fromId = from.params[Constants.QueryParameterNames.ItemId];
                let shouldOpenInNewTab = true;
                if (toId != null && fromId != null) {
                    const splitTo = toId.split("-", 2);
                    const splitFrom = fromId.split("-", 2);
                    if (splitTo[0] === splitFrom[0]) {
                        shouldOpenInNewTab = false;
                    }
                }

                if (shouldOpenInNewTab) {
                    window.open(window.location.origin + "/" + to.fullPath, "_blank");
                    next(false);
                    return;
                }
            }

            if (requiresAuth && !isAuthed && !isEmbedded && !this.$fOn(this.$f.RequireLogin)) {
                next({
                    name: "auth",
                    query: {
                        path: to.fullPath,
                    },
                });
                return;
            }

            const toName = to.name ? to.name : "unknown";
            const fromName = from.name ? from.name : "unknown";
            if (toName != fromName) {
                window.appInsights.trackPageView(toName);
            }

            let shouldReturn = false;
            this.applyRegionOverride(to, (replacementQuery: any) => {
                next({
                    path: to.path,
                    query: replacementQuery,
                    params: to.params,
                });
                shouldReturn = true;
            });

            if (shouldReturn) {
                return;
            }

            this.configureApiRoute(to);

            // TODO anything else
            
            next();
        },

        beforeEach(to: Route, from: Route, next: any) {
            this.$store.dispatch(Actions.StartPageLoad);
            next();
        },

        afterEach(to: Route, from: Route) {
            this.$store.dispatch(Actions.FinishPageLoad);
        }
    }
}).$mount("#app")
