<template>
<div class="charms">
    <div class="charm-id">#{{ charmId }}</div>
    <transition name="fade">
        <div v-if="loading" class="loading">
            <load-indicator
            loadText="Box contents"></load-indicator>
        </div>
    </transition>
    <transition name="fade">
        <div class="error" v-if="error">
            <small-error-box 
                :errorTitle="'Failed to load data'" 
                :errorContent="error.statusText + ': ' + error.bodyText" 
                :secondaryInfo="`Charm ID #${charmId}`"
                canRetry="true"
                v-on:retry="fetchData"
                iconClass="fa-exclamation-triangle"></small-error-box>
        </div>
    </transition>
    <transition name="fade" appear>
        <div v-if="!loading && !error">

            <div class="head">
                <div v-if="itemType.type == 'ITEM_DROP_POUCH'">
                    This item gives one of the following items when opened:
                </div>
                <div v-else-if="itemType.type == 'MULTI_ITEM_DROP_POUCH'">
                    This item gives the following items when opened:
                </div>
                <div v-else-if="itemType.type == 'ITEM_DROP_DUAL_POUCH'">
                    This item gives 1-2 items when opened:
                </div>
                <div v-else-if="itemType.type == 'HERO_POUCH'">
                    This item gives the corresponding item for your class:
                </div>
            </div>

            <form class="filter" v-if="charms.entries.length > 20">
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

            <responsive-card-list :count="sorted.length">
                <responsive-card-list-entry 
                    v-for="(e, key) in sorted" 
                    :key="key"
                    v-if="shouldRender(e.item)">
                    <item-card 
                        :itemId="e.item.id"
                        :itemStub="e.item"
                        :count="e.count"
                        :timeLimit="e.durationDays"
                        :goldAmt="e.gold / 10000"
                        :rate="itemType.type == 'MULTI_ITEM_DROP_POUCH' ? 0 : e.rate"
                    />
                </responsive-card-list-entry>
            </responsive-card-list>

            <!-- <transition-group name="fade-item" tag="div" class="item-list">
                <div class="entry" 
                    v-for="(e, key) in sorted" 
                    :key="key"
                    v-if="shouldRender(e.item)">
                    <item-card 
                        :itemId="e.item.id"
                        :itemStub="e.item"
                        :count="e.count"
                        :timeLimit="e.durationDays"
                        :goldAmt="e.gold / 10000"
                        :rate="itemType.type == 'MULTI_ITEM_DROP_POUCH' ? 0 : e.rate"
                    ></item-card>
                </div>
                <div class="no result" :key="'none'">
                    <small-error-box
                        errorTitle="No Results"
                        iconClass="fa-question-circle"
                        errorContent="Try searching something else">
                    </small-error-box>
                </div>
            </transition-group> -->
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
import Loader from "@/old/util/Loader";

import ResponsiveCardList from "@/components/util/ResponsiveCardList.vue";
import ResponsiveCardListEntry from "@/components/util/ResponsiveCardListEntry.vue";

Vue.component('item-icon', ItemIcon);
Vue.component('item-icon-tooltip', ItemIconTooltip);
Vue.component('item-card', ItemCard);
Vue.component("load-indicator", Loader);

import SmallErrorBox from "@/old/util/SmallErrorBox";
Vue.component("small-error-box", SmallErrorBox);

export default {
    props: ["charmId", "itemType"],
    components: {
        ResponsiveCardList,
        ResponsiveCardListEntry,
    },
    data: function() {
        return {
            loading: true,
            charms: null,
            error: null,
            filter: ItemFilter.defaultFilter(),
        }
    },
    watch: {
        charmId(to, from) {
            if (to != from) {
                this.fetchData();
            }
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
            
            if (!this.charms.entries) {
                return ret;
            }

            for (let k in this.charms.entries) {
                let item = this.charms.entries[k].item;
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
        sorted() {
            let ret = this.charms.entries.slice();
            ret.sort((a, b) => {
                let rate = a.rate - b.rate;
                if (a.rate == b.rate) {
                    let an = a.item.name.name.toUpperCase();
                    let bn = b.item.name.name.toUpperCase();

                    let r = an < bn ? -1 : an > bn;

                    return r;
                }

                if (rate < 0) {
                    return 1;
                } else if (rate > 0) {
                    return -1;
                }

                return 0;
            });

            return ret;
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.error = null;
            this.charms = null;
            Item.getCharm(this.charmId, this.$store.state.regionCode,
                (res) => {
                    this.charms = res;
                    this.loading = false;
                    this.error = null;
                },
                (err) => {
                    this.loading = false;
                    this.error = err;
                });
        },
        shouldRender(item) {
            return ItemFilter.shouldRender(this.filter, item);
        },
    },
}
</script>

<style lang="less" scoped>

@import "../../less/core.less";

.charms {
    position: relative;
    padding-top: 18px;
    min-height: 70px;

    .head {
        margin-top: 10px;
    }

    .charm-id {
        color: @dv-c-body;
        position: absolute;
        top: -4px;
        font-size: 12px;
        letter-spacing: 0.1em;
    }

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
                padding-left: 10px;
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
