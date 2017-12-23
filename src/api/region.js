const Regions = {
    "local": {
        id: "local",
        name: "North America",
        localizedName: "North America",
        version: 660,
        patched: "2017-12-14",
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
    getDefaultRegionCode() {
        return "local";
    },

    getRegion(id, okcb, errcb) {
        //  TODO load region info
        let ret = Regions[id];
        if (!ret) {
            errcb(`Region "${id}" not found`);
        } else {
            okcb(ret);
        }
    },

    getRegions(okcb, errcb) {
        let ret = [];
        for (let k in Regions) {
            ret.push(Regions[k]);
        }

        okcb(ret);
    }
};
