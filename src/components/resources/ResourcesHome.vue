<template>
<div class="resources-home">
    <h1>Game Resources</h1>
    <div class="options-grid">
        <router-link :to="{name: 'resource-chat'}" class="option">
            <h2 class="heading">
                Game Chat
                <div class="icon fa fa-comments "></div>
            </h2>
        </router-link>
    </div>

    <h2>Client Resources</h2>
    <div class="options-list">
        <router-link to="/resources/downloadgame" class="option">
            <div class="icon fa fa-download"></div>
            <div class="content">
                <div class="title">Download game client</div>
                <div class="description">Download base game client files for a new installation. Patching will be required.</div>
            </div>
        </router-link>
        <!-- <router-link to="/resources/clientpatch" class="option">
            <div class="icon fa fa-copy"></div>
            <div class="content">
                <div class="title">Patch files</div>
                <div class="description">Download, inspect, and verify individual game patch files</div>
            </div>
        </router-link> -->
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.resources-home {
    position: relative;

    .option-toolkit {
        font-family: @dv-f-geomanist;
        letter-spacing: 0.2em;
        text-transform: uppercase;
    }
}

</style>
