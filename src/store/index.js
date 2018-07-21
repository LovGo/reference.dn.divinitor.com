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
            // Migration
            if (!savedRegionCode || savedRegionCode == "local") {
                savedRegionCode = region.getDefaultRegionCode();
            }

            commit(MT.REGION_SET, savedRegionCode);

            let savedAuth = localStorage.getItem('dv.ref.dn.auth');
            if (savedAuth) {
                console.log("Loading saved auth token");
                commit(MT.AUTH_SET, JSON.parse(savedAuth));
            }

            let savedAck = localStorage.getItem('dv.ref.dn.updateAck');
            if (savedAck) {
                commit(MT.ACK_UPDATE, savedAck);
            }
        },
        updateRegion({ commit, state }, regionCode) {
            console.log("Updating region to " + regionCode);
            commit(MT.REGION_SET, regionCode);
        },
        softUpdateRegion({ commit, state }, regionCode) {
            console.log("Updating region to " + regionCode);
            commit(MT.REGION_SOFT_SET, regionCode);
        }
    },
    getters: {
        isAuthed: state => {
            var currentTime = new Date().getTime() / 1000;
            return state.auth != null && JwtDecode(state.auth.access_token).exp >= currentTime;
        },
        isExpired: state => {
            var currentTime = new Date().getTime() / 1000;
            return state.auth == null || JwtDecode(state.auth.access_token).exp < currentTime;
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
        [MT.REGION_SOFT_SET] (state, regionCode) {
            state.regionCode = regionCode;
        },
        [MT.AUTH_SET] (state, auth) {
            state.auth = auth;
            localStorage.setItem('dv.ref.dn.auth', JSON.stringify(auth));
            Vue.http.headers.common["Authorization"] = this.getters.authToken;
            const authInfo = JwtDecode(state.auth.access_token);
            let authId = "E:" + btoa(authInfo.sub).replace(/[,;=| ]+/g, "_");
            if (authInfo.dsid) {
                authId = "D:" + authInfo.dsid;
            }
            
            if (!this.getters.isExpired) {
                appInsights.setAuthenticatedUserContext(authId, authInfo.dsid, true);
            }
        },
        [MT.AUTH_CLEAR] (state) {
            state.auth = null;
            localStorage.removeItem('dv.ref.dn.auth');
            Vue.http.headers.common["Authorization"] = undefined;
            appInsights.clearAuthenticatedUserContext();
        },
        [MT.ACK_UPDATE](state, updateNum) {
            state.lastAckedUpdate = updateNum;
            localStorage.setItem('dv.ref.dn.updateAck', updateNum);
        }
    },
    modules: [

    ]
});
