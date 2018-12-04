<template>
<div id="app" :embed="embedded">
    <div class="header" v-if="!embedded">
        <div class="header-left">
            <router-link to="/" class="header-link">
                <h1>Divinitor Minerva</h1>
                <div class="subtitle">Dragon Nest Game Reference</div>
            </router-link>
        </div>
        <div class="mobile-header-right mobile-only">
            <navigation-pane />
        </div>
    </div>

    <div class="auth-box" v-if="!hideAuth">
        <site-auth-header />
    </div>

    <div class="region-indicator">
        <region-header />
    </div>



    <first-run v-if="showFirstRun" />

    <div class="appbody" :embed="embedded">
        <div class="embedded-header" v-if="embedded">
            Divinitor Minerva
        </div>
        
        <div class="flex-box">
            <div class="left-pane mobile-hide" v-if="!embedded">
                <navigation-pane />
            </div>
            <div class="main-pane">
                <loader v-if="showRouteLoader" load-text="Fetching bits and pieces" />
                <router-view v-else/>
            </div>
        </div>
    </div>

    <div class="copyright">
        Vahrhedral and Divinitor &copy; 2018 Vahrheit<br/>
        Dragon Nest &copy; 2018 Eyedentity Games, Inc.<br/>
        Divinitor makes no claims of ownership<br/>
        of content sourced from Dragon Nest
    </div>
    <div class="in-dev">
        UNDER DEVELOPMENT
    </div>
    <div class="startup" :started="started">
        <div class="container">
            <div class="sub">Divinitor</div>
            <div class="title">Minerva</div>
            <div class="detail">Now loading</div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "./store";

import FirstRun from "@/views/FirstRun.vue";
import NavigationPane from "@/components/site/NavigationPane.vue";
import SiteAuthHeader from "@/components/auth/SiteAuthHeader.vue";
import RegionHeader from "@/components/region/RegionHeader.vue";
import Loader from "@/components/util/Loader.vue";

export default Vue.extend({
    name: "app",
    components: {
        FirstRun,
        NavigationPane,
        SiteAuthHeader,
        RegionHeader,
        Loader,
    },
    data() {
        return {
            started: false,
        };
    },
    computed: {
        embedded(): boolean {
            return !!this.$route.query.embed;
        },
        showFirstRun(): boolean {
            return !this.embedded && this.$store.getters.showFirstRun && !this.isRedeemingCode;
        },
        isRedeemingCode(): boolean {
            return this.$route.matched.some((r) => r.meta.redemption);
        },
        showRouteLoader(): boolean {
            return this.$store.state.pageLoading;
        },
        hideAuth(): boolean {
            return this.$route.meta.redemption;
        }
    },
    mounted() {
        const shade = document.getElementById("startup-shade");
        if (shade) {
            window.setTimeout(() => {
                shade.classList.add("hidden");
            }, 500);
        }

        this.started = true;
    },
    methods: {
    }
});
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
    width: 900px;
    border-left: @dv-c-foreground solid 1px;
    border-right: @dv-c-foreground solid 1px;
    margin: 0 auto;

    // background-image: linear-gradient(rgba(5, 10, 13, 0.5), rgba(5, 10, 13, 0.9)), url("https://static.divinitor.com/site/common/img/dv-masthead-bg-static-merged-darkblur.png");
    // background-image: url("https://static.divinitor.com/site/common/img/dv-masthead-bg-static-merged-darkblur-darkened.png");
    
    background-image: url("assets/dv-masthead-bg-static-merged-darkblur-darkened.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 62.5% 70%;
    background-color: @dv-c-background;
    background-attachment: fixed;
    overflow-x: hidden;
    overflow-y: auto;
}

#app[embed] {
    background-color: @dv-c-background;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.appbody {
    transition: opacity ease-in 1s;
    padding: 20px 20px;
    padding-right: 40px;

    &[embed] {
        .locale-select {
            top: 40px;
        }
    }

    .embedded-header {
        position: absolute;
        top: 12px;
        left: 24px;
        white-space: nowrap;

        font-family: @dv-f-geomanist;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        color: @dv-c-accent-1;
    }
}

.startup[started="true"] {
    opacity: 0.0;
    transition: opacity ease-in 0.5s;
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
        min-width: 0;
    }
}

.header {
    display: block;
    margin: 14px 20px;
    position: relative;
    user-select: none;
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

    .header-left {
        .header-link {
            display: block;
            max-width: 300px;
        }
    }

    .mobile-header-right {
        position: absolute;
        top: 0;
        right: 0;
    }
}

.auth-box {
    position: absolute;
    top: 46px;
    right: 20px;
    .log-in-container {
        padding-top: 10px;
    }
}

.region-indicator {
    position: absolute;
    top: 14px;
    right: 20px;
}

.copyright {
    display: block;
    font-size: 10px;
    font-family: @dv-f-lato;
    color: @dv-c-disabled;
    text-align: right;
    position: absolute;
    bottom: 20px;
    right: 20px;
}

.in-dev {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color: @dv-c-red;
    color: @dv-c-background;
    font-size: 18px;
    padding: 4px 0;
    z-index: 9999;
    font-weight: bold;
}

.mobile-only {
    display: none;
}

@media @wide-desktop {
    body {
        width: 1200px;
    }

    .header {
        width: 300px;
    }
    
    .auth-box {
        right: 40px;
    }

    .region-indicator {
        right: 40px;
    }
}

@media @tablet {
    body {
        width: 100%;
        border: none;
        padding: 0;
        // background-image: linear-gradient(rgba(5, 10, 13, 0.75), rgba(5, 10, 13, 0.75)), url("https://static.divinitor.com/site/common/img/dv-masthead-bg-static-merged-darkblur.png");
        background-image: linear-gradient(rgba(5, 10, 13, 0.75), rgba(5, 10, 13, 0.75)), url("assets/dv-masthead-bg-static-merged-darkblur-darkened.png");
    }
    
    .copyright {
        right: 20px;
    }
}

@media @mobile {
    .header {
        margin-bottom: 70px;
        .header-link {
            width: 210px;
        }
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

    .auth-box {
        left: 20px;
        top: 80px;
    }

    .region-indicator {
        top: 58px;
        left: 20px;
        right: initial;
    }
}

.wip-overlay {
    position: fixed;
    text-align: center;
    left: 0;
    right: 0;
    top: 28px;
    font-size: 16px;
    opacity: 0.025;
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
    position: relative;
}
</style>
