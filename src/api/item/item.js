import Vue from 'vue';

export default {

    cache: {},
    enhCache: {},
    tunerCache: {},

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
        let page = Math.floor(Number(itemIconIndex) / 200) + 1;
        let pageIdx = itemIconIndex % 200;
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
        let cacheKey = `blacksmith:${enhanceId}:${region}`;
        if (this.enhCache[cacheKey]) {
            okcb(this.enhCache[cacheKey]);
            return;
        }

        Vue.http.get(`/api/server/${region}/items/enhance/smith/${enhanceId}`,
        {
        }).then(
        (res) => {
            this.enhCache[cacheKey] = res.body;
            okcb(res.body);
        }, 
        errcb);
    },
    getMobileEnchantInfo(mobileEnchantId, region, okcb, errcb) {
        let cacheKey = `mobile:${mobileEnchantId}:${region}`;
        if (this.enhCache[cacheKey]) {
            okcb(this.enhCache[cacheKey]);
            return;
        }

        Vue.http.get(`/api/server/${region}/items/enhance/mobile/${mobileEnchantId}`,
        {
        }).then(
        (res) => {
            this.enhCache[cacheKey] = res.body;
            okcb(res.body);
        }, 
        errcb);
    },
    getTunerInfo(tunerId, region, okcb, errcb) {
        let cacheKey = `${tunerId}:${region}`;
        if (this.tunerCache[cacheKey]) {
            okcb(this.tunerCache[cacheKey]);
            return;
        }

        Vue.http.get(`/api/server/${region}/items/tuner/${tunerId}`,
        {
        }).then(
        (res) => {
            this.tunerCache[cacheKey] = res.body;
            okcb(res.body);
        }, 
        errcb);
    },
    getItemTunerInfo(itemId, region, okcb, errcb) {
        Vue.http.get(`/api/server/${region}/items/${itemId}/tuning`,
        {
        }).then(
        (res) => {
            okcb(res.body);
        }, 
        errcb);
    },
    getItemDetailedCategory(itemData) {
        let t = itemData.type.type;
        
        switch (t) {
            case "QUEST":
                return "quest item";
            case "ENHANCEMENT_HAMMER":
                return "enhancement hammer";
            case "HAIRDYE":
                return "hair dye";
            case "SKINDYE":
                return "skin color";
            case "CONTACT_LENS":
                return "contact lens";
            case "PET_ALICORN":
                return "pet alicorn";
            case "ENCHANT_JELLY":
                return "protection jelly";
            case "WORLD_BIRD":
                return "bird";
            case "DNP_COUPON":
                return "DNP coupon";
            case "SKILL_RESET_SCROLL":
            case "UNLIMITED_RESET_SCROLL":
                return "skill reset scroll";
            case "EXP_SCROLL":
                return "exp scroll";
            case "VEHICLE":
            case "VEHICLE_MULTI_MOUNT":
                return "mount";
            case "TALISMAN_SLOT_EXPANSION":
                return "expansion";
            case "UNSEAL_INCR_AND_WARRANTY":
                return "warranty";
            case "MERCENARY_EXP_POTION":
            case "MERC_EXPLORATION_AWAKENING_POTION":
                return "mercenary potion";
            case "ITEM_TUNER":
                return "item tuner";
            case "HERO_LEVEL_EXP_POTION":
                return "hero exp potion";
            case "HERO_LEVEL_JUMP_TO_LEVEL":
                return "hero level scroll";
            case "HERO_LEVEL_EXP_SCROLL":
                return "hero level scroll";
            case "FORTUNE_COIN_POINTS":
                return "point token";
            case "ITEM_DROP_POUCH":
                return "random item pouch";
            case "ITEM_DROP_DUAL_POUCH":
                return "random 1-2 item pouch";
            case "MULTI_ITEM_DROP_POUCH":
                return "item pouch";
            case "HERO_POUCH":
                return "class item pouch";
            case "RANDOM":
                return "random item pouch";
            
        }

        if (itemData.category && itemData.category.name) {
            let ret = itemData.category.name;
            if (t === "CREST") {
                return ret + " crest";
            }
            if (t === "CROP") {
                return "harvested " + ret + " crop";
            }

            return ret;
        }

        return "item";
    },
    getCharm(charmId, region, okcb, errcb) {
        Vue.http.get(`/api/server/${region}/items/charm/${charmId}`,
        {
        }).then(
        (res) => {
            okcb(res.body);
        }, 
        errcb);
    },
    getRandom(randomId, region, okcb, errcb) {
        Vue.http.get(`/api/server/${region}/items/random/${charmId}`,
        {
        }).then(
        (res) => {
            okcb(res.body);
        }, 
        errcb);
    },
};
