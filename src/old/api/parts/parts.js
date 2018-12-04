import Vue from 'vue';
import { ensureRegion } from "@/api/RegionProvider";
import { ApiHttpClient } from "@/globals";

export default {

    getDecalIconUrl(part, region) {
        region = ensureRegion(region);
        if (part.decalName) {
            return `${ApiHttpClient.defaults.baseURL}/server/${region}/dds/${part.decalName}/png`;
        } else {
            return null;
        }
    }
};
