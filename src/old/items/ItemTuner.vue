<template>
<div class="tuner">
    <div class="tuner-id">#{{ tunerId }}</div>
    <transition name="fade">
        <div v-if="loading" class="loading">
              <load-indicator
                loadText="Tunable Items"></load-indicator>
        </div>
    </transition>
    <transition name="fade">
        <div class="error" v-if="error">
            <small-error-box 
                :errorTitle="'Failed to load data'" 
                :errorContent="error.statusText + ': ' + error.bodyText" 
                :secondaryInfo="`Tuner ID #${tunerId}`"
                canRetry="true"
                v-on:retry="fetchData"
                iconClass="fa-exclamation-triangle"></small-error-box>
        </div>
    </transition>
    <transition name="fade" appear>
        <div v-if="!loading && !error">
            <div v-if="tunerData.techniqueConverter || tunerId == 1">
                You can convert from one technique skill to another technique skill within the same base class.
            </div>
            <div v-else>
                <p>
                    The following items can be tuned using this item:
                </p>
                <form class="filter" v-if="Object.keys(tunerData.items).length > 10">
                    <legend>Filter by</legend>
                    <div class="level-filter">
                        <label for="filter-level-min">Level </label>
                        <input id="filter-level-min" type="number" min="0" max="100" v-model="filter.minLevel" />
                        <label> to </label>
                        <input id="filter-level-max" type="number" :min="filter.minLevel" max="100" v-model="filter.maxLevel" />
                    </div>
                    
                    <div class="name-class-filter">
                        <input id="filter-name" type="text" v-model="filter.nameSearch" placeholder="Name Filter"/>

                        <!-- <label for="filter-class">Class</label>
                        <input id="filter-class" type="text" v-model="filter.selectClass" /> -->
                    </div>

                    <div class="grade-filter">
                        <span class="normal" v-if="hasGrade.normal">
                            <input id="filter-grade-normal" type="checkbox" v-model="filter.grades.normal" />
                            <label for="filter-grade-normal">Normal</label>
                        </span>
                        <span class="magic" v-if="hasGrade.magic">
                            <input id="filter-grade-magic" type="checkbox" v-model="filter.grades.magic" />
                            <label for="filter-grade-magic">Magic</label>
                        </span>
                        <span class="rare" v-if="hasGrade.rare">
                            <input id="filter-grade-rare" type="checkbox" v-model="filter.grades.rare" />
                            <label for="filter-grade-rare">Rare</label>
                        </span>
                        <span class="epic" v-if="hasGrade.epic">
                            <input id="filter-grade-epic" type="checkbox" v-model="filter.grades.epic" />
                            <label for="filter-grade-epic">Epic</label>
                        </span>
                        <span class="unique" v-if="hasGrade.unique">
                            <input id="filter-grade-unique" type="checkbox" v-model="filter.grades.unique" />
                            <label for="filter-grade-unique">Unique</label>
                        </span>
                        <span class="legendary" v-if="hasGrade.legendary">
                            <input id="filter-grade-legendary" type="checkbox" v-model="filter.grades.legendary" />
                            <label for="filter-grade-legendary">Legendary</label>
                        </span>
                        <span class="divine" v-if="hasGrade.divine">
                            <input id="filter-grade-divine" type="checkbox" v-model="filter.grades.divine" />
                            <label for="filter-grade-divine">Divine</label>
                        </span>
                        <span class="ancient" v-if="hasGrade.ancient">
                            <input id="filter-grade-ancient" type="checkbox" v-model="filter.grades.ancient" />
                            <label for="filter-grade-ancient">Ancient</label>
                        </span>
                    </div>
                    
                </form>
                <div class="flow-container">
                    <transition-group name="fade-item" tag="div" class="left-col item-list">
                        <div
                            v-for="item in tunerData.items" 
                            :key="item.originalItem.id"
                            class="result" v-if="shouldRender(item.originalItem)">
                            <item-card
                                :itemStub="item.originalItem"
                                :itemId="item.originalItem.id"
                                noLink="true"
                                :onClick="() => select(item)"
                                :class="( item.originalItem.id == (selectedItem ? selectedItem.originalItem.id : undefined )? 'active' : '')"
                                >
                            </item-card>
                        </div>
                        
                        <div class="no result" :key="'none'">
                            <small-error-box
                                errorTitle="No Results"
                                iconClass="fa-question-circle"
                                errorContent="Try searching something else">
                            </small-error-box>
                        </div>
                    </transition-group>
                    <div class="right-col option-list">
                        <div v-if="selectedItem">
                            <div class="all">
                                <div class="title">Options</div>
                                <div class="info">
                                    <div class="info-entry" v-if="allOptionsEnhanceTransfer">
                                        <i class="fa fa-check-circle ok"></i> Enhancement is transferred
                                    </div>
                                    <div class="info-entry" v-if="allOptionsEnhanceReset">
                                        <i class="fa fa-ban nok"></i> Enhancement is reset
                                    </div>
                                    <div class="info-entry" v-if="allOptionsPotentialTransfer">
                                        <i class="fa fa-check-circle ok"></i> Extra stats preserved
                                    </div>
                                    <div class="info-entry" v-if="allOptionsPotentialReroll">
                                        <i class="fa fa-flask nok"></i> Extra stats re-rolled
                                    </div>
                                </div>
                            </div>
                            <div class="scroller">
                                <div class="option" v-for="(vv, ke) in collapseEnhance(sortedOptions(selectedItem.options))" :key="ke">
                                    <div class="enhance" v-if="ke != '0'">
                                        +{{ke}} input
                                    </div>
                                    <div v-for="(v, k) in vv" :key="k">
                                        <div class="top">
                                            <div class="name" v-if="v.name">{{ v.name }}</div>
                                            <div class="info">
                                                <div class="info-entry" v-if="v.rewardItem.enchantId && !allOptionsEnhanceTransfer && !allOptionsEnhanceReset">
                                                    <span v-if="v.enchantTransfer == 'RESET'">
                                                        <i class="fa fa-ban nok"></i> Enhancement is reset
                                                    </span>
                                                    <span v-if="v.enchantTransfer == 'RETAIN'">
                                                        <i class="fa fa-check-circle ok"></i> Enhancement is transferred
                                                    </span>
                                                </div>
                                                <div class="info-entry" v-if="v.rewardItem.type.potentialId && !allOptionsPotentialTransfer && !allOptionsPotentialReroll">
                                                    <span v-if="!v.potentialTransfer">
                                                        <i class="fa fa-flask nok"></i> Extra stats re-rolled
                                                    </span>
                                                    <span v-else>
                                                        <i class="fa fa-check-circle ok"></i> Extra stats preserved
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="option-card">
                                            <item-card
                                                :itemId="v.rewardItem.id"
                                                :itemStub="v.rewardItem"
                                                :potentialNum="v.potentialOptionNumber">
                                            </item-card>
                                        </div>
                                        <!-- {{v}} -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
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

