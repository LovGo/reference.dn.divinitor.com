import Vue from "vue";
import EmbedShop from './EmbedShop.vue';
import store from "@/store";
import { Actions } from '@/storemutations';
import * as Globals from "@/globals";
import * as Constants from "@/constants";
import * as Filters from "@/filters/Filters";
import * as Features from "@/api/FeaturesProvider";
import defaultRouter from './defaultRouter';
import { Route } from 'vue-router';

interface IData {
}

Vue.use(Filters);
Vue.use(Features);

new Vue({
    store,
    router: defaultRouter,
    render: h => h(EmbedShop),
    data(): IData {
        return {
        };
    },
    created() {
        this.$store.dispatch(Actions.Init);

        Features.init();

        this.configureApiRoute(this.$route);
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
                if (apiRouteName === 'local') {
                    apiRouteName = 'http://localhost:8081/api';
                    this.$store.dispatch(Actions.SetRegion, 'local');
                }

                if (!apiRouteName.startsWith("/") && !apiRouteName.startsWith("http")) {
                    apiRouteName = "/" + apiRouteName;
                }

                Globals.ApiHttpClient.defaults.baseURL = apiRouteName;

                if (apiRouteName !== Constants.DefaultApiPath) {
                    window.localStorage.setItem(Constants.ApiPathKey, apiRouteName);
                } else {
                    window.localStorage.removeItem(Constants.ApiPathKey);
                }
            } else {
                Globals.ApiHttpClient.defaults.baseURL = Constants.DefaultApiPath;
            }
        },
    }
}).$mount('#app');
