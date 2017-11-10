<template>
    <div class="single">
        <item-view :itemId="itemId"></item-view>
    </div>
</template>

<script>
import Vue from 'vue';
import Item from '@/components/items/Item'

Vue.component('item-view', Item);

export default {
    name: "single-item-view",
    data: function() {
        return {
            itemId: this.$route.params.itemId
        }
    },
    watch: {
        '$route'(to, from) {
            this.itemId = to.params.itemId;
        }
    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.single {
    width: 100%;
}

</style>
