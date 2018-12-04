import { ensureRegion } from "@/api/RegionProvider";
import { ApiHttpClient } from "@/globals";

export default {

    //  Item data
    cache: {},
    //  Set cache
    setCache: {},
    //  Enhancement data
    enhCache: {},
    //  Tuner contents
    tunerCache: {},
    //  Item can be tuned to
    tuningCache: {},
    //  Item acquire
    acquireCache: {},

    getItem(itemId, region, okcb, errcb) {
        region = ensureRegion(region);
        let cacheKey = `${itemId}:${region}`;
        if (this.cache[cacheKey]) {
            okcb(this.cache[cacheKey]);
            return;
        }

        ApiHttpClient.get(`server/${region}/items/${itemId}`,
        {
        }).then(
        (res) => {
            
            this.cache[cacheKey] = res.data;
            okcb(res.data);
        }, 
        errcb);
    },
    
    getItemTunings(itemId, region, okcb, errcb) {
        region = ensureRegion(region);
        let cacheKey = `${itemId}:${region}`;
        if (this.tuningCache[cacheKey]) {
            okcb(this.tuningCache[cacheKey]);
            return;
        }

        ApiHttpClient.get(`server/${region}/items/${itemId}/tuning`,
        {
        }).then(
        (res) => {
            
            this.tuningCache[cacheKey] = res.data;
            okcb(res.data);
        }, 
        errcb);
    },

    getItemAcquire(itemId, region, okcb, errcb) {
        region = ensureRegion(region);
        let cacheKey = `${itemId}:${region}`;
        if (this.acquireCache[cacheKey]) {
            okcb(this.acquireCache[cacheKey]);
            return;
        }

        ApiHttpClient.get(`server/${region}/items/${itemId}/acquire`,
        {
        }).then(
        (res) => {
            
            this.acquireCache[cacheKey] = res.data;
            okcb(res.data);
        }, 
        errcb);
    },

    getItemSet(itemId, jobs, region, okcb, errcb) {
        region = ensureRegion(region);
        let cacheKey = `${itemId}:${region}`;
        if (this.setCache[cacheKey]) {
            okcb(this.setCache[cacheKey]);
            return;
        }

        ApiHttpClient.get(`server/${region}/items/${itemId}/set`,
        {
            params: {
                'jobs': jobs.join(",")
            }
        }).then(
        (res) => {
            
            this.setCache[cacheKey] = res.data;
            okcb(res.data);
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
        region = ensureRegion(region);
        let pageStr;
        if (page < 10) {
            pageStr = "0" + page;
        } else {
            pageStr = page;
        }

        return `${ApiHttpClient.defaults.baseURL}/server/${region}/dds/itemicon${pageStr}/png`;
    },
    
    getSlotOverlay(rank, type, region) {
        region = ensureRegion(region);
        const UNIT_SIZE = 52;
        let ret = {
            url: `${ApiHttpClient.defaults.baseURL}/server/${region}/dds/uit_itemslotbutton_o.dds/png`,
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

        if (rank === "ANCIENT" || rank === 7) {
            ret.url = `${ApiHttpClient.defaults.baseURL}/server/${region}/dds/uit_itemslotbutton.dds/png`;
            if (isWeap) {
                ret.x = 1 * UNIT_SIZE;
                ret.y = 3 * UNIT_SIZE;
            } else {
                ret.x = 0 * UNIT_SIZE;
                ret.y = 3 * UNIT_SIZE;
            }
        }

        return ret;
    },

    getEnhancementInfo(enhanceId, region, okcb, errcb) {
        region = ensureRegion(region);
        let cacheKey = `blacksmith:${enhanceId}:${region}`;
        if (this.enhCache[cacheKey]) {
            okcb(this.enhCache[cacheKey]);
            return;
        }

        ApiHttpClient.get(`server/${region}/items/enhance/smith/${enhanceId}`,
        {
        }).then(
        (res) => {
            this.enhCache[cacheKey] = res.data;
            okcb(res.data);
        }, 
        errcb);
    },
    getMobileEnchantInfo(mobileEnchantId, region, okcb, errcb) {
        region = ensureRegion(region);
        let cacheKey = `mobile:${mobileEnchantId}:${region}`;
        if (this.enhCache[cacheKey]) {
            okcb(this.enhCache[cacheKey]);
            return;
        }

        ApiHttpClient.get(`server/${region}/items/enhance/mobile/${mobileEnchantId}`,
        {
        }).then(
        (res) => {
            this.enhCache[cacheKey] = res.data;
            okcb(res.data);
        }, 
        errcb);
    },
    getTunerInfo(tunerId, region, okcb, errcb) {
        region = ensureRegion(region);
        let cacheKey = `${tunerId}:${region}`;
        if (this.tunerCache[cacheKey]) {
            okcb(this.tunerCache[cacheKey]);
            return;
        }

        ApiHttpClient.get(`server/${region}/items/tuner/${tunerId}`,
        {
        }).then(
        (res) => {
            this.tunerCache[cacheKey] = res.data;
            okcb(res.data);
        }, 
        errcb);
    },
    getItemTunerInfo(itemId, region, okcb, errcb) {
        region = ensureRegion(region);
        ApiHttpClient.get(`server/${region}/items/${itemId}/tuning`,
        {
        }).then(
        (res) => {
            okcb(res.data);
        }, 
        errcb);
    },
    getItemSetForItem(itemId, jobIds, region, okcb, errcb) {
        region = ensureRegion(region);
        ApiHttpClient.get(`server/${region}/items/${itemId}/set`,
        {
            params: {
                jobs: jobIds.join(",")
            }
        }).then(
        (res) => {
            okcb(res.data);
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
                return "random item drop pouch";
            case "TITLE":
                return "title";
            case "DUAL_SKILL_TREE_EXPANSION":
                return "dual skill scroll"
            
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
        region = ensureRegion(region);
        ApiHttpClient.get(`server/${region}/items/charm/${charmId}`,
        {
        }).then(
        (res) => {
            okcb(res.data);
        }, 
        errcb);
    },
    getRandom(randomId, region, okcb, errcb) {
        this.getItemDrop(randomId, region, okcb, errcb);
    },
    getItemDrop(dropId, region, okcb, errcb) {
        region = ensureRegion(region);
        ApiHttpClient.get(`server/${region}/items/drop/${dropId}`,
        {
        }).then(
        (res) => {
            okcb(res.data);
        }, 
        errcb);
    },
    getItemDropGroup(dropGroupId, region, okcb, errcb) {
        region = ensureRegion(region);
        ApiHttpClient.get(`server/${region}/items/dropgroup/${dropGroupId}`,
        {
        }).then(
        (res) => {
            okcb(res.data);
        }, 
        errcb);
    },

    getBulk({ page, size, query }, { region }, okcb, errcb) {

        function anyMatch(obj, predicate) {
            for (let k in obj) {
                let v = obj[k];
                if (predicate(v)) {
                    return true;
                }
            }

            return false;
        }

        region = ensureRegion(region);

        let hasQuery = false;
        let hasGrade = false;
        if (query) {
            hasGrade = anyMatch(query.grades, (v) => !v);
            hasQuery = hasQuery || query.nameSearch;
            hasQuery = hasQuery || query.minLevel > 0;
            hasQuery = hasQuery || query.maxLevel != 100;
            hasQuery = hasQuery || hasGrade;
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
            if (hasGrade) {
                let g = "";
                for (let k in query.grades) {
                    if (!query.grades[k]) {
                        g += k.substr(0, 1);
                    }
                }

                params.g = g;
            }

            ApiHttpClient.get(`server/${region}/items/search`,
            {
                params: params
            }).then((res) => {
                
                okcb(res.data);
            }, 
            errcb);
        } else {
            ApiHttpClient.get(`server/${region}/items/`,
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
    itemEasyUrl(itemId, itemData) {
        let ret = `${itemId}`;
        if (itemData) {
            if (itemData.level > 1) {
                ret += `-L${itemData.level}`;
            }
            if (itemData.rank) {
                ret += `-${itemData.rank.toUpperCase().substr(0, 1)}`;
            }
            if (itemData.tier) {
                if (itemData.tier.indexOf(" 1") != -1) {
                    ret += "-T1";
                } else if (itemData.tier.indexOf(" 2") != -1) {
                    ret += "-T2";
                }
            }
            if (itemData.name.name) {
                ret += (`-${itemData.name.name.substr(0, 40).trim().replace(/\s|\.|\/|\?/g, "-").replace(/[%]/g, "").replace(/--/g, "-")}`);
            }
        }

        return ret;
    },

    rarityCompare(a, b) {
        let mapping = {
            NORMAL: 0,
            MAGIC: 1,
            RARE: 2,
            EPIC: 3,
            UNIQUE: 4,
            LEGENDARY: 5,
            DIVINE: 6
        };

        let ai = mapping[a.rank];
        let bi = mapping[b.rank];

        return ai - bi;
    },

    getItemChatLink(itemInfo) {
        
    }
};
