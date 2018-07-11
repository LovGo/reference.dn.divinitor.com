import Vue from 'vue';
import Store from '@/store';

export default {
    
    cache: {},
    requests: {},

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
        return `${Vue.http.options.root}/server/${region}/dds/pointicon.dds/png`;
    },

    getPoint(pointId, region) {
        if (!region) region = Store.state.regionCode;
        let cacheKey = `${pointId}:${region}`;
        if (this.cache[cacheKey]) {
            return Promise.resolve(this.cache[cacheKey]);
        }

        if (this.requests[cacheKey]) {
            return this.requests[cacheKey];
        }

        const requestPromise = Vue.http.get(`server/${region}/points/${pointId}`,
        {
        }).then((res) => {
            this.cache[cacheKey] = res.body;
            delete this.requests[cacheKey];
            return res.body;
        }, (err) => {
            delete this.requests[cacheKey];
            return Promise.reject(err);
        });

        this.requests[cacheKey] = requestPromise;

        return requestPromise;
    },
};
