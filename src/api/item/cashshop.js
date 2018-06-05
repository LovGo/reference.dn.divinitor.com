import Vue from 'vue';
import Store from '@/store';

export default {

    tabCache: null,
    pendingRequests: {},

    getTabs(region) {
        if (!region) region = Store.state.regionCode;

        if (this.tabCache) {
            return Promise.resolve(this.tabCache);
        }

        if (this.pendingRequests[`tabs-${region}`]) {
            return this.pendingRequests[`tabs-${region}`];
        }

        let ret = Vue.http.get(`server/${region}/items/cashshop/tabs`,
        {
        });

        return ret.then((v) => 
        {
            delete this.pendingRequests[`tabs-${region}`];
            this.tabCache = v;
            return v;
        }, (err) => {
            delete this.pendingRequests[`tabs-${region}`];
            return Promise.reject(err);
        })
    }
};
