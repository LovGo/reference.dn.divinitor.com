<template>
    <div class="itempage">
        <div v-if="loading" class="loading">
            <div class="loader-box">
                <div class="loader"></div>
                <div class="label">Loading</div>
            </div>
        </div>
        <div v-else>
            <div class="header">
                <div class="icon">
                    <item-icon 
                        class="centering"
                        :iconIndex="itemData.iconIndex" 
                        :rank="itemData.rank"
                        :type="itemData.type.type"
                        :count="itemData.maxStack"
                        :enhanceLvl="enhanceLevel"
                    ></item-icon>
                </div>
                <div class="title">
                    <div class="remark">
                        <span class="iid">#{{ itemId }}</span>
                    </div>
                    <h2 class="head">
                        <span class="enhance" v-if="enhanceLevel > 0">+{{ enhanceLevel }}</span>
                        {{ name }}
                    </h2>
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


            <div class="desc-model-container">
                <div class="info-top">
                    <div class="attributes">
                        <div class="attrib" v-if="itemData.durationDays">
                            <div class="icon"><i class="fa fa-clock-o"></i></div>
                            {{ itemData.durationDays }} days
                        </div>
                        <div v-if="itemData.cashItem">
                            <div class="attrib" v-if="itemData.canTrade">
                                <div class="icon"><i class="fa fa-exchange"></i></div>
                                {{ itemData.listings }} listings
                            </div>
                            <div class="attrib" v-else>
                                <div class="icon"><i class="fa fa-chain"></i></div>
                                Untradable
                            </div>
                        </div>
                        <div v-else>
                            <div class="attrib" v-if="itemData.canTrade">
                                <div class="icon"><i class="fa fa-exchange"></i></div>
                                Tradable
                            </div>
                            <div class="" v-else>
                                <div class="attrib" v-if="itemData.unstampCount > 0">
                                    <div class="icon"><i class="fa fa-unlink"></i></div>
                                    Unbind {{ itemData.unstampCount }}x
                                </div>
                                <div class="attrib" v-else>
                                    <div class="icon"><i class="fa fa-chain"></i></div>
                                    Untradable
                                </div>
                            </div>
                        </div>
                        <div class="attrib" v-if="itemData.canServerStorage">
                            <div class="icon"><i class="fa fa-suitcase"></i></div>
                            Server Storagable
                        </div>
                        <div class="attrib" v-else>
                            <div class="icon"><i class="fa fa-lock"></i></div>
                            Character Bound
                        </div>
                        <div class="attrib" v-if="!itemData.canDestroy && !itemData.cashItem">
                            <div class="icon"><i class="fa fa-minus-circle"></i></div>
                            Cannot be destroyed
                        </div>
                        <div class="attrib" v-if="itemData.npcSellAmount">
                            <div class="icon"><i class="fa fa-dollar"></i></div>
                            NPC for {{ itemData.npcSellAmount | gold }}
                        </div>
                    </div>

                    <div class="stat-stack">
                        <div class="stats" v-if="itemData.stats.length">
                            <div class="stat-entry" v-for="(value, key) in statSet" :key="key">
                                {{key}} {{value}}
                            </div>
                        </div>
                    </div>

                    <div class="desc">
                        <div v-if="itemData.desc" v-html="itemData.desc.desc"></div>
                        <div v-else>No description</div>
                    </div>
                </div>
                <div class="model-view" v-if="hasModel">
                    3D VIEW PLACEHOLDER
                </div>
            </div>

            <div class="section" v-if="itemData.enchantId">
                <div class="title">Enhancement</div>
            </div>
            <div class="section" v-if="itemData.extract">
                <div class="title">Extraction</div>
                Extracting at +{{enhanceLevel}} costs <b>{{ itemData.extract.cost | gold }}</b> and can give:

                <div class="item-list" v-if="itemData.extract.results[enhanceLevel]">
                    <div class="entry" v-for="(iid, key) in itemData.extract.results[enhanceLevel]" :key="key">
                        <item-card :itemId="iid"></item-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import ItemIcon from "@/components/game/ItemIcon";
import ItemCard from "@/components/items/ItemCard";
import ItemStat from "@/api/item/itemstat";

import Item from "@/api/item/item";

Vue.component('item-icon', ItemIcon);
Vue.component('item-card', ItemCard);

export default {
    name: "item-page",
    props: ["itemId"],
    data: function() {
        return {
            loading: true,
            itemData: null,
            enhanceLevel: 0,
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
        hasModel() {
            // TODO
            let t = this.itemData.type.type;
            return t === "PARTS" || t === "WEAPON";
        },
        statSet() {
            return ItemStat.joinStatSet(this.itemData.stats);
        },
        enhanceSet() {
            return {};
        },
        combineSet() {
            return ItemStat.joinStatSet(this.itemData.stats.concat([]));
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.enhanceLevel = 13;
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

.itempage {
    width: 100%;
    .header {
        position: relative;
        width: 100%;
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
            margin-left: 10px;
            border-left: 2px solid @dv-c-accent-1;
            padding-left: 12px;
            padding-top: 8px;
            padding-bottom: 8px;

            .head {
                margin: -4px 0;
                padding: 0;
                font-size: 24px;
            }

            .remark {
                font-size: 12px;
                letter-spacing: 0.2em;
                text-transform: uppercase;

                .tier {
                    display: inline-block;
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

    .section {
        position: relative;
        margin-top: 25px;
        border-top: 1px solid @dv-c-accent-1;
        padding-top: 4px;
        .title {
            font-size: 12px;
            color: @dv-c-accent-1;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            position: absolute;
            top: -1.3em;
            left: 0;
        }
    }

    .attrib {
        flex: 0 1 auto;
        margin: 0 8px;
        // &:first-child {
        //     margin-left: 0;
        // }
        // &:last-child {
        //     margin-right: 0;
        // }
        .icon {
            display: inline-block;
        }
    }

    .desc-model-container {
        display: flex;
        flex-direction: row;

        @3d-size: 256px;
        
        @media only screen and (max-width: (@3d-size * 3)) {
            flex-wrap: wrap;
        }

        .info-top {
            flex: 1 1 auto;

            .attributes {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

            }

            .desc {
                position: relative;
                margin-top: 25px;
                border-top: 1px solid @dv-c-accent-1;
                padding-top: 4px;
                &::before {
                    content: "Description";
                    font-size: 12px;
                    color: @dv-c-accent-1;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    position: absolute;
                    top: -1.3em;
                    left: 0;
                }

                .uistring .format-h {
                    font-style: italic;
                    color: @dv-c-body;
                }
            }

            .stats {
                position: relative;
                margin-top: 25px;
                border-top: 1px solid @dv-c-accent-1;
                padding-top: 4px;
                &::before {
                    content: "Stats";
                    font-size: 12px;
                    color: @dv-c-accent-1;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    position: absolute;
                    top: -1.3em;
                    left: 0;
                }
            }
        }

        .model-view {
            flex: 0 0 @3d-size;
            height: @3d-size;
            text-align: center;
            vertical-align: middle;
            border: 1px solid @dv-c-accent-1;
            margin-left: 30px;
        }
    }

    .item-list {
        margin-top: 10px;

        .entry {
            border: 1px solid @dv-c-foreground;
            border-bottom-color: transparent;
            &:last-child {
                border-bottom-color: @dv-c-foreground;
            }
        }
    }
}
</style>
