<template>
<div class="enhance">
    <div class="enhance-id">#{{ enhanceId }}</div>
    <!-- +{{level}}
    <button v-on:click="test">Test</button>
    <button v-on:click="reset">Reset</button> -->
    <transition name="fade">
        <div v-if="loading">

        </div>
    </transition>
    <transition name="fade" appear>
        <div v-if="!loading">
            <!-- Can be enhanced up to <b>+{{maxLevel }}</b> -->

            <form class="options">
                <input type="checkbox" v-model="useGoldenGoose" id="goldenGoose" />
                <label for="goldenGoose">Use Golden Goose 50% discount</label>
                <input type="checkbox" v-model="useJelly" id="jelly" v-if="canUseJelly"/>
                <label for="jelly" v-if="canUseJelly">Use Item Protection Jelly</label>
            </form>

            <transition name="fadecollapse-item">
                <div class="ok toast" v-if="useJelly && dragonGem && canUseJelly">
                    <div class="heading">The Goddess protects those she loves</div>
                    Dragon Gem enhancing will always succeed when using <strong>Item Protection Jelly</strong>.
                </div>
            </transition>

            <transition name="fadecollapse-item">
                <div class="ok toast" v-if="!showFailDropAmount">
                    <div class="heading">Safety Net</div>
                    This item cannot drop in level when enhancement fails.
                </div>
            </transition>

            <transition name="fadecollapse-item">
                <div class="warn toast" v-if="!canUseJelly && showBreakChance">
                    <div class="heading">May the Goddess be with you</div>
                    <strong>Item Protection Jelly</strong> cannot be used with this item.
                </div>
            </transition>

            <div class="small button-bar">
                <div class="row-button" :class="{active: activePage(0)}" v-on:click="selectPage(0)">Overview</div>
                <div class="row-button" :class="{active: activePage(1)}" v-on:click="selectPage(1)">Material Grid</div>
                <div class="row-button" :class="{active: activePage(2)}" v-on:click="selectPage(2)">Stat Grid</div>
            </div>

            <div v-if="page == 0">
                <div class="flow-container">
                    <div class="left container">
                        <div class="title">
                            Enhancement Levels
                        </div>
                        <table class="rates">
                            <thead>
                                <th class="first">Level</th>
                                <th class="fixed">Rate</th>
                                <th class="fixed">Gold Cost</th>
                                <th class="fixed" v-if="canUseJelly">Jelly Cost</th>
                                <th class="fixed" v-if="showBreakChance">Break Chance</th>
                                <th class="fixed" v-if="showFailDropAmount">Max Fail Lvl Drop</th>
                            </thead>
                            <tr
                                v-on:click="updateLevel(0)" 
                                :class="(level == 0 ? `active` : `` )">
                                <th>+0</th>
                                <td>&#8210;</td>
                                <td>&#8210;</td>
                                <td v-if="canUseJelly">&#8210;</td>
                                <td v-if="showBreakChance">&#8210;</td>
                                <td v-if="showFailDropAmount">&#8210;</td>
                            </tr>
                            <tr 
                                v-for="e in enhanceData" 
                                :key="e.level" 
                                v-on:click="updateLevel(e.level)" 
                                :class="(e.level == level ? `active` : `` )">
                                <th>+{{e.level}}</th>
                                <td>{{ rateMod(e.successRate, e.level) | enhancePercent}}</td>
                                <td>{{ e.cost * (useGoldenGoose ? 0.5 : 1) | goldG }}</td>
                                <td v-if="canUseJelly">{{ e.jellyUseCount | zeroDash }}</td>
                                <td v-if="showBreakChance">{{ breakRateMod(e.breakRate, e.level) | enhancePercent}}</td>
                                <td v-if="showFailDropAmount">{{ e.maxDown | zeroDash }}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="right">
                        <transition name="fade-item">
                            <div class="top container" v-if="level > 0">
                                <div class="title">
                                    Required Materials to +{{ level }}
                                </div>
                                
                                <div class="item-list" v-if="level > 0 && enhanceData[level - 1].materials">
                                    <transition-group name="fadecollapse-item">
                                        <div class="entry" v-for="(d, key) in enhanceData[level - 1].materials" :key="key">
                                            <item-card :itemId="d.itemId" :count="d.count"></item-card>
                                        </div>
                                    </transition-group>
                                </div>
                            </div>
                        </transition>
                        <transition name="fade-item">
                            <div class="bottom container" v-if="level > 0">
                                <div class="title">
                                    Stats at +{{ level }}
                                </div>
                                TODO
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

            <!-- {{ enhanceData }} -->

        </div>
    </transition>
</div>
</template>

<script>
import Vue from 'vue';
import ItemIcon from "@/components/game/ItemIcon";
import ItemStat from "@/api/item/itemstat";

import Item from "@/api/item/item";

Vue.component('item-icon', ItemIcon);

