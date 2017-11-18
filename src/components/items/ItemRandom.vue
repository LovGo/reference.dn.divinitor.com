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

            <form class="filter" v-if="randoms.entries.length > 20">
                <legend>Filter by</legend>
                <label for="filter-level-min">Level </label>
                <input id="filter-level-min" type="number" min="0" max="100" v-model="filter.minLevel" />
                <label> to </label>
                <input id="filter-level-max" type="number" :min="filter.minLevel" max="100" v-model="filter.maxLevel" />
                
                <label for="filter-name">Item Name</label>
                <input id="filter-name" type="text" v-model="filter.nameSearch" />

                <label for="filter-class">Class</label>
                <input id="filter-class" type="text" v-model="filter.selectClass" />
                <br/>
                <span>
                    <input id="filter-grade-normal" type="checkbox" v-model="filter.grades.normal" />
                    <label for="filter-grade-normal">Normal</label>
                </span>
                <span>
                    <input id="filter-grade-magic" type="checkbox" v-model="filter.grades.magic" />
                    <label for="filter-grade-magic">Magic</label>
                </span>
                <span>
                    <input id="filter-grade-normal" type="checkbox" v-model="filter.grades.rare" />
                    <label for="filter-grade-normal">Rare</label>
                </span>
                <span>
                    <input id="filter-grade-epic" type="checkbox" v-model="filter.grades.epic" />
                    <label for="filter-grade-epic">Epic</label>
                </span>
                <span>
                    <input id="filter-grade-unique" type="checkbox" v-model="filter.grades.unique" />
                    <label for="filter-grade-unique">Unique</label>
                </span>
                <span>
                    <input id="filter-grade-legendary" type="checkbox" v-model="filter.grades.legendary" />
                    <label for="filter-grade-legendary">Legendary</label>
                </span>
                <span>
                    <input id="filter-grade-divine" type="checkbox" v-model="filter.grades.divine" />
                    <label for="filter-grade-divine">Divine</label>
                </span>
                
            </form>

            <div class="head">
                This item gives one of the following items when opened:
            </div>

            <transition-group name="fade-item" tag="div" class="item-list">
                <div class="entry" v-for="(e, key) in randoms.entries" :key="key">
                    <item-card 
                        :itemId="e.item.id"
                        :itemStub="e.item"
                        :count="e.count"
                        :timeLimit="e.durationDays"
                        :goldAmt="e.gold / 10000"
                    ></item-card>
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
            filter: {
                minLevel: 0,
                maxLevel: 100,
                nameSearch: "",
                selectClass: "",
                grades: {
                    normal: true,
                    magic: true,
                    rare: true,
                    epic: true,
                    unique: true,
                    legendary: true,
                    divine: true
                }
            },
        }
    },
    created() {
        this.fetchData();
    },
    computed: {
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

        .entry {
            flex: 1 1 400px;
            border: 1px solid @dv-c-foreground;
            border-top-color: transparent;

            &:first-child {
                border-top-color: @dv-c-foreground;
            }

            @media only screen and (min-width:@min-desktop-wide-width) {
                flex: 0 1 480px;
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
