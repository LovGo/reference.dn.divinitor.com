import Vue from 'vue';
import Store from '@/store';

export default {
    cache: {},

    getMonster(monsterId, region, okcb, errcb) {
        if (!region) region = Store.state.regionCode;
        let cacheKey = `${monsterId}:${region}`;
        if (this.cache[cacheKey]) {
            okcb(this.cache[cacheKey]);
            return;
        }

        Vue.http.get(`server/${region}/monsters/${monsterId}`,
        {
        }).then(
        (res) => {
            this.cache[cacheKey] = res.body;
            okcb(res.body);
        }, 
        errcb);
    },

    
    getBulk({ page, size, query }, region, okcb, errcb) {

        if (!region) region = Store.state.regionCode;

        let hasQuery = false;
        let hasGrade = false;
        if (query) {
            hasQuery = hasQuery || query.nameSearch;
            hasQuery = hasQuery || query.minLevel > 0;
            hasQuery = hasQuery || query.maxLevel != 100;
        }

        if (hasQuery) {

            let params = {
                p: page,
                sz: size
            };

            if (query.nameSearch) {
                params.name = query.nameSearch;
            }
            if (query.minLevel) {
                params.lmin = query.minLevel;
            }
            if (query.maxLevel != 100) {
                params.lmax = query.maxLevel;
            }

            Vue.http.get(`server/${region}/monsters/search`,
            {
                params: params
            }).then(
            (res) => {
                okcb(res.body);
            }, 
            errcb);
        } else {
            Vue.http.get(`server/${region}/monsters/`,
            {
                params: {
                    p: page,
                    sz: size
                }
            }).then(
            (res) => {
                okcb(res.body);
            }, 
            errcb);
        }   
    },
};
