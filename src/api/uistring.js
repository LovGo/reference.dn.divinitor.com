export default {

    cache: {},

    getString(mid, { vue, region, param, format, okcb, errcb }) {
        let cacheKey = `${mid}:${btoa(param)}//${format}`;
        let cachedRegion = this.cache[region];
        if (cachedRegion) {
            let cachedResult = cachedRegion[cacheKey];
            if (cachedResult) {
                okcb(cachedResult);
                return;
            }
        }

        vue.$http.get(`/api/server/${region}/uistring/${mid}`,
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

    getVariant(mid, { vue, region, param, okcb, errcb }) {
        vue.$http.get(`/api/server/${region}/uistring/${mid}/variant`,
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

    getBulk({ page, size, query }, { vue, region, format, okcb, errcb }) {
        if (query) {
            vue.$http.get(`/api/server/${region}/uistring/search`,
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
            vue.$http.get(`/api/server/${region}/uistring/`,
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
