import Vue from 'vue';
import Store from '@/store';

export default {
    SUPPORTED_REGIONS: ["na", "ko", "eu", "sea"],
    regionCache: {},

    getDefaultRegionCode() {
        return "na";
    },

    normalizeName(shortName) {
        if (!shortName) {
            shortName = Store.state.regionCode || this.getDefaultRegionCode();
        }
        if (shortName == "local") {
            shortName = "na";
        }

        return shortName;
    },

    getRegionByShortName(shortName, okcb, errcb) {
        shortName = this.normalizeName(shortName);

        if (this.regionCache[shortName]) {
            if (okcb) {
                console.error("Use getRegionByShortName as a Promise");
                okcb(this.regionCache[shortName]);
            }

            return Promise.resolve(this.regionCache[shortName]);
        }

        return Vue.http.get(`https://regionservice-dn.arcsat.divinitor.com/regions/shortname/${shortName}`,
        {
        }).then(
        (res) => {
            this.regionCache[shortName] = res.body;
            if (okcb) {
                console.error("Use getRegionByShortName as a Promise");
                okcb(res.body);
            }

            return res.body;
        }, 
        (err) => {
            if (errcb) {
                errcb(err);
            }
            
            return Promise.reject(err);
        });
    },

    getRegions(okcb, errcb) {
        return Vue.http.get(`https://regionservice-dn.arcsat.divinitor.com/regions/`,
        {
        }).then(
        (res) => {
            let d = res.body;
            for (let k in d) {
                let v = d[k];
                this.regionCache[v.shortName] = v;
            }

            if (okcb) {
                console.error("Use getRegionByShortName as a Promise");
                okcb(d);
            }

            return d;
        }, 
        (err) => {
            if (errcb) {
                errcb(err);
            }
            
            return Promise.reject(err);
        });
    },

    getServerStats(shortName, rangeOption) {
        shortName = this.normalizeName(shortName);

        let range = '';
        if (rangeOption) {
            range = `?d=${rangeOption.d}&u=${rangeOption.u}`;
        }

        return Vue.http.get(`https://regionservice-dn.arcsat.divinitor.com/regions/shortname/${shortName}/pop${range}`,
        {
        });
    },

    
    getChannelStats(shortName, mapId, rangeOption) {
        shortName = this.normalizeName(shortName);

        let range = '';
        if (rangeOption) {
            range = `?d=${rangeOption.d}&u=${rangeOption.u}`;
        }

        return Vue.http.get(`https://regionservice-dn.arcsat.divinitor.com/regions/shortname/${shortName}/pop/maps/${mapId}${range}`,
        {
        });
    }
};
