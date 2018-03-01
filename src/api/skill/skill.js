import Vue from 'vue';
import Store from '@/store';

export default {
    
    getIconCoordinates(iconIndex) {
        let page = Math.floor(Number(iconIndex) / 200) + 1;
        let pageIdx = iconIndex % 200;
        let row = Math.floor(pageIdx / 10);
        let column = pageIdx % 10;
        const UNIT_SIZE = 50;

        let ret = {
            page: page,
            x: Math.max(UNIT_SIZE * column, 0),
            y: UNIT_SIZE * row,
            size: UNIT_SIZE
        };

        return ret;
    },

    getIconUrl(page, region) {
        if (!region) region = Store.state.regionCode;
        let pageStr;
        if (page < 10) {
            pageStr = "0" + page;
        } else {
            pageStr = page;
        }

        return `/api/server/${region}/dds/skillicon${pageStr}/png`;
    },

};
