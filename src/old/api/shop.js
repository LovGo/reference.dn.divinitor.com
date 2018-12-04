import { ensureRegion } from "@/api/RegionProvider";
import { ApiHttpClient } from "@/globals";
import UiString from './uistring';

const ShopNames = {
    unknown: {
        nameId: 800000,
        ids: [],
        unknown: true
    },
    general: {
        nameId: 501,
        ids: [
            10,
            20,
            30,
            40,
            50,
        ]
    },
    lament: {
        nameId: 1000063838,
        deprecated: true,
        ids: [
            28001,
            28002,
            28003,
            28004,
            28005,
            28006,
            28007,
            28008,
            28009,
        ]
    },
    dungeon: {
        nameId: 1000113406,
        ids: [
            28101,
            28102,
            28103,
            28104,
            28105,
            28106,
            28107,
            28108,
            28109,
        ]
    },
    nest: {
        nameId: 1000093752,
        ids: [
            29001,
            29002,
            29003,
            29004,
            29005,
            29006,
            29007,
            29008,
            29009,
        ]
    },
    arena: {
        nameId: 2419,
        ids: [
            5001,
            5002,
            5003,
            5004,
            5005,
            5006,
            5007,
            5008,
            5009,
        ]
    },
    ladder: {
        nameId: 120219,
        ids: [
            5101,
            5102,
            5103,
            5104,
            5105,
            5106,
            5107,
            5108,
            5109,
        ]
    },
    champion: {
        nameId: 122025,
        ids: [
            5501,
            5502,
            5503,
            5504,
            5505,
            5506,
            5507,
            5508,
            5509,
        ]
    },
    rabbit: {
        nameId: 1000028420,
        ids: [
            59001,
        ]
    },
    nightmare: {
        nameId: 5401,
        ids: [
            52001,
            52002,
            52003,
            52004,
            52005,
            52006,
            52007,
            52008,
            52009,
        ]
    },
    blacksmith: {
        nameId: 1000015065,
        ids: [
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
        ]
    },
    guildmaster: {
        nameId: 1501,
        ids: [
            89001
        ]
    },
    battlefield: {
        nameId: 9531,
        ids: [
            88001,
            88002,
            88003,
            88004,
            88005,
            88006,
            88007,
            88008,
            88009,    
        ]
    },
    citadel: {
        nameId: 1000079666,
        ids: [
            66001,
        ]
    },
    plate: {
        nameId: 2291,
        ids: [
            35006,
        ]
    },
    teardrop: {
        nameId: 1000010193,
        deprecated: true,
        ids: [
            14051,
            14052,
            14053,
            14054,
            14055,
            14056,
            14057,
            14058,
            14059,
        ]
    },
    daredevil: {
        nameId: 100019124,
        ids: [
            40011,
            40012,
            40013,
            40014,
            40015,
            40016,
            40017,
            40018,
            40001,
            40002,
            40111,
            40112,
            40113,
            40114,
            40115,
            40116,
            40117,
            40118,
            40119,
        ]
    },
    wrath: {
        override: 1000103080,
        ids: [
            91001,
        ]
    },
    farm: {
        nameId: 1213,
        ids: [
            45001,
        ]
    },
    event: {
        nameId: 2325,
        ids: [
            100004,
        ]
    },
    special: {
        nameId: 502,
        ids: [
            76001,
            76002,
            76003,
            76004,
            76005,
            76006,
            76007,
            76008,
            76009,
        ]
    },
    achievement: {
        nameId: 4688,
        deprecated: true,
        ids: [
            31001,
            31002,
            31003,
            31004,
            31005,
            31006,
            31007,
            31008,
            31009,
        ]
    },
    friendship: {
        nameId: 3201,
        ids: [
            50001,
            50002,
            50003,
            50004,
            50005,
            50006,
            50007,
            50008,
            51001,
        ]
    },
    anniversary: {
        nameId: 1000088910,
        ids: [
            68501,
            68502,
            68503,
            68504,
            68505,
            68506,
            68507,
            68508,
            68509,
        ]
    },
    guildBase: {
        nameId: 140213,
        ids: [
            38001,
        ]
    },
    slayer: {
        nameId: 9428,
        ids: [
            92001,
            92002,
            92003,
            92004,
            92005,
            92006,
            92007,
            92008,
            92009,
        ]
    },
    mount: {
        nameId: 9200,
        ids: [
            11000,
        ]
    },
    community: {
        nameId: 1000121512,
        ids: [
            89011,
        ]
    },
    mentor: {
        nameId: 120342,
        ids: [
            89000,
        ]
    },
    crystal: {
        nameId: 1000120308,
        ids: [
            96001,
        ]
    },
    banquet: {
        override: 1000121906,
        ids: [
            89021,
        ]
    }
};

