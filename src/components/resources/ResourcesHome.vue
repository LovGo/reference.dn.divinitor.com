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
    
    <!-- <router-link :to="{name: 'resource-toolkit'}" class="option-toolkit">
            <div class="icon fa fa-bars"></div>
            Toolkit
    </router-link> -->
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
