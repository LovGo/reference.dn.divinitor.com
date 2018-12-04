<template>
<div class="first-run">
    <div class="modal-shade" />
    <div class="modal">
        <div class="modal-inner" 
            v-anime="{
                translateY: ['-100px', 0],
                opacity: {
                    value: ['0.0', '1.0'],
                    duration: 5000,
                },
                delay: 500,
                duration: 750,
                elasticity: 100,
            }">
            <div class="modal-content">
                <div class="page" :active="page == 0" :id="0">
                    <div class="content content-in" :active="page == 0">
                        <h1>Welcome to Divinitor Minerva</h1>
                        <p>
                            Minerva is a reference website for the MMORPG Dragon Nest.
                        </p>
                        <p>
                            Please note that this site is in limited beta. There will be
                            bugs, incomplete features, and duct tape everywhere. 
                            If you encounter an issue, please let <strong>Vahr</strong> know.
                        </p>
                        <p>
                            <a href="#" v-on:click="changePage(1)">Legal/Regulatory Information is provided here</a>.
                            By continuing, you accept these terms.
                        </p>

                        <div class="got-it">
                            <button v-on:click="changePage(2, 1)"
                                v-anime="{
                                    borderColor: ['#98BCD4', '#dcf1ff', '#98BCD4', '#98BCD4'],
                                    loop: true,
                                    duration: 3000,
                                    delay: 750,
                                    easing: 'easeInOutExpo'
                                }">
                                Let's get started
                            </button>
                        </div>
                    </div>
                </div>
                <div class="page" :active="page == 1" :id="1">
                    <div class="content content-in">
                        <h4>Quasi-legal stuff</h4>
                        <p class="legal">
                            This site does not use cookies for any of its functionality. We do use 
                            <a href="https://docs.microsoft.com/en-us/azure/application-insights/app-insights-overview" target="_blank">Azure Application
                            Insights</a> to gather basic usage and performance information to monitor site performance, issues, and
                            usage. You can opt out of this data collection by blocking cookies or using a tracker blocker.
                            If you log in to Minerva with Discord, your Discord information is only used to verify
                            eligibility to access limited features and prevent fraudulent use. You may opt out of this by not
                            signing in with Discord. A small amount of your browser's 
                            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage" target="_blank">local storage</a> is used
                            to store your login token, login name, preferences, and a few bits of information (like if you have
                            seen this message you're reading right now or not) necessary to the proper operation of the site.
                            You may clear this data at any time by using your browser's local storage options.
                            Vahr does not guarantee or have any obligation to the availability of this site and its services.
                            These terms may change at any time without prior notice, however if they do change you will be notified
                            the next time you access this site.
                        </p>
                        <div class="got-it">
                            <button v-on:click="changePage(2, 1)"
                                v-anime="{
                                    borderColor: ['#98BCD4', '#dcf1ff', '#98BCD4', '#98BCD4'],
                                    loop: true,
                                    duration: 3000,
                                    delay: 750,
                                    easing: 'easeInOutExpo'
                                }">
                                Sounds Good
                            </button>
                        </div>
                    </div>
                </div>
                <div class="page" :active="page == 2" :id="2">
                    <div class="content content-in">
                        <h1>Select your region</h1>
                        <p>
                            Please select your Dragon Nest service region. You can change this later by clicking on the
                            globe icon in the top right corner.
                        </p>
                        <div class="region-selector" v-if="!regionsLoading">
                            <region-select 
                                :regions="regions" 
                                v-on:select="selectRegion" 
                                :selection="selectedRegionCode"/>
                        </div>
                        <div class="region-error" v-if="regionsError">
                            <div class="warn toast">
                                <div class="content">
                                    <div class="heading">Oops</div>
                                    <p>
                                        Sorry! There might be an issue with the service:
                                        <br/>
                                        {{ regionsError }}
                                    </p>
                                </div>
                                
                            </div>
                            <div class="got-it">
                                <button v-on:click="changePage(3, 2)"
                                    v-anime="{
                                        borderColor: ['#98BCD4', '#dcf1ff', '#98BCD4', '#98BCD4'],
                                        loop: true,
                                        duration: 3000,
                                        delay: 750,
                                        easing: 'easeInOutExpo'
                                    }">
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="page" :active="page == 3" :id="3">
                    <div class="content content-in">
                        <span v-if="authenticated && loginStatus == 0">
                            <h1>You're already logged in</h1>
                            <p>
                                Nice! You've already logged in to Minerva via Discord 
                                as <strong>{{authInfo.username}}</strong>.
                            </p>
                            <div class="got-it">
                                <button v-on:click="logOut">
                                    No stop wait log me out
                                </button>
                                <button v-on:click="finish"
                                    v-anime="{
                                        borderColor: ['#98BCD4', '#dcf1ff', '#98BCD4', '#98BCD4'],
                                        loop: true,
                                        duration: 3000,
                                        delay: 750,
                                        easing: 'easeInOutExpo'
                                    }">
                                    Awesome, let's go
                                </button>
                            </div>
                        </span>
                        <span v-else>
                            <h1>Log in with Discord (Optional)</h1>
                            <p>
                                You can log in using Discord to gain access to closed-beta features if you are a member
                                in a Discord that has Minerva Closed Beta access. There are some features that are
                                available to guests, however, so if you're just here for that then meander on down 
                                to that "No thanks" link below.
                            </p>
                            <div class="discord-success" v-if="loginStatus == 3">
                                Success! You are now logged in.
                            </div>
                            <div class="discord-login" v-else-if="loginStatus == 0">
                                <button class="discord-button button" v-on:click="openDiscordAuth"
                                    v-anime="{
                                        borderColor: ['#98BCD4', '#dcf1ff', '#98BCD4', '#98BCD4'],
                                        loop: true,
                                        duration: 3000,
                                        delay: 750,
                                        easing: 'easeInOutExpo'
                                    }">
                                    <div class="login-label">Log in with</div>
                                    <img src="./../assets/discord_big_white.svg" class="discord-logo">
                                </button>
                                <br/>
                                <div class="no-thanks">
                                    <a href="#" v-on:click="finish">No thanks, just let me in</a>
                                </div>
                            </div>
                            <div class="discord-waiting" v-else-if="loginStatus == 1"
                                v-anime="{
                                    translateX: [-50, 0],
                                    opacity: {
                                        value: ['0.0', '1.0'],
                                        duration: 5000,
                                    },
                                    delay: 500,
                                    duration: 750,
                                    elasticity: 100,
                                }">
                                <div class="loading-blinker" /> Waiting for you to log in on the Discord popup window...
                            </div>
                            <div class="discord-waiting" v-else-if="loginStatus == 2">
                                <div class="loading-blinker" /> Verifying login information...
                            </div>
                            <div class="discord-error" v-else-if="loginStatus == 4">
                                <h4 class="head">
                                    Whoops, we couldn't log you in with Discord :(
                                </h4>
                                <div class="detail" v-if="discordLoginError">
                                    {{ discordLoginError.message }}
                                </div>
                                <div class="button-row">
                                    <button class="ok" v-on:click="openDiscordAuth">Try again</button>
                                    <button v-on:click="finish">Skip for now</button>
                                </div>
                            </div>

                            <div class="got-it" v-if="loginStatus == 3">
                                    <button v-on:click="finish"
                                        v-anime="{
                                            borderColor: ['#98BCD4', '#dcf1ff', '#98BCD4', '#98BCD4'],
                                            loop: true,
                                            duration: 3000,
                                            delay: 750,
                                            easing: 'easeInOutExpo'
                                        }">
                                        Awesome, let's go
                                    </button>
                            </div>
                        </span>
                    </div>
                </div>


                <div class="page-indicator">
                    <div class="indicator" :active="page == 0" v-on:click="changePage(0)"
                        :disabled="loginStatus == 1 || loginStatus == 2"/>
                    <!-- <div class="indicator" :active="page == 1" v-on:click="changePage(1)" 
                        :unread="page < 1"/> -->
                    <div class="indicator" :active="page == 2" v-on:click="changePage(2)" 
                        :disabled="completedStep < 1 || loginStatus == 1 || loginStatus == 2"/>
                    <div class="indicator" :active="page == 3" v-on:click="changePage(3)" 
                        :disabled="completedStep < 2"
                        :bad="loginStatus == 4"/>
                </div>
            </div>
        </div>

    </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {mapGetters} from "vuex";
