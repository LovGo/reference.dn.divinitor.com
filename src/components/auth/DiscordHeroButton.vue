<template>
<div class="discord-hero">
    <div class="discord-success" v-if="loginStatus == 3">
        Success! You are now logged in.
    </div>
    <div class="discord-login" v-else-if="loginStatus == 0">
        <button class="dv-button discord-button button" v-on:click="openDiscordAuth"
            v-anime="{
                borderColor: ['#98BCD4', '#dcf1ff', '#98BCD4', '#98BCD4'],
                loop: true,
                duration: 3000,
                delay: 750,
                easing: 'easeInOutExpo'
            }">
            <div class="login-label">Log in</div>
        </button>
        <br/>
        <div class="no-thanks" v-if="optional">
            <a href="#" v-on:click="skip">No thanks, just let me in</a>
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
        <div class="loading-blinker" /> Waiting for you to log in on the Devlin popup window...
    </div>
    <div class="discord-waiting" v-else-if="loginStatus == 2">
        <div class="loading-blinker" /> Verifying login information...
    </div>
    <div class="discord-error" v-else-if="loginStatus == 4">
        <h4 class="head">
            Whoops, we couldn't log you in :(
        </h4>
        <div class="detail" v-if="discordLoginError">
            {{ discordLoginError.message }}
        </div>
        <div class="button-row">
            <button class="dv-button" v-on:click="openDiscordAuth">Try again</button>
            <button class="dv-button" v-if="optional" v-on:click="skip">Skip for now</button>
        </div>
    </div>

    <div class="got-it" v-if="loginStatus == 3">
            <button class="dv-button" v-on:click="finish"
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
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import { Actions } from '@/storemutations';
import DiscordLoginProvider from "@/api/DiscordLoginProvider";
import AuthProvder from '@/api/AuthProvider';
import IRedeemedAuthResult from '@/models/auth/IRedeemedAuthResult';
import AuthProvider from '@/api/AuthProvider';

enum LoginStatus {
    IDLE = 0,
    DISCORD_PROMPT = 1,
    VERIFICATION = 2,
    DONE = 3,
    ERROR = 4,
};

interface IData {
    loginStatus: LoginStatus;
    discordLoginError: Error|null;
}

export default Vue.extend({
    props: {
        "optional": {
            type: Boolean as () => boolean,
        }
    },
    data(): IData {
        return {
            loginStatus: LoginStatus.IDLE,
            discordLoginError: null,
        };
    },
    methods: {
        finish() {
            this.$emit("finish");
        },
        skip() {
            this.$emit("skip");
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
            setTimeout(async() => {
                try {
                    const token = await AuthProvider.performDevlinOAuth2Flow();
                    this.loginStatus = LoginStatus.DONE;
                    this.$store.dispatch(Actions.SetAuthToken, token);
                    this.$emit("done");
                } catch (error) {
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
                }
            }, 1000);

        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.discord-hero {
    .discord-login {
        .discord-button {
            text-align: center;
            // width: 300px;
            // height: 110px;
            .login-label {
                // margin-top: 12px;
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
        // max-width: 500px;
        .head {
            
        }

        .detail {
            // color: lighten(@dv-c-red, 20%);
        }

        .button-row {
            // width: 100%;
            // margin-top: 74px;
            margin-top: 20px;
            display: flex;
            button {
                flex: 0 0 auto;
                .margin-right(8px);
                .padding-left(20px);
                .padding-right(20px);

                &:last-child {
                    .margin-right(0);
                }
            }
        }
    }

    .discord-waiting {
        padding-top: 20px;
        // text-align: center;
    }

    .discord-success {

    }
}

</style>

