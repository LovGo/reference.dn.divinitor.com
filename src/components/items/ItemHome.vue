<template>
<div class="item-home">
    <h1>Items</h1>
    <div class="options-grid">
        <router-link :to="{name: 'item-search'}" class="option">
            <h2 class="heading">
                Search
                <div class="icon fa fa-search"></div>
            </h2>
        </router-link>
        <router-link :to="{name: 'item-cash-shop'}" class="option">
            <h2 class="heading">
                Cash Shop
                <div class="icon fa fa-dollar"></div>
            </h2>
        </router-link>
        <router-link :to="{name: 'item-npc-shop'}" class="option">
            <h2 class="heading">
                NPC Shops
                <div class="icon fa fa-user"></div>
            </h2>
        </router-link>
        <router-link :to="{name: 'item-crafting'}" class="option">
            <h2 class="heading">
                Crafting
                <div class="icon fa fa-refresh"></div>
            </h2>
        </router-link>
    </div>
    
    <router-link :to="{name: 'item-toolkit'}" class="option-toolkit">
            <div class="icon fa fa-bars"></div>
            Toolkit
    </router-link>
</div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-home {
    position: relative;

    .option-toolkit {
        font-family: @dv-f-geomanist;
        letter-spacing: 0.2em;
        text-transform: uppercase;
    }
}

</style>
