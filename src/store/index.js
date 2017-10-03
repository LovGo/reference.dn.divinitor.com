import Vue from 'vue';
import Vuex from 'vuex';
import * as MT from './mutation-types';

import region from '@/api/region';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        regionCode: null
    },
    actions: {
        init({ commit, state }) {
            let savedRegionCode = localStorage.getItem('dv.ref.dn.regionCode');
            if (!savedRegionCode) {
                savedRegionCode = region.getDefaultRegionCode();
            }
            commit(MT.REGION_SET, savedRegionCode);
        }
    },
    getters: {

    },
    mutations: {
        [MT.REGION_SET] (state, regionCode) {
            state.regionCode = regionCode;
            localStorage.setItem('dv.ref.dn.regionCode', regionCode);
        }
    },
    modules: [

    ]
});
