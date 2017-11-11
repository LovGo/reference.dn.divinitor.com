import Vue from 'vue';

export default {

    cache: {},

    getItem(itemId, region, okcb, errcb) {
        let cacheKey = `${itemId}:${region}`;
        if (this.cache[cacheKey]) {
            okcb(this.cache[cacheKey]);
            return;
        }

        Vue.http.get(`/api/server/${region}/items/${itemId}`,
        {
        }).then(
        (res) => {
            this.cache[cacheKey] = res.body;
            okcb(res.body);
        }, 
        errcb);
    },

    getIconCoordinates(itemIconIndex) {
        let page = Math.floor(itemIconIndex / 200) + 1;
        let pageIdx = itemIconIndex % 200;
        let row = Math.floor(pageIdx / 10);
        let column = pageIdx % 10;
        const UNIT_SIZE = 50;

        let ret = {
            page: page,
            x: UNIT_SIZE * column - (column / 5),
            y: UNIT_SIZE * row,
            size: UNIT_SIZE
        };

        return ret;
    },
    getItemIconPageUrl(page, region) {
        let pageStr;
        if (page < 10) {
            pageStr = "0" + page;
        } else {
            pageStr = page;
        }

        return `/api/server/${region}/dds/itemicon${pageStr}/png`;
    },
    getSlotOverlay(rank, type, region) {
        const UNIT_SIZE = 52;
        let ret = {
            url: `/api/server/${region}/dds/uit_itemslotbutton_o.dds/png`,
            x: 0,
            y: 0,
        };

        let isWeap = type === "WEAPON" || type === "PARTS";

        if (rank === "NORMAL" || rank === 0) {
            if (isWeap) {
                ret.x = 0 * UNIT_SIZE;
                ret.y = 0 * UNIT_SIZE;
            } else {
                ret.x = 2 * UNIT_SIZE;
                ret.y = 2 * UNIT_SIZE;
            }
        }
        
        if (rank === "MAGIC" || rank === 1) {
            if (isWeap) {
                ret.x = 6 * UNIT_SIZE;
                ret.y = 1 * UNIT_SIZE;
            } else {
                ret.x = 0 * UNIT_SIZE;
                ret.y = 1 * UNIT_SIZE;
            }
        }
        
        if (rank === "RARE" || rank === 2) {
            if (isWeap) {
                ret.x = 6 * UNIT_SIZE;
                ret.y = 2 * UNIT_SIZE;
            } else {
                ret.x = 6 * UNIT_SIZE;
                ret.y = 0 * UNIT_SIZE;
            }
        }

        if (rank === "EPIC" || rank === 3) {
            if (isWeap) {
                ret.x = 7 * UNIT_SIZE;
                ret.y = 2 * UNIT_SIZE;
            } else {
                ret.x = 8 * UNIT_SIZE;
                ret.y = 3 * UNIT_SIZE;
            }
        }

        if (rank === "UNIQUE" || rank === 4) {
            if (isWeap) {
                ret.x = 7 * UNIT_SIZE;
                ret.y = 3 * UNIT_SIZE;
            } else {
                ret.x = 0 * UNIT_SIZE;
                ret.y = 2 * UNIT_SIZE;
            }
        }

        if (rank === "LEGENDARY" || rank === 5) {
            ret.x = 5 * UNIT_SIZE;
            ret.y = 3 * UNIT_SIZE;
        }

        if (rank === "DIVINE" || rank === 6) {
            if (isWeap) {
                ret.x = 4 * UNIT_SIZE;
                ret.y = 1 * UNIT_SIZE;
            } else {
                ret.x = 1 * UNIT_SIZE;
                ret.y = 2 * UNIT_SIZE;
            }
        }

        return ret;
    },

    getEnhancementInfo(enhanceId, region, okcb, errcb) {

    },

    getStampMod(enhanceLevel) {
        if (!enhanceLevel) {
            return 0;
        }

        if (enhanceLevel <= 6) {
            return 1;
        }

        if (enhanceLevel <= 14) {
            return 12;
        }

        return 20;
    }
};
