<template>
<div class="site-auth-header" v-if="!$route.query.embed">
    <div class="logged-in" v-if="authenticated">
        <div class="left">
            <p>
                Hi <strong>{{ username }}</strong>!
            </p>
            <div class="log-out" v-on:click="logOut">
                Log Out
            </div>
        </div>
        <img class="right discord-avatar" v-if="avatar" :src="avatar" alt="?"/>
    </div>
    <div class="guest" v-else v-on:click="promptLogin" :error="loginStatus.error !== undefined">
        <div v-if="!loginStatus.started">
            <p>
                Hello, <strong>Guest!</strong>
            </p>
            <div class="clicky">
                Log in
            </div>
        </div>
        <div class="login-waiting" v-else-if="loginStatus.loading">
            <div class="loading-blinker" /> <span class="loading-text">{{ loginStatus.customStatus }}</span>
        </div>
        <div class="login-error" v-else-if="loginStatus.error !== undefined">
            <div class="error">Error</div>
            <p>{{ loginStatus.error.message }}</p>
            <div class="clicky">Try again</div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Store from "@/store";
import DiscordLoginProvider from '@/api/DiscordLoginProvider';
import IRedeemedAuthResult from '@/models/auth/IRedeemedAuthResult';
import { Actions } from '@/storemutations';
import IToken from '@/models/util/IToken';
import LoadingErrorable from "@/models/util/LoadingErrorable";

interface IData {
    loginStatus: LoadingErrorable<any, any>;
}

export default Vue.extend({
    data(): IData {
        return {
            loginStatus: new LoadingErrorable(),
        };
    },
    components: {
    },
    computed: {
        authenticated(): boolean {
            return this.$store.getters.authenticated;
        },
        username(): string {
            return (<IToken>this.$store.getters.authInfo).username;
        },
        avatar(): string|null {
            const token = this.$store.getters.authInfo as IToken;
            if (token.avatar) {
                let ext = "png";
                if (token.avatar.startsWith("a_")) {
                    ext = "gif";
                }
                return `https://cdn.discordapp.com/avatars/${token.dsid}/${token.avatar}.${ext}?size=64`;
            }

            return null;
        }
    },
    methods: {
        promptLogin() {
            if (this.loginStatus.loading) {
                return;
            }

            this.loginStatus.startLoad();
            this.loginStatus.customStatus = "Waiting for you to log in";
            DiscordLoginProvider.performDiscordOAuth2Flow().then((code) => {
                this.loginStatus.customStatus = "Verifying login";
                return DiscordLoginProvider.redeemCode(code);
            }).then((authResult: IRedeemedAuthResult) => {
                // this.loginStatus.done(true);
                this.$store.dispatch(Actions.SetAuthToken, authResult);
            }).catch((error: Error) => {
                this.loginStatus.failed(error);
            });
        },
        logOut() {
            this.$store.dispatch(Actions.ClearAuthToken);
            this.loginStatus = new LoadingErrorable();
            if (this.$route.matched.some((r) => r.meta.auth)) {
                this.$router.push({
                    name: "auth",
                    query: {
                        path: this.$route.fullPath,
                    },
                });
            }
        },
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.site-auth-header {
    position: relative;
    user-select: none;

    p {
        margin: 0;
        line-height: 1.25em;
    }

    .clicky {
        font-family: @dv-f-geomanist;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 12px;
        color: @dv-c-accent-2;
        white-space: nowrap;
        margin-top: 4px;
    }

    .guest {
        .border-left(2px solid @dv-c-foreground);
        background: fade(@dv-c-background, 80%);
        padding: 10px;
        cursor: pointer;
        transition: background-color 0.125s ease-in, color 0.125s ease-in;
        &:hover {
            background: fade(@dv-c-foreground, 20%);
        }

        .login-waiting {
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 12px;
            white-space: nowrap;
            vertical-align: middle;

            .loading-text {
                position: relative;
                top: -2px;
            }

            .loading-blinker {
                .margin-left(8px);
                .margin-right(12px);
            }
        }

        &[error] {
            border-left-color: @dv-c-red;
        }

        .login-error {
            .error {
                color: @dv-c-red;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                font-size: 12px;
            }
        }
    }

    .logged-in {
        .border-left(2px solid @dv-c-foreground);
        background: fade(@dv-c-background, 80%);
        padding: 6px 8px;
        .padding-left(12px);

        &::after {
            content: "";
            clear: both;
            display: table;
        }

        .log-out {
            .clicky;
            cursor: pointer;
            transition: color 0.125s ease-in;

            &:hover {
                color: @dv-c-red;
            }
        }

        .left {
            .float(left);
            margin-top: 8px;
            margin-bottom: 8px;
        }

        .right {
            @size: 48px;
            margin: 4px;
            .margin-left(8px);
            float: clear;
            border-radius: 50%;
            border: 1px solid @dv-c-foreground;
            width: @size;
            height: @size;

            &.discord-avatar {
                width: @size;
                height: @size;
                display: inline-block;
                text-align: center;
                line-height: @size;
                vertical-align: middle;
                font-size: 24px;
            }
        }

        @media @tablet {
            margin: 0;
            padding-top: 0;
            padding-bottom: 0;

            .right {
                @size: 32px;
                margin-top: 12px;
                float: clear;
                width: @size;
                height: @size;

                &.discord-avatar {
                    width: @size;
                    height: @size;
                }
            }
        }

        @media @mobile {
            margin: 0;
            padding-top: 0;
            padding-bottom: 0;

            .right {
                position: absolute;
                .right(2px);
            }
        }
    }
}

</style>
