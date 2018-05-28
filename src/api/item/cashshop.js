import Vue from 'vue';
import Store from '@/store';

export default {

    tabCache: null,

    getTabs(region) {
        if (!region) region = Store.state.regionCode;

        if (this.tabCache) {
            return Promise.resolve(this.tabCache);
        }

        return Vue.http.get(`server/${region}/items/cashshop/tabs`,
        {
        });
    }
};
