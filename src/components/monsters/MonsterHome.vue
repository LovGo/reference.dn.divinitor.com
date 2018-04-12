<template>
<div class="monsters-home">
    <h1>Monsters</h1>
    <div class="options-grid">
        <router-link :to="{name: 'monster-search'}" class="option">
            <h2 class="heading">
                Search
                <div class="icon fa fa-search "></div>
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

.monsters-home {
    position: relative;

    .option-toolkit {
        font-family: @dv-f-geomanist;
        letter-spacing: 0.2em;
        text-transform: uppercase;
    }
}

</style>
