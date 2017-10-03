const Regions = {
    "na": {
        id: "na",
        name: "North America",
        localizedName: "North America",
        version: 636,
        patched: "2017-09-16",
        language: "English (US)"
    },
    "kr": {
        id: "kr",
        name: "Korea",
        localizedName: "대한민국",
        version: 866,
        patched: "2017-09-27",
        language: "Korean"
    }
};

export default {
    getDefaultRegionCode() {
        return "na";
    },

    getRegion(id, okcb, errcb) {
        //  TODO load region info
        let ret = Regions[id];
        if (!ret) {
            errcb(`Region "${id}" not found`);
        } else {
            okcb(ret);
        }
    }
};