import Loader from "@/old/util/Loader";
Vue.component("load-indicator", Loader);

import SmallErrorBox from "@/old/util/SmallErrorBox";
Vue.component("small-error-box", SmallErrorBox);

export default {
    props: ["tunerId", "parentItemId"],
    data: function() {
        return {
            loading: true,
            tunerData: null,
            error: null,
            selectedItem: null,
            filter: ItemFilter.defaultFilter(),
        }
    },
    created() {
        this.fetchData();
    },
    computed: {
        hasGrade() {
            let ret = {
                normal: false,
                magic: false,
                rare: false,
                epic: false,
                unique: false,
                legendary: false,
                divine: false,
                ancient: false,
            };
            
            if (!this.tunerData) {
                return ret;
            }

            for (let k in this.tunerData.items) {
                let item = this.tunerData.items[k].originalItem;
                switch(item.rank) {
                    case "NORMAL":
                        ret.normal = true;
                        break;
                    case "MAGIC":
                        ret.magic = true;
                        break;
                    case "RARE":
                        ret.rare = true;
                        break;
                    case "EPIC":
                        ret.epic = true;
                        break;
                    case "UNIQUE":
                        ret.unique = true;
                        break;
                    case "LEGENDARY":
                        ret.legendary = true;
                        break;
                    case "DIVINE":
                        ret.divine = true;
                        break;
                    case "ANCIENT":
                        ret.ancient = true;
                        break;
                }
            }

            return ret;
        },
        allOptionsEnhanceTransfer() {
            let options = this.selectedItem.options;
            for (let k in options) {
                let v = options[k];
                if (v.enchantTransfer == 'RESET' || !v.rewardItem.enchantId) {
                    return false;
                }
            }

            return true;
        },
        allOptionsEnhanceReset() {
            let options = this.selectedItem.options;
            for (let k in options) {
                let v = options[k];
                if (v.enchantTransfer == 'RETAIN' || !v.rewardItem.enchantId) {
                    return false;
                }
            }

            return true;
        },
        allOptionsPotentialTransfer() {
            let options = this.selectedItem.options;
            for (let k in options) {
                let v = options[k];
                if (!v.potentialTransfer || !v.rewardItem.type.potentialId) {
                    return false;
                }
            }

            return true;
        },
        allOptionsPotentialReroll() {
            let options = this.selectedItem.options;
            for (let k in options) {
                let v = options[k];
                if (v.potentialTransfer || !v.rewardItem.type.potentialId) {
                    return false;
                }
            }

            return true;
        },
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.error = null;
            this.tunerData = null;
            Item.getTunerInfo(this.tunerId, this.$store.state.regionCode,
                (res) => {
                    this.tunerData = res;
                    this.loading = false;
                    this.error = null;
                },
                (err) => {
                    this.loading = false;
                    this.error = err;
                });
        },
        select(item) {
            this.selectedItem = item;
        },
        shouldRender(item) {
            if (this.tunerId == 1026) {
                if (this.parentItemId == 1073894675 && item.type.type === "TALISMAN") {
                    return false;
                }
                if (this.parentItemId == 1073895685 && item.type.type !== "TALISMAN") {
                    return false;
                }
                if (this.parentItemId == 1073894674 && item.type.type === "TALISMAN") {
                    return false;
                }
                if (this.parentItemId == 1073895684 && item.type.type !== "TALISMAN") {
                    return false;
                }
            }
            return ItemFilter.shouldRender(this.filter, item);
        },
        sortedOptions(options) {
            let ret = options.slice();

            ret.sort((a, b) => {
                    let an = a.rewardItem.name.name.toUpperCase();
                    let bn = b.rewardItem.name.name.toUpperCase();

                    let r = an < bn ? -1 : an > bn;

                    if (r == false) {
                        r = a.potentialOptionNumber - b.potentialOptionNumber;
                    }

                    return r;
                }
            );

            return ret;
        },
        collapseEnhance(options) {
            let ret = {};
            
            for (let k in options) {
                let v = options[k];
                let eKey = String(v.requiredLevel);
                if (!ret[eKey]) {
                    ret[eKey] = [];
                }

                ret[eKey].push(v);
            }

            return ret;
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.tuner {
    position: relative;
    padding-top: 18px;
    min-height: 70px;

    .tuner-id {
        color: @dv-c-body;
        position: absolute;
        top: -4px;
        font-size: 12px;
        letter-spacing: 0.1em;
    }

    .filter {
        margin: 12px 0;
    }

    .flow-container {
        display: flex;
        flex-direction: row;
        
        @media only screen and (max-width:@min-desktop-wide-width) {
            flex-wrap: wrap;
        }

        .item-list {
            max-height: 500px;
            overflow-y: scroll;
            border-top: 2px solid @dv-c-accent-1;
            border-bottom: 2px solid @dv-c-accent-1;

            .result {
                // width: 380px;
                .item-card {
                    border: 1px solid @dv-c-foreground;
                    border-top-color: transparent;
                }

                &:first-child {
                    .item-card {
                        border-top-color: @dv-c-foreground;
                    }
                }

                &.no {
                    display: none;
                }

                &:first-child.no {
                    display: block;
                }
            }
        }

        .left-col {
            flex: 0 1 auto;
            margin: 0 5px;
            width: 50%;

            @media only screen and (max-width:@min-desktop-wide-width) {
                flex: 1 1 auto;
                margin-bottom: 20px;
            }
        }

        .right-col {
            flex: 1 1 auto;
            margin: 0 5px;
            width: 50%;
        }
    }

    .option-list {
        position: relative;
        display: flex;
        flex-direction: column;
        border-top: 2px solid @dv-c-accent-1;
        border-bottom: 2px solid @dv-c-accent-1;
        
        .scroller {
            overflow-y: auto;
            max-height: 438px;
        }

        @media only screen and (min-width:@min-desktop-wide-width) {
            // max-width: 540px;
        }

        .option {
            flex: 1 1 auto;
            border: 1px solid @dv-c-foreground;
            border-bottom-color: transparent;

            &:last-child {
                border-bottom-color: @dv-c-foreground;
            }
        
            &:first-child {
                border-top-color: transparent;
            }

            .enhance {
                border-bottom: 1px solid fade(@dv-c-foreground, 50%);
                color: @dv-c-accent-2;;
                padding: 4px 8px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }

            .top {
                padding: 0 8px 0 8px;
                line-height: 2em;
                background: fade(@dv-c-red, 10%);
            }
            
            .option-card {
                border-bottom: 1px solid @dv-c-idle;

                &:first-child {
                    border-bottom: none;
                }
            }
        }


        .all {
            border: 1px solid @dv-c-foreground;
            padding: 8px;

            .title {
                font-family: @dv-f-geomanist;
                font-size: 18px;
                color: @dv-c-foreground;
                text-transform: uppercase;
                letter-spacing: 0.2em;
            }
        }

        .info {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            padding: 0;
            margin: 0;
            width: 100%;

            .info-entry {
                flex: 1 1 auto;
                .text-align(left);
            }

            .fa.ok {
                color: @dv-c-green;
            }

            .fa.nok {
                color: @dv-c-red;
            }
        }
    }

    .loading {
        .loader-box {
            position: absolute;
            // top: 0;
            // left: 0;
            // right: 0;
            // bottom: 0;
            // background: rgba(0, 0, 0, 0.5);
            padding: 16px 0 0 16px;
            
            .label {
                display: inline-block;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                padding-top: 10px;
                .padding-left(10px);
                vertical-align: top;
                color: @dv-c-foreground;
            }

            .loader,
            .loader:after {
                border-radius: 50%;
                width: 2em;
                height: 2em;
            }
            .loader {
                display: inline-block;
                line-height: 100%;
                font-size: 16px;
                text-indent: -9999em;
                border-top: 0.2em solid rgba(0, 0, 0, 0.75);
                border-right: 0.2em solid rgba(0, 0, 0, 0.75);
                border-bottom: 0.2em solid rgba(0, 0, 0, 0.75);
                border-left: 0.2em solid @dv-c-foreground;
                background: rgba(0, 0, 0, 0.5);
                //   -webkit-transform: translateZ(0);
                //   -ms-transform: translateZ(0);
                //   transform: translateZ(0);
                -webkit-animation: load8 1.1s infinite linear;
                animation: load8 1.1s infinite linear;
            }
        }
    }
}
</style>
