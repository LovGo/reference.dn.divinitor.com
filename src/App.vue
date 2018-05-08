<template>
    <div id="app">
        <div class="wip-overlay">
            WORK IN PROGRESS<br/>
            <!-- WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/> -->
        </div>
        <update-toast v-if="authenticated"></update-toast>
        <locale-select></locale-select>
        <div class="auth">
            <div class="hello" v-if="authenticated">
                Hello, {{authInfo.username}} 
                <button class="small-button" v-on:click="logOut">Log Out</button>
                <br/>
                If you see 401 Unauthorized, relog.
                <div class="test-overlay">
                    AUTHORIZED TEST ACCOUNT
                </div>
            </div>
            <div v-else>
                <router-link to="/auth">DV-Testers log in here</router-link>
            </div>
        </div>
        <div class="flex-box">
            <div class="left-pane mobile-hide">
                <navigation-pane></navigation-pane>
            </div>
            <div class="main-pane">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import NavigationPane from '@/components/NavigationPane';
import LocaleSelect from '@/components/LocaleSelect';
import UpdateToast from '@/components/UpdateToast';
import * as MT from '@/store/mutation-types';

Vue.component('navigation-pane', NavigationPane);
Vue.component('locale-select', LocaleSelect);
Vue.component('update-toast', UpdateToast);

export default {
    name: 'app',
    computed: {
        authenticated() {
            return this.$store.getters.isAuthed;
        },
        authInfo() {
            return this.$store.getters.authInfo;
        }
    },
    methods: {
        logOut() {
            this.$store.commit(MT.AUTH_CLEAR);
            this.$router.replace("/");
        }
    }
}
</script>

<style lang="less">
@import "less/core2.less";

html {
    // background-image: url("https://static.divinitor.com/site/common/img/dv-masthead-bg-static-merged.png");
    background-image: url("assets/dv-masthead-bg-static-merged-bloomed.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 62.5% 70%;
    background-color: @dv-c-background;
    background-attachment: fixed;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100%;

    position: relative;
    margin: 0;
    padding: 0;
    overflow-y: scroll;
}

body {
    position: relative;
    min-height: 100vh;
    padding: 0;
    padding-right: 20px;
    width: 900px;
    border-left: @dv-c-foreground solid 1px;
    border-right: @dv-c-foreground solid 1px;
    margin: 0 auto;

    // background-image: linear-gradient(rgba(5, 10, 13, 0.5), rgba(5, 10, 13, 0.9)), url("https://static.divinitor.com/site/common/img/dv-masthead-bg-static-merged-darkblur.png");
    background-image: url("https://static.divinitor.com/site/common/img/dv-masthead-bg-static-merged-darkblur-darkened.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 62.5% 70%;
    background-color: @dv-c-background;
    background-attachment: fixed;
    overflow-x: hidden;
    overflow-y: auto;
}

#app {
    padding: 20px 20px;
}

.flex-box {
    display: flex;
    width: 100%;
    .left-pane {
        order: 1;
        flex-basis: auto;
        padding-right: 14px;
        flex: 0 0 166px;
    }

    .main-pane {
        order: 1;
        padding-left: 14px;
        flex: 1;
        margin-bottom: 70px;
    }
}

.header {
    padding: 14px 20px;
    width: 50%;
    h1 {
        margin: 0;
        color: @dv-c-foreground;
        font-weight: normal;
        font-size: 20px;
        padding: 0 0 0.5em 0;
    }

    .subtitle {
        font-family: @dv-f-geomanist;
        color: @dv-c-accent-1;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin: 0;
    }
}

.copyright {
  font-size: 10px;
  font-family: @dv-f-lato;
  color: @dv-c-disabled;
  text-align: right;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

@media only screen and (min-width:@min-desktop-wide-width) {
    body {
        width: 1200px;
    }
}

@media only screen and (max-width: 1024px) {
    body {
        width: 100%;
        border: none;
        padding: 0;
        background-image: linear-gradient(rgba(5, 10, 13, 0.75), rgba(5, 10, 13, 0.75)), url("https://static.divinitor.com/site/common/img/dv-masthead-bg-static-merged-darkblur.png");
    }

    .copyright {
        right: 20px;
    }
}

@media only screen and (max-width: 650px) {
    .header {
        width: 100%;

        h1 {
            font-size: 14px;
        }
    }

    .flex-box {
        .main-pane {
            padding-left: 0;
        }
    }

    .mobile-only {
        display: block;
    }

    .mobile-hide {
        display: none;
    }
    
    .copyright {
        margin-top: 20px;
        position: relative;
    }
}

.wip-overlay {
    position: fixed;
    text-align: center;
    left: 0;
    right: 0;
    top: 28px;
    font-size: 60px;
    opacity: 0.05;
    // opacity: 0.0;
    pointer-events: none;
}

.small-button {
    padding: 4px 8px;
    font-size: 12px;
    height: auto;
    margin: 4px 0;
}

.hello {
    border: 1px solid @dv-c-foreground;
    padding: 8px 12px;
    position: relative;
    margin-bottom: 20px;

    .test-overlay {
        position: absolute;
        color: @dv-c-green;
        font-size: 48px;
        top: 0;
        bottom: 0;
        right: 14px;
        text-align: right;
        pointer-events: none;
        opacity: 0.1;
    }
}
</style>
