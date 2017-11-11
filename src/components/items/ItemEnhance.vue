<template>
<div class="enhance">
    <div class="enhance-id">#{{ enhanceId }}</div>
    +{{level}}
    <button v-on:click="test">Test</button>
    <button v-on:click="reset">Reset</button>
    <transition name="fade">
        <div v-if="loading">

        </div>
    </transition>
    <transition name="fade">
        <div v-if="!loading">
            Can be enhanced up to <b>+{{maxLevel }}</b>

            <div class="options">
                <input type="checkbox" v-model="useGoldenGoose" name="goldenGoose" />
                <label for="goldenGoose">Use Golden Goose 50% benefit</label>
            </div>

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
    props: ["enhanceLevel", "enhanceId"],
    data: function() {
        return {
            level: this.enhanceLevel,
            loading: true,
            horizontal: false,
            useGoldenGoose: true,
            enhanceData: null
        };
    },
    created() {
        this.fetchData();
    },
    watch: {
        enhanceId(to, from) {
            if (to != from) {
                this.fetchData();
            }
        },
        enhanceLevel(to, from) {
            this.level = to;
        }
    },
    computed: {
        maxLevel() {
            return this.enhanceData[this.enhanceData.length - 1].level;
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.enhanceData = null;
            Item.getEnhancementInfo(this.enhanceId, this.$store.state.regionCode,
                (res) => {
                    this.enhanceData = res;
                    this.loading = false;
                },
                (err) => {

                });
        },
        updateLevel(newLevel) {
            this.level = newLevel;
            this.$emit("levelUpdate", this.level);
        },
        test() {
            this.updateLevel(this.level + 1);
        },
        reset() {
            this.updateLevel(0);
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.enhance {
    position: relative;
    padding-top: 18px;

    .enhance-id {
        color: @dv-c-body;
        position: absolute;
        top: -4px;
        font-size: 12px;
        letter-spacing: 0.1em;
    }
}
</style>
