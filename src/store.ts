import Vue from "vue";
import Vuex from "vuex";
import { Actions, MutationTypes } from "./storemutations";
import RegionProvider, { defaultRegion, localRegion } from "@/api/RegionProvider";
import JwtDecode from "jwt-decode";
import IDevlinTokenResponse from './models/auth/IDevlinTokenResponse';
import IJwtTokenBase from './models/auth/IJwtTokenBase';
import { ApiHttpClient } from './globals';

Vue.use(Vuex);

const RegionCodeStoreName = "dv.ref.dn.regionCode";
const FirstRunStoreName = "dv.ref.dn.firstRunAck";
const AuthStoreName = "dv.ref.dn.auth";
const DevlinAuthStoreName = "dv.ref.dn.devlinauth";

export interface IState {
    regionCode: string;
    firstRunAck: boolean,
    auth: IDevlinTokenResponse|null;
    pageLoading: boolean;
}

export default new Vuex.Store<IState>({
    state: {
        regionCode: "",
        auth: null,
        firstRunAck: false,
        pageLoading: false,
    },
    mutations: {
        [MutationTypes.SetRegion](state, regionCode: string) {
            state.regionCode = regionCode;
            localStorage.setItem(RegionCodeStoreName, regionCode);
        },
        [MutationTypes.SetRegionSoft](state, regionCode: string) {
            state.regionCode = regionCode;
        },
        [MutationTypes.SetFirstRunCompleted](state) {
            state.firstRunAck = true;
            localStorage.setItem(FirstRunStoreName, String(state.firstRunAck));
        },
        [MutationTypes.SetAuthToken](state, authToken: IDevlinTokenResponse) {
            state.auth = authToken;
            localStorage.setItem(DevlinAuthStoreName, JSON.stringify(authToken));
        },
        [MutationTypes.ClearAuthToken](state) {
            state.auth = null;
            localStorage.removeItem(DevlinAuthStoreName);
        },
        [MutationTypes.SetPageLoading](state, value: boolean) {
            state.pageLoading = value;
        }
    },
    actions: {
        [Actions.Init]({ commit, state }) {
            if (localStorage.getItem(FirstRunStoreName)) {
                commit(MutationTypes.SetFirstRunCompleted);
            }

            let savedRegionCode = localStorage.getItem(RegionCodeStoreName);
            if (!savedRegionCode || savedRegionCode == "local") {
                savedRegionCode = <string>defaultRegion;
            }

            commit(MutationTypes.SetRegion, savedRegionCode);

            const savedAuthStr = localStorage.getItem(DevlinAuthStoreName);
            if (savedAuthStr) {
                const savedAuth = JSON.parse(savedAuthStr);
                if (savedAuth) {
                    commit(MutationTypes.SetAuthToken, savedAuth);
                }
            }
        },
        [Actions.SetRegion]({ commit, state }, regionCode) {
            commit(MutationTypes.SetRegion, regionCode);
        },
        [Actions.SetRegionSoft]({ commit, state }, regionCode) {
            commit(MutationTypes.SetRegionSoft, regionCode);
        },
        [Actions.SetAuthToken]({ commit, state }, auth: IDevlinTokenResponse) {
            commit(MutationTypes.SetAuthToken, auth);
        },
        [Actions.ClearAuthToken]({ commit, state }) {
            commit(MutationTypes.ClearAuthToken);
        },
        [Actions.SetFirstRunCompleted]( {commit, state }) {
            commit(MutationTypes.SetFirstRunCompleted);
        },
        [Actions.StartPageLoad]({commit, state }) {
            commit(MutationTypes.SetPageLoading, true);
        },
        [Actions.FinishPageLoad]({commit, state }) {
            commit(MutationTypes.SetPageLoading, false);
        },
    },
    getters: {
        authenticated: (state): boolean => {
            const origin = window.location.origin;
            // if (origin.indexOf("//localhost") !== -1) {
            //     return true;
            // }

            const currentTime = new Date().getTime() / 1000;
            return state.auth != null && JwtDecode<IJwtTokenBase>(state.auth.accessToken).exp >= currentTime;
        },
        expired: (state): boolean => {
            const currentTime = new Date().getTime() / 1000;
            return state.auth == null || JwtDecode<IJwtTokenBase>(state.auth.accessToken).exp < currentTime;
        },
        authToken: (state): string|null => {
            if (!state.auth) {
                return null;
            }

            return state.auth.tokenType + " " + state.auth.accessToken;
        },
        showFirstRun: (state): boolean => {
            return !state.firstRunAck;
        },
        authInfo: (state): IDevlinTokenResponse|null => {
            if (state.auth == null) {
                return null;
            }

            return state.auth;
        },
        pageLoading: (state): boolean => {
            return state.pageLoading;
        }
    }
});
