import Vue from "vue";
import Region from "./region";
import Store from '@/store';

let Features = {
    RegionTimeInfo: { regions: ["na"], enabled: true },
    ResourceGameChat: { regions: ["na"], enabled: false },
    ResourceServerStats: { regions: ["na"], enabled: false },
    ResourceDownloadGameClient: { regions: ["na"], enabled: true },
    HideExpFd: {
        regions: ["ko", "na", "sea", "eu"], 
        enabled: {
            ko: true,
            sea: true,
            eu: true,
            na() {
                return new Date() >= new Date(2018, 7, 12, 2);
            },
        }
    },

    // Add features above this

    featureEnabled(feature) {
        if (!feature) {
            // Default nonexistant features to false
            return false;
        }

        let regionName = Store.state.regionCode || this.getDefaultRegionCode();
        if (feature.regions.indexOf(regionName) != -1) {
            if (typeof(feature.enabled) === "boolean") {
                return feature.enabled;
            }
            if (typeof(feature.enabled) === "function") {
                return feature.enabled(regionName);
            }
            if (typeof(feature.enabled) === "object") {
                const regionEnabled = feature.enabled[regionName];
                if (regionEnabled == null) {
                    return false;
                }
                if (typeof(regionEnabled) === "boolean") {
                    return regionEnabled;
                }
                if (typeof(regionEnabled) === "function") {
                    return regionEnabled();
                }
            }
        }

        return false;
    },
    install(vue, options) {
        vue.prototype.$f = this;
        vue.prototype.$fOn = this.featureEnabled;
    },
};

export default Features;
