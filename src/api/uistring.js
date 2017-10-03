export default {

    cache: {},

    getString(mid, { vue, region, param, format, okcb, errcb }) {
        let cachedRegion = this.cache[region];
        if (cachedRegion) {
            let cachedResult = cachedRegion[mid + param];
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

                cachedRegion[mid + param] = res.body;
                okcb(res.body);
            }, 
            errcb);
    }



};
