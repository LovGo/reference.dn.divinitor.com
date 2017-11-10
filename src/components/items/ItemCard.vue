<template>
    <div class="item-card">
        <router-link :to="`/items/${itemId}`" tag="div">
            <div v-if="loading" class="loading">
                <div class="loader-box">
                    <div class="loader"></div>
                    <div class="label">Loading</div>
                </div>
            </div>
            <div v-else class="entry">
                <div class="icon">
                    <item-icon 
                        class="centering"
                        :iconIndex="itemData.iconIndex" 
                        :rank="itemData.rank"
                        :type="itemData.type.type"
                    ></item-icon>
                </div>
                <div class="title">
                    <div class="remark">
                        <span class="iid">#{{ itemId }}</span>
                    </div>
                    <div class="head">
                        {{ name }}
                    </div>
                    <div class="remark">
                        <span v-if="itemData.level > 1" class="level">{{ itemData.level }} </span> 
                        <span v-if="itemData.tier" class="tier" v-html="itemData.tier"></span>
                        <span :class="'rank-' + itemData.rank.toLowerCase()">{{ itemData.rank }}</span> 
                        <span v-if="canUse" class="can-use">{{ canUse }}</span>
                        <span v-if="itemData.cashItem" class="cash">Cash</span>
                        {{ category }}
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
import Vue from 'vue';
import ItemIcon from "@/components/game/ItemIcon";
import ItemStat from "@/api/item/itemstat";

import Item from "@/api/item/item";

Vue.component('item-icon', ItemIcon);

export default {
    props: ["itemId"],

    name: "item-page",
    props: ["itemId"],
    data: function() {
        return {
            loading: true,
            itemData: null,
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        itemId(to, from) {
            if (to != from) {
                this.fetchData();
            }
        }
    },
    computed: {
        name() {
            if (this.itemData.name) {
                if (this.itemData.name.name && this.itemData.name._NameID) {
                    return this.itemData.name.name;
                } else if (this.itemData.name._NameID) {
                    return "Item MID:" + this.itemData.name._NameID;
                }
            }
            
            return "Unnamed Item " + this.itemId;
        },
        canUse() {
            if (this.itemData.needClass) {
                return this.itemData.needClass.map(c => c.name).join("/");;
            }

            return null;
        },
        category() {
            if (this.itemData.category && this.itemData.category.name) {
                return this.itemData.category.name;
            }

            return "item";
        },
        statSet() {
            return ItemStat.joinStatSet(this.itemData.stats);
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.itemData = null;
            Item.getItem(this.itemId, this.$store.state.regionCode,
                (res) => {
                    this.itemData = res;
                    this.loading = false;
                },
                (err) => {

                });
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-card {
    padding: 4px 0 4px 10px;
    min-height: 64px;
    cursor: pointer;

    transition: background-color ease-in 0.125s;

    &:hover {
        background: rgba(0, 0, 0, 0.75);
    }

    .entry {
        position: relative;
        padding-left: 0;
        display: flex;
        flex-direction: row;

        .icon{ 
            flex: 0 1 50px;
            vertical-align: middle;
            
            .centering {
                position: absolute;
                top: 50%;
                transform: translate(0px, -50%);
            }
        }
        
        .title {
            flex: 1 1 auto;
            padding-left: 12px;
            padding-top: 8px;
            padding-bottom: 8px;

            .head {
                margin: -2px 0;
                padding: 0;
                font-size: 16px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                font-family: @dv-f-geomanist;
                color: @dv-c-foreground;
            }

            .remark {
                font-size: 12px;
                letter-spacing: 0.2em;
                text-transform: uppercase;

                .tier {
                    .uistring {
                        display: inline-block;
                    }
                }

                .level {
                    color: @dv-c-accent-2;
                    &::before {
                        content: "LV ";
                        font-size: 0.625em;
                        color: @dv-c-accent-1;
                    }
                }

                .can-use {
                    color: @dv-c-accent-2;
                }

                .cash {
                    color: #10A020;
                }
            }
        }
    }
}
</style>
