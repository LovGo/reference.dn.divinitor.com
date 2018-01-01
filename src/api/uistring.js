
import Vue from 'vue';
import Store from '@/store';

export default {

    cache: {},

    getString(mid, { region, param, format, okcb, errcb }) {
        if (!region) region = Store.state.regionCode;
        if (!param) param = '';
        let cacheKey = `${mid}:${btoa(param)}//${format}`;
        let cachedRegion = this.cache[region];
        if (cachedRegion) {
            let cachedResult = cachedRegion[cacheKey];
            if (cachedResult) {
                okcb(cachedResult);
                return;
            }
        }

        Vue.http.get(`/api/server/${region}/uistring/${mid}`,
            {
                params: {
                    fmt: format,
                    param: param
                }
            }).then(
            (res) => {
                let cachedRegion = this.cache[region];
                if (!cachedRegion) {
                    cachedRegion = this.cache[region] = {};
                }

                cachedRegion[cacheKey] = res.body;
                okcb(res.body);
            }, 
            errcb);
    },

    getVariant(mid, { region, param, okcb, errcb }) {
        if (!region) region = Store.state.regionCode;
        Vue.http.get(`/api/server/${region}/uistring/${mid}/variant`,
            {
                params: {
                    param: param
                }
            }).then(
            (res) => {
                okcb(res.body);
            }, 
            errcb);
    },

    getBulk({ page, size, query }, { region, format, okcb, errcb }) {
        if (!region) region = Store.state.regionCode;
        if (query) {
            Vue.http.get(`/api/server/${region}/uistring/search`,
            {
                params: {
                    fmt: format,
                    p: page,
                    sz: size,
                    q: query
                }
            }).then(
            (res) => {
                let cachedRegion = this.cache[region];
                if (!cachedRegion) {
                    cachedRegion = this.cache[region] = {};
                }
    
                okcb(res.body);
            }, 
            errcb);
        } else {
            Vue.http.get(`/api/server/${region}/uistring/`,
            {
                params: {
                    fmt: format,
                    p: page,
                    sz: size
                }
            }).then(
            (res) => {
                let cachedRegion = this.cache[region];
                if (!cachedRegion) {
                    cachedRegion = this.cache[region] = {};
                }
    
                okcb(res.body);
            }, 
            errcb);
        }

        
    }



};
