<template>
    <div class="itempage">
        <transition name="fade">
            <div v-if="loading" class="loading">
                <div class="loader-box">
                    <div class="loader"></div>
                    <div class="label">
                        Loading<br/>
                        #{{ itemId }}
                    </div>
                </div>
            </div>
        </transition>
        <div v-if="!loading">
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
                            <div class="attrib" v-if="itemData.canTrade && !forceBound">
                                <div class="icon"><i class="fa fa-exchange"></i></div>
                                Tradable
                            </div>
                            <div class="" v-else>
                                <div class="attrib tooltip" v-if="itemData.unstampCount > 0">
                                    <div class="icon"><i class="fa fa-unlink"></i></div>
                                    Unbind {{ itemData.unstampCount }}x
                                    <div class="tooltext">
                                        <div class="content">Uses {{ unstampAmt }} stamps</div>
                                    </div>
                                </div>
                                <div class="attrib" v-else>
                                    <div class="icon"><i class="fa fa-chain"></i></div>
                                    Untradable
                                </div>
                            </div>
                        </div>
                        <div class="attrib" v-if="itemData.canServerStorage && !forceBound">
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
                            <div class="icon">
                                <i class="fa fa-dollar"></i>
                                <i class="fa fa-dollar" v-if="itemData.npcSellAmount >= 10000000"></i>
                                <i class="fa fa-dollar" v-if="itemData.npcSellAmount >= 100000000"></i>
                            </div>
                            NPC for {{ itemData.npcSellAmount | gold }}
                        </div>
                    </div>
                    <!-- {{ itemData.type.type }} -->

                    <div class="stat-stack">
                        <div class="stats" v-if="itemData.stats.length">
                            <div class="stat-entry" v-for="(value, key) in statSet" :key="key">
                                {{key}} {{value}}
                            </div>
                            <div class="gems" v-if="itemData.gemslots">
                                <div 
                                    class="skill gemslot tooltip" 
                                    v-if="itemData.gemslots.skill" 
                                    :style="`background: url('/api/server/${region}/dds/uit_re_itemjewelslot03/png') 1px 0, url('/api/server/${region}/dds/uit_itemslot_re01_d/png') -4px -4px;`">
                                    <div class="count" v-if="itemData.gemslots.skill > 1">
                                        x{{itemData.gemslots.skill}}
                                    </div>
                                    <div class="tooltext">
                                        <div class="content">Skill gem</div>
                                    </div>
                                </div>
                                <div 
                                    class="offensive gemslot tooltip" 
                                    v-if="itemData.gemslots.offensive" 
                                    :style="`background: url('/api/server/${region}/dds/uit_re_itemjewelslot02/png') 1px 0, url('/api/server/${region}/dds/uit_itemslot_re01_d/png') -4px -4px;`">
                                    <div class="count" v-if="itemData.gemslots.offensive > 1">
                                        x{{itemData.gemslots.offensive}}
                                    </div>
                                    <div class="tooltext">
                                        <div class="content">Offensive gem</div>
                                    </div>
                                </div>
                                <div 
                                    class="defensive gemslot tooltip" 
                                    v-if="itemData.gemslots.defensive" 
                                    :style="`background: url('/api/server/${region}/dds/uit_re_itemjewelslot01/png') 1px 0, url('/api/server/${region}/dds/uit_itemslot_re01_d/png') -4px -4px;`">
                                    <div class="count" v-if="itemData.gemslots.defensive > 1">
                                        x{{itemData.gemslots.defensive}}
                                    </div>
                                    <div class="tooltext">
                                        <div class="content">Defensive gem</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="desc">
                        <div v-if="itemData.desc" v-html="itemData.desc.desc" class="uistring"></div>
                        <div v-else>No description</div>
                    </div>
                </div>
                <div class="model-view" v-if="hasModel">
                    3D VIEW PLACEHOLDER
                </div>
            </div>

            <div class="section" v-if="itemData.enchantId">
                <div class="title">Enhancement</div>
                <item-enhance 
                    :enhanceLevel="enhanceLevel" 
                    :enhanceId="itemData.enchantId" 
                    v-on:levelUpdate="onLevelUpdate">
                </item-enhance>
            </div>
            <div class="section" v-if="itemData.extract && Object.keys(itemData.extract.results).length">
                <div class="title">Extraction</div>
                Extracting 
                <span v-if="!isNaN(enhanceLevel)">at +{{enhanceLevel}}</span> 
                costs <b>{{ itemData.extract.cost | gold }}</b> and can give:

                <div class="item-list" v-if="itemData.extract.results[effectiveEnhanceLevel]">
                    <div class="entry" v-for="(iid, key) in itemData.extract.results[effectiveEnhanceLevel]" :key="key">
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
import ItemEnhance from "@/components/items/ItemEnhance";
import ItemStat from "@/api/item/itemstat";

