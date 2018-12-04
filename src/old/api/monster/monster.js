import Vue from 'vue';
import { ensureRegion } from "@/api/RegionProvider";
import { ApiHttpClient } from "@/globals";

export default {
    cache: {},

    getMonster(monsterId, region, okcb, errcb) {
        region = ensureRegion(region);
        let cacheKey = `${monsterId}:${region}`;
        if (this.cache[cacheKey]) {
            okcb(this.cache[cacheKey]);
            return;
        }

        ApiHttpClient.get(`server/${region}/monsters/${monsterId}`,
        {
        }).then(
        (res) => {
            this.cache[cacheKey] = res.data;
            okcb(res.data);
        }, 
        errcb);
    },

    
    getBulk({ page, size, query }, region, okcb, errcb) {

        region = ensureRegion(region);

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

            ApiHttpClient.get(`server/${region}/monsters/search`,
            {
                params: params
            }).then(
            (res) => {
                okcb(res.data);
            }, 
            errcb);
        } else {
            ApiHttpClient.get(`server/${region}/monsters/`,
            {
                params: {
                    p: page,
                    sz: size
                }
            }).then(
            (res) => {
                okcb(res.data);
            }, 
            errcb);
        }   
    },
};
