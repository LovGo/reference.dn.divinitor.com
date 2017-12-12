<template>
<div class="enhance">
    <div class="enhance-id">#{{ enhanceId }}</div>
    <!-- +{{level}}
    <button v-on:click="test">Test</button>
    <button v-on:click="reset">Reset</button> -->
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
                :secondaryInfo="`Enhancement ID #${enhanceId}`"
                canRetry="true"
                v-on:retry="fetchData"
                iconClass="fa-exclamation-triangle"></small-error-box>
        </div>
    </transition>
    <transition name="fade" appear>
        <div v-if="!loading && !error" class="state-wrapper">
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
                            <div class="top container">
                                <div class="title">
                                    Required Materials to +{{ level }}
                                </div>
                                
                                <div class="placeholder" v-if="level == 0">
                                    Select an enhancement level to view required materials
                                </div>

                                <div class="item-list" v-if="level > 0 && enhanceData[level - 1].materials">
                                    <transition-group name="fadecollapse-item">
                                        <div class="entry" v-for="(d, key) in enhanceData[level - 1].materials" :key="key">
                                            <item-card 
                                                :itemId="d.itemId" 
                                                :count="d.count"
                                                :itemStub="d.stub"
                                            ></item-card>
                                        </div>
                                    </transition-group>
                                </div>
                            </div>
                        </transition>
                        <transition name="fade-item">
                            <div class="bottom container" v-if="level > 0">
                                <div class="title">
                                    Additional Stats at +{{ level }}
                                </div>
                                <div class="placeholder" v-if="level == 0">
                                    Select an enhancement level to view additional stats
                                </div>
                                <stat-grid v-else
                                    :statSet="currentStatSet"
                                    :enhanceStatSet="null">
                                </stat-grid>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

            <div v-if="page == 1">
                <table class="material-grid">
                    <thead>
                        <th class="first">Level</th>
                        <th>
                            <item-icon-tooltip
                                itemId="1073750029">
                            </item-icon-tooltip>
                        </th>
                        <th v-if="canUseJelly">
                            <item-icon-tooltip
                                itemId="1107302400">
                            </item-icon-tooltip>
                        </th>
                        <th class="item-head" v-for="v in materialsSet" :key="v.item.id">
                            <item-icon-tooltip
                                :itemId="v.item.id"
                                :itemStub="v.item.stub">
                            </item-icon-tooltip>
                        </th>
                    </thead>
                    <tr v-for="e in enhanceData" :key="e.level">
                        <th>+{{e.level}}</th>
                        <td>
                            {{ e.cost * (useGoldenGoose ? 0.5 : 1) | goldG }}
                        </td>
                        <td v-if="canUseJelly">
                            {{ e.jellyUseCount | zeroDash }}
                        </td>
                        <td v-for="v in materialsSet" :key="v.item.id">
                            {{ v.amount[String(e.level)] | zeroDash }}
                        </td>
                    </tr>
                </table>
            </div>

            <div class="stat-grid-page" v-if="page == 2">
                <table class="stat-grid">
                    <thead>
                        <th class="first">Level</th>
                        <th v-for="(e, k) in statGridSet.minmax" :key="k">
                            {{e.state.abbv}}
                        </th>
                        <th v-for="(e, k) in statGridSet.stats" :key="k">
                            {{e.state.abbv}}
                        </th>
                    </thead>
                    <tr v-for="e in enhanceData" :key="e.level">
                        <th>+{{e.level}}</th>
                        <td v-for="(v, k) in statGridSet.minmax" :key="k">
                            <span v-if="v.amount[String(e.level)]">
                                <span v-if="v.state.type == 'stat'">
                                    {{ v.amount[String(e.level)].min | stat }} - {{ v.amount[String(e.level)].max | stat }}
                                </span>
                                <span v-else>
                                    {{ v.amount[String(e.level)].min | statPercent }} - {{ v.amount[String(e.level)].max | statPercent }}
                                </span>
                            </span>
                        </td>
                        <td v-for="(v, k) in statGridSet.stats" :key="k">
                            <span v-if="v.amount[String(e.level)]">
                                <span v-if="v.state.type == 'stat'">
                                    {{ v.amount[String(e.level)] | stat }}
                                </span>
                                <span v-else>
                                    {{ v.amount[String(e.level)] | statPercent }}
                                </span>
                            </span>
                        </td>
                    </tr>
                </table>
                <!-- {{ statGridSet }} -->
            </div>

            <!-- {{ enhanceData }} -->

        </div>
    </transition>
