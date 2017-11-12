<template>
    <div id="app">
        <div class="wip-overlay">
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
            WORK IN PROGRESS<br/>
        </div>
        <locale-select></locale-select>
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

Vue.component('navigation-pane', NavigationPane);
Vue.component('locale-select', LocaleSelect);

export default {
    name: 'app'
}
</script>

<style lang="less">
@import "less/core.less";

html {
    background-image: url("https://static.divinitor.com/site/common/img/dv-masthead-bg-static-merged.png");
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

    background-image: linear-gradient(rgba(5, 10, 13, 0.5), rgba(5, 10, 13, 0.9)), url("https://static.divinitor.com/site/common/img/dv-masthead-bg-static-merged-darkblur.png");
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
    top: 0;
    font-size: 100px;
    opacity: 0.02;
    // opacity: 0.0;
    pointer-events: none;
}

</style>
