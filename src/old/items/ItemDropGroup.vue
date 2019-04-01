<template>
    <div class="itemdropgroup">
        <div class="prompt">
            <label for="dropgroupid">Drop Group ID</label>
            <input type="text" placeholder="Enter Drop Group ID" v-model="dropGroupId" id="dropgroupid" />
        </div>
        <div v-if="loading" class="loading">
            <load-indicator
            loadText="Item Drop Group"></load-indicator>
        </div>
        <div v-if="groups">
            <p>Group {{ dropGroupId }}</p>
            <div class="group-list">
                <div class="group-entry" v-for="g in groups" :key="g.difficulty">
                    <h3 v-if="groups.length < 1">Difficulty {{g.difficulty}}</h3>
                    <div class="drop-entry-list">
                        <div class="drop-entry" v-for="(e, i) in g.entries" :key="i" v-if="e.items.length">
                            <p>
                                <span v-if="e.expectation >= 1">
                                    <strong>{{Math.floor(e.expectation)}}x</strong>
                                    <span v-if="e.expectation != Math.floor(e.expectation)"> +
                                        <strong>{{e.expectation - Math.floor(e.expectation) | rate}}%</strong>
                                        chance of an extra drop
                                    </span>
                                </span>
                                <span v-else>
                                    <strong>{{e.expectation | rate}}%</strong> chance to appear
                                </span>
                            </p>
                            <div class="item-list">
                                <div class="entry" 
                                    v-for="(e, key) in e.items" 
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
                </div>

            </div>
        </div>
        <div v-if="error">
            {{ error }}
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

Vue.component('item-icon', ItemIcon);
Vue.component('item-icon-tooltip', ItemIconTooltip);
Vue.component('item-card', ItemCard);

export default {
    data: function() {
        return {
            dropGroupId: this.$route.params.id,
            loading: true,
            groups: null,
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
            this.dropGroupId = this.$route.params.id;
        },
        dropGroupId(to, from) {
            if (to != from) {
                const val =  this.dropGroupId;
                if (!val || val.length == 0) {
                    this.$router.push({ 
                        name: 'item-drop-group',
                    });
                } else {
                    this.$router.push({ 
                        name: 'item-drop-group', 
                        params: {
                            id: val,
                        }
                    });
                }

                this.fetchData();
            }
        }
    },
    methods: {
        fetchData() {
            this.error = null;
            this.groups = null;
            if (!this.dropGroupId) {
                this.loading = false;
                return;
            }

            this.loading = true;
            Item.getItemDropGroup(this.dropGroupId, this.$store.state.regionCode,
                (res) => {
                    this.groups = res;
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

.itemdropgroup {

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
