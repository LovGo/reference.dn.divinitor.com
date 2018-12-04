import { ensureRegion } from "@/api/RegionProvider";
import { ApiHttpClient } from "@/globals";

export default {

    cache: {},

    getString(mid, { region, param, format, okcb, errcb }) {
        region = ensureRegion(region);
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

        ApiHttpClient.get(`server/${region}/uistring/${mid}`,
            {
                params: {
                    fmt: format,
                    param: param,
                }
            }).then(
            (res) => {
                let cachedRegion = this.cache[region];
                if (!cachedRegion) {
                    cachedRegion = this.cache[region] = {};
                }

                cachedRegion[cacheKey] = res.data;
                okcb(res.data);
            }, 
            errcb);
    },

    getVariant(mid, { region, param, okcb, errcb }) {
        region = ensureRegion(region);
        ApiHttpClient.get(`server/${region}/uistring/${mid}/variant`,
            {
                params: {
                    param: param,
                }
            }).then(
            (res) => {
                okcb(res.data);
            }, 
            errcb);
    },

    getBulk({ page, size, query }, { region, format, okcb, errcb }) {
        region = ensureRegion(region);
        if (query) {
            ApiHttpClient.get(`server/${region}/uistring/search`,
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
    
                okcb(res.data);
            }, 
            errcb);
        } else {
            ApiHttpClient.get(`server/${region}/uistring/`,
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
    
                okcb(res.data);
            }, 
            errcb);
        }

        
    }



};
