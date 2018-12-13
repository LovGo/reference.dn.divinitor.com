import Vue from "vue";
import store from "./../store";
import ITypedMap from '@/models/util/ITypedMap';
import { GeneralHttpClient, ApiHttpClient } from "@/globals";

export interface IFeature {
    regions: string[];
    enabled: boolean|Function|any;
};

export const netFeatures: ITypedMap<IFeature> = {
    ResourceDownloadGameClient: {
        regions: ["na"],
        enabled: true,
    },
    DisableGoldenGoose: {
        regions: ["sea", "ko", "na"],
        enabled: true,
    },
    GoldenGooseDefaultOff: {
        regions: ["eu"],
        enabled: true,
    },
};

export function getFeatureState(feature: IFeature): boolean {
    if (!feature) {
        return false;
    }

    const regionCode = store.state.regionCode;
    if (feature.regions.indexOf(regionCode) !== -1 || feature.regions.indexOf("all") !== -1) {
        const isEnabled = feature.enabled;
        if (typeof(isEnabled === "boolean")) {
            return isEnabled;
        } else if (typeof(isEnabled) === "function") {
            return isEnabled(regionCode);
        } else if (typeof(isEnabled) === "object") {
            const regionEnabled = feature.enabled[regionCode];
            if (regionEnabled == null) {
                return false;
            } else if (typeof(regionEnabled) === "boolean") {
                return regionEnabled;
            } else if (typeof(regionEnabled) === "function") {
                return regionEnabled();
            }
        }
    }

    return false;
};

export function init(): Promise<void> {
    return Promise.resolve();
    // return ApiHttpClient.get("");
}

export function install(vue: any, options: any) {
    vue.prototype.$fOn = getFeatureState;
    vue.prototype.$f = netFeatures;
}
