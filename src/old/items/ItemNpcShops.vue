<template>
<div class="item-npc-shop">
    <h1>NPC Shops</h1>
    <div class="go-back"
        v-on:click="goBack">
        <i class="fa fa-angle-double-left"></i>Back
    </div>
    <div class="warn toast">
        <div class="content">
            <div class="heading">Coming Soon</div>
            <p>This feature is currently under development</p>
        </div>
    </div>
</div>
</template>

<script>
export default {

  methods: {
    fetchData() {
    },
    goBack() {
        this.$router.back();
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-npc-shop {
    position: relative;
}
</style>
