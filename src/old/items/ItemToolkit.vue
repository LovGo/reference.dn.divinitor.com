<template>
    <div class="item-toolkit">
        <router-link :to="{name: 'item-toolkit'}">Back to Toolkit</router-link>
        <router-view></router-view>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-toolkit {
    .router-link-exact-active {
        display: none;
    }
}

</style>
