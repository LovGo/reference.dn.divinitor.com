<template>
    <div>
      <router-view></router-view>
    </div>
</template>

<script>
import Vue from 'vue';
import Item from '@/components/items/Item'

export default {
    name: "items",
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

</style>
