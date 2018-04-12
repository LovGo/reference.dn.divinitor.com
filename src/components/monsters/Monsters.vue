<template>
    <div class="monsters-root">
      <router-view></router-view>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    name: "monsters",
    data: function() {
        return {
        }
    },
    methods: {
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";
.monsters-root {
    position: relative;
    width: 100%;
}
</style>