</div>
</template>

<script>
import Vue from 'vue';
import ItemIcon from "@/components/game/ItemIcon";
import ItemIconTooltip from "@/components/items/ItemIconTooltip";
import ItemStat from "@/api/item/itemstat";
import StatGrid from "@/components/game/StatGrid";

import Item from "@/api/item/item";

Vue.component('item-icon', ItemIcon);
Vue.component('item-icon-tooltip', ItemIconTooltip);
Vue.component('stat-grid', StatGrid);

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
            page: 0,
            error: null,
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
        },
        currentStatSet() {
            return this.statSet(this.level);
        },
        materialsSet() {
            let ret = {};

            for (let e in this.enhanceData) {
                let v = this.enhanceData[e];
                let mats = v.materials;
                for (let k in mats) {
                    let vv = mats[k];
                    if (!ret[vv.itemId]) {
                        ret[vv.itemId] = {
                            item: vv.stub,
                            amount: {}
                        };
                    }

                    ret[vv.itemId].amount[String(Number(e) + 1)] = vv.count;
                }
            }

            let rret = [];

            for (let k in ret) {
                rret.push(ret[k]);
            }

            rret.sort((a, b) => {
                //  Sort by first min key
                let ak = this.firstProperty(a.amount);
                let bk = this.firstProperty(b.amount);

                return ak - bk;
            });

            return rret;
        },
        statGridSet() {
            let ret = {};

            for (let e in this.enhanceData) {
                let v = this.enhanceData[e];
                let statSet = this.statSet(v.level);
                for (let k in statSet) {
                    let vv = statSet[k];
                    let state = ItemStat.getStateInfo(k);
                    if (state.minmax) {
                        let kk = state.minmax;
                        if (!ret[kk]) {
                            ret[kk] = {
                                state: ItemStat.getStateInfo(kk),
                                amount: {}
                            }
                        }

                        if (!ret[kk].amount[String(v.level)]) {
                            ret[kk].amount[String(v.level)] = {min: 0, max: 0};
                        }
                        ret[kk].amount[String(v.level)][state.mxt] = vv;
                    } else {
                        if (!ret[k]) {
                            ret[k] = {
                                state: state,
                                amount: {}
                            };
                        }

                        ret[k].amount[String(v.level)] = vv;
                    }

                }
            }

            let rret = {
                stats: [],
                minmax: []
            };

            for (let k in ret) {
                if (ret[k].state.combined) {
                    rret.minmax.push(ret[k]);
                } else {
                    rret.stats.push(ret[k]);
                }
            }

            return rret;
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.enhanceData = null;
            this.error = null;
            Item.getEnhancementInfo(this.enhanceId, this.$store.state.regionCode,
                (res) => {
                    this.enhanceData = res;
                    this.loading = false;
                    this.error = null;
                    this.updateLevel(this.level);
                },
                (err) => {
                    this.loading = false;
                    this.error = err;
                });
        },
        updateLevel(newLevel) {
            this.level = newLevel;
            this.$emit("levelUpdate", this.level, this.currentStatSet);
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
        statSet(level) {
            if (level > 0) {
                return ItemStat.joinStatSet(this.enhanceData[level - 1].statGains, "value");
            }
            
            return null;
        },
        activePage(page) {
            return this.page == page;
        },
        selectPage(page) {
            this.page = page;

            this.$ga.event({
                eventCategory: 'enhancement',
                eventAction: 'change-page',
                eventValue: page
            });
        },
        firstProperty(obj) {
            return Object.keys(obj)[0];
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.enhance {
    position: relative;
    padding-top: 18px;
    min-height: 70px;
    // width: 100%;

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

    table {
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

        tr:hover,
        tr.active:hover {
            background: fade(@dv-c-foreground, 30%);
            color: @dv-c-foreground;
        }
    }

    .rates {
        tr {
            cursor: pointer;
        }

        tr.active {
            background: fade(@dv-c-foreground, 20%);
            color: @dv-c-foreground;
        }
    }

    .material-grid {
        td {
            min-width: 60px;
        }
    }

    .state-wrapper {
        width: 100%;
        position: relative;
    }

    .stat-grid-page {
        width: 100%;
        overflow-x: auto;
    }

    .stat-grid {
        td {
            padding: 0 20px;
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
