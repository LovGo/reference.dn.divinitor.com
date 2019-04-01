<template>
    <div class="itemdrop">
        <div v-if="loading" class="loading">
            <load-indicator
            loadText="Item Drop"></load-indicator>
        </div>
        <div v-if="drops">
            <responsive-card-list :count="drops.length">
                <responsive-card-list-entry 
                    v-for="(e, key) in drops" 
                    :key="key">
                    <item-card 
                        :itemId="e.item.id"
                        :itemStub="e.item"
                        :count="e.count"
                        :timeLimit="e.durationDays"
                        :goldAmt="e.gold / 10000"
                        :rate="e.rate"
                    />
                </responsive-card-list-entry>
            </responsive-card-list>
            <!-- <div class="item-list" :long="drops.length > 6">
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
            </div> -->
        </div>
    </div>
</template>

<script>

import Vue from 'vue';
import ItemIcon from "@/old/game/ItemIcon";
import ItemIconTooltip from "@/old/items/ItemIconTooltip";
import ItemCard from "@/old/items/ItemCard";
import ItemStat from "@/old/api/item/itemstat";

import Item from "@/old/api/item/item";
import ItemFilter from "@/old/api/item/itemfilter";
import ResponsiveCardList from "@/components/util/ResponsiveCardList.vue";
import ResponsiveCardListEntry from "@/components/util/ResponsiveCardListEntry.vue";

Vue.component('item-icon', ItemIcon);
Vue.component('item-icon-tooltip', ItemIconTooltip);
Vue.component('item-card', ItemCard);

export default {
    components: {
        ResponsiveCardList,
        ResponsiveCardListEntry,
    },
    props: ["dropId"],
    data: function() {
        return {
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
        dropId(to, from) {
            if (to != from) {
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

        &[long] {
            border-top: 2px solid @dv-c-accent-1;
            border-bottom: 2px solid @dv-c-accent-1;
            overflow-y: scroll;
        }

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
                flex: 0 1 460px;
                .border-left(none);
                &:first-child,
                &:nth-child(2) {
                    border-top-color: @dv-c-foreground;
                }
                &:nth-child(2n + 1) {
                    .border-left(1px solid @dv-c-foreground);
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