export default {

    getShopName(id, region, okcb, errcb) {
        region = ensureRegion(region);
        
        let info = ShopNames.unknown;
out:
        for (let k in ShopNames) {
            let v = ShopNames[k];
            for (let k1 in v.ids) {
                let v1 = v.ids[k1];
                if (id == v1) {
                    info = v;
                    break out;
                }
            }
        }

        if (info.override) {
            UiString.getString(Number(info.override),
                {
                    region: region,
                    okcb: (v) => {
                        okcb(v);   
                    },
                    errcb: errcb
            });
        } else {
            UiString.getString(1000004083,
                {
                    region: region,
                    param: `{${info.nameId}},{1701}`,
                    okcb: (v) => {
                        if (info.unknown) {
                            v = v + " (" + id + ")";
                        }
                        if (info.deprecated) {
                            v = v + " (DEPRECATED)";
                        }

                        okcb(v);
                    },
                    errcb: errcb
                });
        }
    },

    getShopInstanceName(id) {
        out:
        for (let k in ShopNames) {
            let v = ShopNames[k];
            for (let k1 in v.ids) {
                let v1 = v.ids[k1];
                if (id == v1) {
                    return k;
                }
            }
        }

        return null;
    },

    coalesce(shopEntryList) {
        let ret = {};
        for (let k in shopEntryList) {
            let v = shopEntryList[k];
            let instanceName = this.getShopInstanceName(v.shopId);
            let rv = ret[instanceName];
            if (rv) {
                let matched = false;
                for (let k1 in rv.entries) {
                    let v1 = rv.entries[k1];
                    if (this.areShopEntriesEqual(v, v1)) {
                        matched = true;
                        break;
                    }
                }

                if (!matched) {
                    rv.entries.push(v);
                }
            } else {
                rv = {
                    shopId: v.shopId,
                    entries: [
                        v
                    ]
                };
                ret[instanceName] = rv;
            }
        }

        let rret = [];
        for (let k in ret) {
            rret.push(ret[k]);
        }

        return rret;
    },

    areShopEntriesEqual(a, b) {
        if (this.getShopInstanceName(a) != this.getShopInstanceName(b)) {
            return false;
        }

        if (!this.areEqual(a, b, [
            "tabId",
            "requirementType",
            "requirementValue",
            "buyLimitType",
            "buyLimit"
        ])) {
            return false;
        }

        //  Check fees
        if (!!a.fees == !!b.fees) {
            if (a.fees.length != b.fees.length) {
                return false;
            }
        } else {
            return false;
        }
        

        for (let k in a.fees) {
            let av = a.fees[k];
            let bv = b.fees[k];

            if (!this.areEqual(av, bv, [
                "typeId",
                "value"
            ])) {
                return false;
            }

            if (!!av.item && !!bv.item) {
                if (typeof av.item === "object") {
                    return av.item.id == bv.item.id;
                } else {
                    return av.item == bv.item;
                }
            } else {
                if (av.item == null && bv.item == null) {
                    return true;
                }
                
                return av.item == bv.item;
            }
        }
    },

    areEqual(a, b, fieldNames) {
        for (let k in fieldNames) {
            let v = fieldNames[k];
            if (a[v] != b[v]) {
                return false;
            }
        }

        return true;
    }
};