import Item from "@/api/item/item";

Vue.component('item-icon', ItemIcon);
Vue.component('item-card', ItemCard);
Vue.component('item-enhance', ItemEnhance);

export default {
    name: "item-page",
    data: function() {
        return {
            itemId: Number(this.$route.params.itemId),
            loading: true,
            itemData: null,
            enhanceLevel: 0,
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        '$route'(to, from) {
            this.itemId = Number(this.$route.params.itemId);
        },
        itemId(to, from) {
            if (to != from) {
                this.fetchData();
            }
        },
        enhanceLevel(to, from) {
            if (to != from) {
                let query = {};
                if (to > 0) {
                    query.enhance = to;
                }
                this.$router.replace({ 
                    name: 'item-view', 
                    params: {
                        itemId: this.itemId
                    }, 
                    query: query
                });
            }
        }
    },
    computed: {
        region() {
            return this.$store.state.regionCode;
        },
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
                let ret = this.itemData.category.name;
                let t = this.itemData.type.type;
                if (t === "QUEST") {
                    return "quest item";
                }
                if (t === "CROP") {
                    return "harvested " + ret + " crop";
                }
                if (t === "CREST") {
                    return ret + " crest";
                }

                return ret;
            }

            return "item";
        },
        forceBound() {
            //  Certain items (COUGH QUEST) are untradable at all times
            let t = this.itemData.type.type;
            return t === "QUEST";
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
        },
        effectiveEnhanceLevel() {
            if (isNaN(this.enhanceLevel)) {
                return 0;
            }

            return this.enhanceLevel;
        },
        unstampAmt() {
            if (this.itemData.baseStampCost) {
                return this.itemData.baseStampCost + Item.getStampMod(this.effectiveEnhanceLevel);
            }

            return "unknown";
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.enhanceLevel = Number(this.$route.query.enhance);
            if (isNaN(this.enhanceLevel)) {
                this.enhanceLevel = 0;
            }

            this.itemData = null;
            Item.getItem(this.itemId, this.region,
                (res) => {
                    this.itemData = res;
                    this.loading = false;
                },
                (err) => {

                });
        },
        onLevelUpdate(newLevel)  {
            this.enhanceLevel = newLevel;
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.itempage {
    position: relative;
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

            .fa {
                &:nth-child(2),
                &:nth-child(3) {
                    margin-left: -0.4em;
                }

                &.fa-dollar {
                    color: lighten(@dv-c-body, -20%);

                    &:nth-child(2) {
                        color: @dv-c-body;
                    }
                    &:nth-child(3) {
                        color: white;
                    }
                }
            }
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

                .gems {
                    margin-top: 12px;
                    display: flex;
                    flex-direction: row;

                    .gemslot {
                        flex: 0 0 48px;
                        width: 48px;
                        height: 48px;
                        position: relative;
                        margin: 0 2px;

                        .count {
                            position: absolute;
                            right: 0px;
                            bottom: 0px;
                        }
                    }
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

    
    .loading {
        position: relative;
        // padding-top: 100px;
        .loader-box {
            position: absolute;
            top: 150px;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 16px 0;;
            text-align: center;
            
            .label {
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                color: @dv-c-foreground;
                transform: translate(0, 4px);
            }

            .loader,
            .loader:after {
                border-radius: 50%;
                width: 10em;
                height: 10em;
            }
            .loader {
                position: absolute;
                left: 50%;
                top: 50%;
                line-height: 100%;
                font-size: 16px;
                margin: -5em -6em;
                text-indent: -9999em;
                border-top: 1.1em solid rgba(0, 0, 0, 0.75);
                border-right: 1.1em solid rgba(0, 0, 0, 0.75);
                border-bottom: 1.1em solid rgba(0, 0, 0, 0.75);
                border-left: 1.1em solid @dv-c-foreground;
                background: rgba(0, 0, 0, 0.5);
                //   -webkit-transform: translateZ(0);
                //   -ms-transform: translateZ(0);
                //   transform: translateZ(0);
                -webkit-animation: load8 1.1s infinite linear;
                animation: load8 1.1s infinite linear;
            }

            @-webkit-keyframes load8 {
                0% {
                    -webkit-transform: rotate(0deg);
                    transform: rotate(0deg);
                }
                100% {
                    -webkit-transform: rotate(360deg);
                    transform: rotate(360deg);
                }
            }
            @keyframes load8 {
                0% {
                    -webkit-transform: rotate(0deg);
                    transform: rotate(0deg);
                }
                100% {
                    -webkit-transform: rotate(360deg);
                    transform: rotate(360deg);
                }
            }
        }
    }
}
</style>
