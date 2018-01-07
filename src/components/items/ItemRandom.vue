<template>
<div class="randoms">
    <div class="random-id">#{{ randomId }}</div>
    <transition name="fade">
        <div v-if="loading" class="loading">
            <div class="loader-box">
                <div class="loader"></div>
                <div class="label">Loading</div>
            </div>
        </div>
    </transition>
    <transition name="fade">
        <div class="error" v-if="error">
            <small-error-box 
                :errorTitle="'Failed to load data'" 
                :errorContent="error.statusText + ': ' + error.bodyText" 
                :secondaryInfo="`random ID #${randomId}`"
                canRetry="true"
                v-on:retry="fetchData"
                iconClass="fa-exclamation-triangle"></small-error-box>
        </div>
    </transition>
    <transition name="fade" appear>
        <div v-if="!loading && !error">

            <div class="head">
                This item gives one of the following items when opened:
            </div>

            <form class="filter" v-if="randoms.length > 20">
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
                </div>
            </form>

            <transition-group name="fade-item" tag="div" class="item-list">
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
                        :rate="e.rate"
                    ></item-card>
                </div>
                <div class="no result" :key="'none'">
                    <small-error-box
                        errorTitle="No Results"
                        iconClass="fa-question-circle"
                        errorContent="Try searching something else">
                    </small-error-box>
                </div>
            </transition-group>
        </div>
    </transition>
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
    props: ["randomId", "itemType"],
    data: function() {
        return {
            loading: true,
            randoms: null,
            error: null,
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
                divine: false
            };
            
            if (!this.randoms) {
                return ret;
            }

            for (let k in this.randoms) {
                let item = this.randoms[k].item;
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
                }
            }

            return ret;
        },
        sorted() {
            let ret = this.randoms.slice().filter(a => a.item.name != "NO_SUCH_ITEM");
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
            this.randoms = null;
            Item.getRandom(this.randomId, this.$store.state.regionCode,
                (res) => {
                    this.randoms = res;
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

.randoms {
    position: relative;
    padding-top: 18px;
    min-height: 70px;

    .head {
        margin-top: 10px;
    }

    .random-id {
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
            flex: 1 1 400px;
            border: 1px solid @dv-c-foreground;
            border-top-color: transparent;

            &:first-child {
                border-top-color: @dv-c-foreground;
            }

            @media only screen and (min-width:@min-desktop-wide-width) {
                flex: 0 1 470px;
                border-right-color: transparent;
                &:first-child,
                &:nth-child(2) {
                    border-top-color: @dv-c-foreground;
                }
                &:nth-child(2n) {
                    border-right-color: @dv-c-foreground;
                }
                &:last-child {
                    border-right-color: @dv-c-foreground;
                }
                &:first-child:last-child {
                    border-right-color: @dv-c-foreground;
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
