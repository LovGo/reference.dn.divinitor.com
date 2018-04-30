import Vue from 'vue';
import Store from '@/store';

const Regions = {
    "local": {
        id: "local",
        name: "North America",
        localizedName: "North America",
        version: 674,
        patched: "2018-02-08",
        language: "English (US)",
        levelCap: 95
    },
    "kr": {
        id: "kr",
        name: "Korea",
        localizedName: "대한민국",
        version: 866,
        patched: "2017-09-27",
        language: "Korean",
        levelCap: 95
    }
};

export default {

    regionCache: {},

    getDefaultRegionCode() {
        return "local";
    },

    normalizeName(shortName) {
        if (!shortName) {
            shortName = this.getDefaultRegionCode();
        }
        if (shortName == "local") {
            shortName = "na";
        }

        return shortName;
    },

    getRegionByShortName(shortName, okcb, errcb) {
        shortName = this.normalizeName(shortName);

        if (this.regionCache[shortName]) {
            okcb(this.regionCache[shortName]);
        }

        Vue.http.get(`https://regionservice-dn.arcsat.divinitor.com/regions/shortname/${shortName}`,
        {
        }).then(
        (res) => {
            this.regionCache[shortName] = res.body;
            okcb(res.body);
        }, 
        errcb);
    },

    getRegions(okcb, errcb) {
        Vue.http.get(`https://regionservice-dn.arcsat.divinitor.com/regions/`,
        {
        }).then(
        (res) => {
            let d = res.body;
            for (let k in d) {
                let v = d[k];
                this.regionCache[v.shortName] = v;
            }

            okcb(d);
        }, 
        errcb);
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
    }
};
