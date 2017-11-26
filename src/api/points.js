import Vue from 'vue';
import Store from '@/store';

export default {
    
    cache: {},

    getPointIconCoordinates(pointIconIndex) {
        let row = Math.floor(pointIconIndex / 8);
        let column = pointIconIndex % 8;
        const UNIT_SIZE = 512 / 8;

        let ret = {
            x: UNIT_SIZE * column,
            y: UNIT_SIZE * row,
            size: UNIT_SIZE,
        };

        return ret;
    },

    getPointIconUrl(region) {
        return `/api/server/${region}/dds/pointicon.dds/png`;
    },

    getPoint(pointId, region, okcb, errcb) {
        if (!region) region = Store.state.regionCode;
        let cacheKey = `${pointId}:${region}`;
        if (this.cache[cacheKey]) {
            okcb(this.cache[cacheKey]);
            return;
        }

        Vue.http.get(`/api/server/${region}/points/${pointId}`,
        {
        }).then(
        (res) => {
            this.cache[cacheKey] = res.body;
            okcb(res.body);
        }, 
        errcb);
    },
}
