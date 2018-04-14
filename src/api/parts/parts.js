import Vue from 'vue';
import Store from '@/store';

export default {

    getDecalIconUrl(part, region) {
        if (!region) region = Store.state.regionCode;
        if (part.decalName) {
            return `${Vue.http.options.root}/server/${region}/dds/${part.decalName}/png`;
        } else {
            return null;
        }
    }
};