import store from "@/store";

import RegionSelect from "@/components/region/RegionSelect.vue";

import RegionProvider from "@/api/RegionProvider";
import IRegion from '@/models/region/IRegion';
import { Actions } from '@/storemutations';
import DiscordLoginProvider from "@/api/DiscordLoginProvider";
import IRedeemedAuthResult from '@/models/auth/IRedeemedAuthResult';

enum LoginStatus {
    IDLE = 0,
    DISCORD_PROMPT = 1,
    VERIFICATION = 2,
    DONE = 3,
    ERROR = 4,
};

interface IData {
    page: number;
    completedStep: number;
    regionsLoading: boolean;
    regionsError: string;
    regions: IRegion[];
    loginStatus: LoginStatus;
    discordLoginError: Error|null;
}

export default Vue.extend({
    data(): IData {
        return {
            page: -1,
            completedStep: -1,
            regionsLoading: false,
            regionsError: "",
            regions: [],
            loginStatus: LoginStatus.IDLE,
            discordLoginError: null,
        };
    },
    components: {
        RegionSelect,
    },
    mounted() {
        this.loadRegions();
        setTimeout(() => this.changePage(0), 500);
    },
    computed: {
        selectedRegionCode(): string {
            return this.$store.state.regionCode;
        },
        ...mapGetters([
            "authenticated",
            "authInfo",
        ]),
    },
    methods: {
        changePage(index: number, step?: number) {
            this.$anime({
                targets: ".modal-inner",
                rotate: ["0deg"]
            });
            if (step !== undefined) {
                this.completedStep = step;
            }

            const old = this.page;
            this.page = index;
            if (old !== index) {
                //  Reset discord if errored
                if (this.loginStatus == LoginStatus.ERROR) {
                    this.$anime({
                        targets: ".page-indicator .indicator[bad]",
                        translateY: [-3, 0, 0],
                        rotate: ["+135deg"],
                        duration: 2000
                    });
                    this.loginStatus = LoginStatus.IDLE;
                    this.discordLoginError = null;
                }

                let translationX = -30;
                let translationY = 0;
                if (old < index) {
                    translationX *= -1;
                }

                if (old === -1) {
                    translationX = 0;
                    translationY = -50;
                }

                Vue.nextTick().then(() => {
                    this.$anime({
                        targets: ".page[active] .content-in",
                        translateX: [translationX, 0],
                        translateY: [translationY, 0],
                        elasticity: 100,
                        opacity: {
                            value: ['0.0', '1.0'],
                            delay: 100,
                            duration: 2000,
                        },
                        delay: 100,
                    });
                    this.$anime({
                        targets: ".page-indicator .indicator[active]",
                        rotate: ["+135deg"],
                        duration: 1000,
                    });
                });
            }
        },
        nextPage() {
            this.changePage(this.page + 1);
        },
        nextStep() {
            this.changePage(this.page, this.completedStep + 1);
        },
        loadRegions() {
            this.regionsLoading = true;
            RegionProvider.listRegions().then((regions) => {
                this.regions = regions;
                this.regionsLoading = false;
            }, (error: Error) => {
                // Error loading regions, skip
                this.regionsError = "Failed to get regions";
            });
        },
        selectRegion(region: IRegion) {
            this.$store.dispatch(Actions.SetRegion, region.shortName);
            this.changePage(3, 2);
        },
        openDiscordAuth() {
            this.$anime({
                targets: ".page-indicator .indicator[bad]",
                translateY: [-3, 0, 0],
                rotate: ["+135deg"],
                duration: 2000
            });
            this.$anime({
                targets: ".modal-inner",
                rotate: ["0deg"]
            });
            this.loginStatus = LoginStatus.DISCORD_PROMPT;
            this.discordLoginError = null;
            setTimeout(() => {
                DiscordLoginProvider.performDiscordOAuth2Flow().then((code) => {
                    this.loginStatus = LoginStatus.VERIFICATION;
                    return DiscordLoginProvider.redeemCode(code);
                }).then((authResult: IRedeemedAuthResult) => {
                    this.loginStatus = LoginStatus.DONE;
                    this.$store.dispatch(Actions.SetAuthToken, authResult);
                }).catch((error: Error) => {
                    console.error(error);
                    this.loginStatus = LoginStatus.ERROR;
                    this.discordLoginError = error;
                    Vue.nextTick().then(() => {
                        this.$anime({
                            targets: ".page-indicator .indicator[bad]",
                            translateX: [-5, 5, -2, 2, -3, 0],
                            translateY: [0, 3],
                            rotate: ["+240deg"],
                            elasticity: 500,
                            duration: 1000
                        });
                        this.$anime({
                            targets: ".modal-inner",
                            rotate: ["+2deg"],
                            delay: 200,
                            elasticity: 800,
                        });
                    });
                });
            }, 1000);
        },
        logOut() {
            this.$store.dispatch(Actions.ClearAuthToken);
            this.loginStatus = LoginStatus.IDLE;
        },
        finish() {
            this.$anime({
                targets: ".first-run",
                opacity: [1.0, 0.0],
                duration: 1000,
                easing: "easeOutCubic",
            }).finished.then(() => {
                this.$store.dispatch(Actions.SetFirstRunCompleted);
            });
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../less/core.less";

.first-run {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;

    .modal-inner {
        width: 600px;
    }

    .modal-content {
        z-index: 200;
        height: 360px;
        border: 1px solid @dv-c-accent-2;
        border-left-width: 6px;
        background: @dv-c-background;
        max-height: 600px;
        position: relative;

        h1 {
            font-size: 20px;
            // text-align: center;
            margin-bottom: 8px;
        }

        .content {
            margin: 12px 0;
            height: 100%;

            p.legal {
                font-size: 12px;
            }
        }

        .got-it {
            text-align: center;
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
        }

        .page {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 16px 24px;
            &[active] {
                display: block;
            }
        }

        .discord-login {
            width: 100%;
            text-align: center;
            .discord-button {
                text-align: center;
                width: 300px;
                height: 110px;
                .login-label {
                    margin-top: 12px;
                }
                .discord-logo {
                    width: 200px;
                }
            }

            .no-thanks {
                margin-top: 24px;
            }
        }

        .discord-error {
            .head {
                
            }

            .detail {
                color: @dv-c-red;
            }

            .button-row {
                width: 100%;
                margin-top: 74px;
                display: flex;
                button {
                    flex: 1 1;
                    margin-right: 8px;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }

        .discord-waiting {
            padding-top: 40px;
            text-align: center;
        }

        .discord-success {

        }

        .region-selector {
            margin-top: 30px;
        }

        .page-indicator {
            margin-top: 20px;
            text-align: center;

            position: absolute;
            bottom: -30px;
            left: 0;
            right: 0;
            padding-left: 0px;

            .indicator {
                @diamond-size: 6px;
                @idle-color: @dv-c-accent-3;

                .variant(@color) {
                    border-bottom-color: @color;
                    &::after {
                        border-top-color: @color;
                    }
                }

                cursor: pointer;
                display: inline-block;
                margin: 2px 4px;
                width: 0;
                height: 0;
                border: @diamond-size solid transparent;
                border-bottom-color: @idle-color;
                position: relative;
                top: -@diamond-size;
                transition: border-color 0.125s ease-in;
                transform-origin: 50% 100%;

                &::after {
                    content: "";
                    position: absolute;
                    left: -@diamond-size;
                    top: @diamond-size;
                    width: 0;
                    height: 0;
                    border: @diamond-size solid transparent;
                    border-top-color: @idle-color;
                    transition: border-color 0.125s ease-in;
                }

                &[active] {
                    .variant(@dv-c-foreground);
                }

                &[bad] {
                    .variant(@dv-c-red);
                }

                &:hover {
                    .variant(white);
                }

                &[disabled] {
                    pointer-events: none;
                    
                    border-bottom-color: @dv-c-disabled;
                    &::after {
                        border-top-color: @dv-c-disabled;
                    }
                }
            }
        }
    }
}

</style>

