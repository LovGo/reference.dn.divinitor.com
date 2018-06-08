import Vue from "vue";
import Region from "./region";
import Store from '@/store';

let Features = {
    RegionTimeInfo: { regions: ["na"], enabled: true },
    ResourceGameChat: { regions: ["na"], enabled: true },
    ResourceServerStats: { regions: ["na"], enabled: true },
    ResourceDownloadGameClient: { regions: ["na"], enabled: true },
    HideExpFd: { regions: ["ko"], enabled: true },

    // Add features above this

    featureEnabled(feature) {
        if (!feature) {
            // Default nonexistant features to false
            return false;
        }

        let regionName = Store.state.regionCode || this.getDefaultRegionCode();
        if (feature.regions.indexOf(regionName) != -1) {
            return feature.enabled;
        }

        return false;
    },
    install(vue, options) {
        vue.prototype.$f = this;
        vue.prototype.$fOn = this.featureEnabled;
    },
};

export default Features;
