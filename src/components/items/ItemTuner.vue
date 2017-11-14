<template>
<div class="tuner">
    <div class="tuner-id">#{{ tunerId }}</div>
    <transition name="fade">
        <div v-if="loading">

        </div>
    </transition>
    <transition name="fade" appear>
        <div v-if="!loading">
            Tuna
            {{ tunerData }}
        </div>
    </transition>
</div>
</template>

<script>
import Vue from 'vue';
import ItemIcon from "@/components/game/ItemIcon";
import ItemStat from "@/api/item/itemstat";

import Item from "@/api/item/item";

Vue.component('item-icon', ItemIcon);

export default {
    props: ["tunerId"],
    data: function() {
        return {
            loading: true,
            tunerData: null
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.tunerData = null;
            Item.getTunerInfo(this.tunerId, this.$store.state.regionCode,
                (res) => {
                    this.tunerData = res;
                    this.loading = false;
                },
                (err) => {

                });
        },
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.tuner {
    position: relative;
    padding-top: 18px;

    .tuner-id {
        color: @dv-c-body;
        position: absolute;
        top: -4px;
        font-size: 12px;
        letter-spacing: 0.1em;
    }

}
</style>