export default {
    props: ["enhanceLevel", "itemData"],
    data: function() {
        let isGem = this.itemData.type.type === 'DRAGON_GEM';
        return {
            level: this.enhanceLevel,
            enhanceId: this.itemData.enchantId,
            dragonGem: isGem,
            loading: true,
            horizontal: false,
            useGoldenGoose: true,
            useJelly: !isGem,
            enhanceData: null,
            page: 0
        };
    },
    created() {
        this.fetchData();
    },
    watch: {
        enhanceId(to, from) {
            if (to != from) {
                this.fetchData();
            }
        },
        enhanceLevel(to, from) {
            this.level = to;
        }
    },
    computed: {
        maxLevel() {
            return this.enhanceData[this.enhanceData.length - 1].level;
        },
        showBreakChance() {
            //  Check if this item can even break
            let hasBreakChance = false;
            for (let k in this.enhanceData) {
                let d = this.enhanceData[k];
                if (this.breakRateMod(d.breakRate, Number(k) + 1) > 0) {
                    hasBreakChance = true;
                    break;
                }
            }

            return hasBreakChance;
        },
        showFailDropAmount() {

            //  Check if this item can even drop
            let hasDropChance = false;
            for (let k in this.enhanceData) {
                let d = this.enhanceData[k];
                if (d.maxDown > 0) {
                    hasDropChance = true;
                    break;
                }
            }

            if (this.canUseJelly && this.dragoonGem) {
                return false;
            }

            return hasDropChance;
        },
        canUseJelly() {
            //  Check if this item can even usejellies
            let hasJelly = false;
            for (let k in this.enhanceData) {
                let d = this.enhanceData[k];
                if (d.jellyUseCount > 0) {
                    hasJelly = true;
                    break;
                }
            }

            return hasJelly;
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.enhanceData = null;
            Item.getEnhancementInfo(this.enhanceId, this.$store.state.regionCode,
                (res) => {
                    this.enhanceData = res;
                    this.loading = false;
                },
                (err) => {

                });
        },
        updateLevel(newLevel) {
            this.level = newLevel;
            this.$emit("levelUpdate", this.level);
        },
        test() {
            this.updateLevel(this.level + 1);
        },
        reset() {
            this.updateLevel(0);
        },
        rateMod(rate, level) {
            if (this.useJelly && this.dragonGem && this.canUseJelly) {
                return 1;
            }

            return rate;
        },
        breakRateMod(rate, level) {
            if (this.useJelly) {
                if (this.enhanceData[level - 1].jellyUseCount) {
                    return 0;
                }
            }

            return rate;
        },
        activePage(page) {
            return this.page == page;
        },
        selectPage(page) {
            this.page = page;
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.enhance {
    position: relative;
    padding-top: 18px;

    .options {
        input[type="checkbox"] {
            margin-left: 2em;
            cursor: pointer;

            &:first-child {
                margin-left: 0;
            }
        }

        label {
            cursor: pointer;
            transition: color 0.125s ease-in;

            &:hover {
                color: @dv-c-accent-2;
            }
        }
    }

    .enhance-id {
        color: @dv-c-body;
        position: absolute;
        top: -4px;
        font-size: 12px;
        letter-spacing: 0.1em;
    }

    .no-jelly {
        margin-left: 2em;
        font-style: italic;
        color: @dv-c-red;
    }

    .flow-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 1em;

        .left {
            flex: 0 1 auto;
            margin-right: 20px;
        }

        .right {
            flex: 1 1 250px;
        }
    }

    .small.button-bar {
        margin-top: 1em;

        .row-button {
            font-size: 12px;
        }
    }

    .container {
        position: relative;
        padding-top: 1em;
        margin-top: 1em;

        &:first-child {
            margin-top: 0;
        }

        .title {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            font-family: @dv-f-geomanist;
            font-size: 14px;
            color: @dv-c-accent-2;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
    }
    

    .item-list {
        margin-top: 0.5em;
        transition: height ease-in 0.25s;

        .entry {
            flex: 1 1 250px;
            border: 1px solid @dv-c-foreground;
            border-top-color: transparent;

            &:first-child {
                border-top-color: @dv-c-foreground;
            }
        }
    }

    .rates {
        margin: 0.5em 0;
        border-collapse: collapse;
        text-align: center;
        thead {
            th {
                border-bottom: 2px solid @dv-c-body;
                color: @dv-c-foreground;
                font-size: 12px;
                font-weight: normal;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                text-align: center;
                height: 3em;

                &.first {
                    border-right: 2px solid @dv-c-body;
                    width: 50px;
                    text-align: right;
                }

                &.fixed {
                    width: 80px;
                }
            }

            tr:hover {
                background: none;
            }
        }

        tr {
            padding-left: 0.125em;
            transition: background-color 0.125s ease-in, color 0.125s ease-in;
            cursor: pointer;
        }

        tr:hover,
        tr.active:hover {
            background: fade(@dv-c-foreground, 30%);
        }

        tr.active {
            background: fade(@dv-c-foreground, 20%);
            color: @dv-c-foreground;
        }

        tr th {
            border-right: 2px solid @dv-c-body;
            border-bottom-color: transparent;
            padding: 4px 12px 4px 0;
            text-align: right;
        }

        th, td {
            border-bottom: 1px solid @dv-c-idle;
            padding: 4px 4px 4px 4px;
        }

        td {
            padding-right: 0.5em;
        }

        td:first-child,
        th:first-child {
            padding-left: 0.25em;
            padding-right: 0.5em;
        }
        tr:last-child td {
            border-bottom-color: transparent;
        }
    }
}
</style>
