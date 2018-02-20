<template>
    <div class="itemdrop">
        <div class="prompt">
            <label for="dropid">Drop ID</label>
            <input type="text" placeholder="Enter Drop ID" v-model="dropId" id="dropid" />
        </div>
        <div v-if="loading" class="loading">
            <load-indicator
            loadText="Item Drop"></load-indicator>
        </div>
        <div v-if="drops">
            <div class="item-list">
                <div class="entry" 
                    v-for="(e, key) in drops" 
                    :key="key">
                    <item-card 
                        :itemId="e.item.id"
                        :itemStub="e.item"
                        :count="e.count"
                        :timeLimit="e.durationDays"
                        :goldAmt="e.gold / 10000"
                        :rate="e.rate"
                    ></item-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import Vue from 'vue';
import ItemIcon from "@/components/game/ItemIcon";
import ItemIconTooltip from "@/components/items/ItemIconTooltip";
import ItemCard from "@/components/items/ItemCard";
import ItemStat from "@/api/item/itemstat";

import Item from "@/api/item/item";
import ItemFilter from "@/api/item/itemfilter";

Vue.component('item-icon', ItemIcon);
Vue.component('item-icon-tooltip', ItemIconTooltip);
Vue.component('item-card', ItemCard);

export default {
    data: function() {
        return {
            dropId: this.$route.params.id,
            loading: true,
            drops: null,
            error: null,
            filter: ItemFilter.defaultFilter(),
        }
    },
    created() {
        this.fetchData();
    },
    computed: {
    },
    watch: {
        '$route'(to, from) {
            this.dropId = this.$route.params.id;
        },
        dropId(to, from) {
            if (to != from) {
                this.$router.push({ 
                    name: 'item-drop', 
                    params: {
                        id: this.dropId
                    }
                });

                this.fetchData();
            }
        }
    },
    methods: {
        fetchData() {
            this.error = null;
            this.drops = null;
            if (!this.dropId) {
                this.loading = false;
                return;
            }

            this.loading = true;
            Item.getItemDrop(this.dropId, this.$store.state.regionCode,
                (res) => {
                    this.drops = res;
                    this.loading = false;
                    this.error = null;
                },
                (err) => {
                    this.loading = false;
                    this.error = err;
                });
        }
    },
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.itemdrop {
    
    .item-list {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        max-height: 500px;
        overflow-y: scroll;
        border-top: 2px solid @dv-c-accent-1;
        border-bottom: 2px solid @dv-c-accent-1;

        .result {
            &.no {
                display: none;
            }

            &:first-child.no {
                display: block;
            }
        }

        .entry {
            flex: 1 1 380px;
            border: 1px solid @dv-c-foreground;
            border-top-color: transparent;

            &:first-child {
                border-top-color: @dv-c-foreground;
            }

            @media only screen and (min-width:@min-desktop-wide-width) {
                flex: 0 1 470px;
                border-left: none;
                &:first-child,
                &:nth-child(2) {
                    border-top-color: @dv-c-foreground;
                }
                &:nth-child(2n + 1) {
                    border-left: 1px solid @dv-c-foreground;
                }
                &:last-child {
                    // border-right: 1px solid @dv-c-foreground;
                }
                &:first-child:last-child {
                    // border-right: 1px solid @dv-c-foreground;
                }

            }
        }
    }
}
</style>
