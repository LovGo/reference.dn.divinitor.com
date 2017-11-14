<template>
<div class="tuner">
    <div class="tuner-id">#{{ tunerId }}</div>
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
                :secondaryInfo="`Mobile Enchant ID #${tunerId}`"
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
                <form class="filter">
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
                    <input id="filter-grade-normal" type="checkbox" v-model="filter.grades.normal" />
                    <label for="filter-grade-normal">Normal</label>
                    <input id="filter-grade-magic" type="checkbox" v-model="filter.grades.magic" />
                    <label for="filter-grade-magic">Magic</label>
                    <input id="filter-grade-rare" type="checkbox" v-model="filter.grades.rare" />
                    <label for="filter-grade-rare">Rare</label>
                    <input id="filter-grade-epic" type="checkbox" v-model="filter.grades.epic" />
                    <label for="filter-grade-epic">Epic</label>
                    <input id="filter-grade-legendary" type="checkbox" v-model="filter.grades.legendary" />
                    <label for="filter-grade-legendary">Legendary</label>
                    <input id="filter-grade-divine" type="checkbox" v-model="filter.grades.divine" />
                    <label for="filter-grade-divine">Divine</label>
                    
                </form>
                <div class="flow-container">
                    <div class="left-col item-list">
                        <div class="result" 
                            v-for="item in tunerData.items" 
                            :key="item.originalItemId"
                            >
                            <item-card
                                :itemStub="item.originalItem"
                                :itemId="item.originalItem.id"
                                noLink="true"
                                :onClick="() => select(item)"
                                :class="( item.originalItem.id == (selectedItem ? selectedItem.originalItem.id : undefined )? 'active' : '')"
                                >
                            </item-card>
                        </div>
                    </div>
                    <div class="right-col">
                        Selection
                        <div v-if="selectedItem">
                            {{ selectedItem.originalItem.id }}
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
import ItemIcon from "@/components/game/ItemIcon";
import ItemIconTooltip from "@/components/items/ItemIconTooltip";
import ItemCard from "@/components/items/ItemCard";
import ItemStat from "@/api/item/itemstat";

import Item from "@/api/item/item";

Vue.component('item-icon', ItemIcon);
Vue.component('item-icon-tooltip', ItemIconTooltip);
Vue.component('item-card', ItemCard);

export default {
    props: ["tunerId"],
    data: function() {
        return {
            loading: true,
            tunerData: null,
            error: null,
            selectedItem: null,
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
                    legendary: true,
                    divine: true
                }
            }
        }
    },
    created() {
        this.fetchData();
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
            console.log(item);
            this.selectedItem = item;
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
        flex-wrap: wrap;

        .item-list {
            max-height: 500px;
            overflow-y: scroll;
            border-top: 2px solid @dv-c-accent-1;
            border-bottom: 2px solid @dv-c-accent-1;

            .result {
                .item-card {
                    border: 1px solid @dv-c-foreground;
                    border-top-color: transparent;
                }

                &:first-child {
                    .item-card {
                        border-top-color: @dv-c-foreground;
                    }
                }
            }
        }

        .left-col {
            flex: 0 1 auto;
            margin-right: 20px;
        }

        .right-col {
            flex: 1 1 auto;
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
