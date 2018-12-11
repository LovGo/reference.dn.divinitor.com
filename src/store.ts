import Vue from "vue";
import Vuex from "vuex";
import { Actions, MutationTypes } from "./storemutations";
import {defaultRegion} from "@/api/RegionProvider";
import JwtDecode from "jwt-decode";
import IToken from './models/util/IToken';
import IRedeemedAuthResult from "./models/auth/IRedeemedAuthResult";
import moment from "moment";

Vue.use(Vuex);

const RegionCodeStoreName = "dv.ref.dn.regionCode";
const FirstRunStoreName = "dv.ref.dn.firstRunAck";
const AuthStoreName = "dv.ref.dn.auth";

export interface IState {
    regionCode: string;
    firstRunAck: boolean,
    auth: IRedeemedAuthResult|null;
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
        [MutationTypes.SetRegion](state, regionCode) {
            state.regionCode = regionCode;
            localStorage.setItem(RegionCodeStoreName, regionCode);
        },
        [MutationTypes.SetRegionSoft](state, regionCode) {
            state.regionCode = regionCode;
        },
        [MutationTypes.SetFirstRunCompleted](state) {
            state.firstRunAck = true;
            localStorage.setItem(FirstRunStoreName, String(state.firstRunAck));
        },
        [MutationTypes.SetAuthToken](state, authToken: IRedeemedAuthResult) {
            state.auth = authToken;
            localStorage.setItem(AuthStoreName, JSON.stringify(authToken));
        },
        [MutationTypes.ClearAuthToken](state) {
            state.auth = null;
            localStorage.removeItem(AuthStoreName);
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

            const savedAuthStr = localStorage.getItem(AuthStoreName);
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
        [Actions.SetAuthToken]({ commit, state }, auth: IRedeemedAuthResult) {
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
            return state.auth != null && JwtDecode<IToken>(state.auth.access_token).exp >= currentTime;
        },
        expired: (state): boolean => {
            const currentTime = new Date().getTime() / 1000;
            return state.auth == null || JwtDecode<IToken>(state.auth.access_token).exp < currentTime;
        },
        authToken: (state): string|null => {
            if (!state.auth) {
                return null;
            }

            return state.auth.token_type + " " + state.auth.access_token;
        },
        showFirstRun: (state): boolean => {
            return !state.firstRunAck;
        },
        authInfo: (state): IToken|null => {
            if (state.auth == null) {
                return null;
            }

            return JwtDecode<IToken>(state.auth.access_token);
        },
        pageLoading: (state): boolean => {
            return state.pageLoading;
        }
    }
});
