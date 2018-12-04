<template>
    <div class="resources-root">
      <router-view></router-view>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    name: "resources",
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
.resources-root {
    position: relative;
    width: 100%;
}
</style>
