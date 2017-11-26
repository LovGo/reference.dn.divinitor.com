import Vue from 'vue';
import Vuex from 'vuex';
import * as MT from './mutation-types';
import JwtDecode from 'jwt-decode';

import region from '@/api/region';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        regionCode: null,
        auth: null,
        lastAckedUpdate: 0,
    },
    actions: {
        init({ commit, state }) {
            let savedRegionCode = localStorage.getItem('dv.ref.dn.regionCode');
            if (!savedRegionCode) {
                savedRegionCode = region.getDefaultRegionCode();
            }
            commit(MT.REGION_SET, savedRegionCode);

            let savedAuth = localStorage.getItem('dv.ref.dn.auth');
            if (savedAuth) {
                commit(MT.AUTH_SET, JSON.parse(savedAuth));
            }

            let savedAck = localStorage.getItem('dv.ref.dn.updateAck');
            if (savedAck) {
                commit(MT.ACK_UPDATE, savedAck);
            }
        }
    },
    getters: {
        isAuthed: state => {
            return state.auth != null;
        },
        authToken: state => {
            return state.auth.token_type + " " + state.auth.access_token;
        },
        authInfo: state => {
            return JwtDecode(state.auth.access_token);
        },
        lastAckedUpdate: state => {
            return state.lastAckedUpdate;
        }
    },
    mutations: {
        [MT.REGION_SET] (state, regionCode) {
            state.regionCode = regionCode;
            localStorage.setItem('dv.ref.dn.regionCode', regionCode);
        },
        [MT.AUTH_SET] (state, auth) {
            state.auth = auth;
            localStorage.setItem('dv.ref.dn.auth', JSON.stringify(auth));
            Vue.http.headers.common["Authorization"] = this.getters.authToken;
        },
        [MT.AUTH_CLEAR] (state) {
            state.auth = null;
            localStorage.removeItem('dv.ref.dn.auth');
            Vue.http.headers.common["Authorization"] = undefined;
        },
        [MT.ACK_UPDATE](state, updateNum) {
            state.lastAckedUpdate = updateNum;
            localStorage.setItem('dv.ref.dn.updateAck', updateNum);
        }
    },
    modules: [

    ]
});
