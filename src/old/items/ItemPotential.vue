<template>
<div class="potential-info">
    <template v-if="potentialData.length > 1">
        This item has <strong>{{potentialData.length}}</strong> additional stat options:
    </template>
    <!-- TODO add filter by stat -->
    <form class="filter" v-if="potentialData.length > 6 && availableStats.length">
        <legend>Filter by</legend>

        <div class="grade-filter stat-filter">
            <span class="stat-select divinitor" v-for="s in availableStats" :key="s">
                <input :id="'filter-stat-' + s" type="checkbox" :value="s" v-model="statFilter" selected/>
                <label :for="'filter-stat-' + s">{{statName(s).abbv}}</label>
            </span>
        </div>
    
        <div class="button-row">
            <button class="submit" v-on:click.prevent="resetFilterNone">Show None</button>
            <button class="submit" v-on:click.prevent="resetFilterAll">Show All</button>
        </div>

    </form>

    <div class="skill-potential-list" v-if="isSkillOnly">
        <div class="skill-entry" 
            v-for="d in sortedData" :key="d.id"
            :active="potentialId == d.id"
            v-on:click="select(d.id)">
            <skill-stub :skill-id="d.skill.id" :fill="true" />
            <div class="pid">{{d.id}}:{{d.potentialNumber}} <span class="potential-key">{{ d.idx }}</span></div>
        </div>
    </div>
    <div class="potential-list" v-else :scrollable="potentialData.length > 30">
        <div class="potential-entry" 
            v-for="d in sortedData" 
            :key="d.id" 
            :active="potentialId == d.id"
            v-on:click="select(d.id)"
            v-if="!shouldFilter(d) || availableStats.length == 0">
            <div class="pid">{{d.id}}:{{d.potentialNumber}} <span class="potential-key">{{ d.idx }}</span></div>
            <div class="grid-cover">
                <stat-grid
                    :statSet="statSet(d)"
                    hideHeader="true"
                    v-if="!d.skill || d.states.length"
                    ></stat-grid>
                <div class="skill-option" v-if="d.skill">
                    <skill-icon :iconIndex="d.skill.iconIndex"></skill-icon>
                    <div class="skill-info">
                        <div class="skill-id">#{{d.skill.id}}</div>
                        <div class="skill-class" v-if="d.skill.job >= 0">{{d.skill.job.displayName}}</div>
                        <div class="skill-name">{{d.skill.displayName}}</div>
                    </div>
                </div>
            </div>
            <div class="rate" v-if="d.rate && !d.skill">
                {{ d.rate | rate}}%
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import ItemIcon from "@/old/game/ItemIcon";
import ItemStat from "@/old/api/item/itemstat";
import StatGrid from "@/old/game/StatGrid";
import SkillIcon from "@/old/game/SkillIcon";

import Item from "@/old/api/item/item";

Vue.component('item-icon', ItemIcon);
Vue.component('stat-grid', StatGrid);
Vue.component('skill-icon', SkillIcon);

import SkillStub from "@/components/skill/SkillStub.vue";

export default {
    props: ["potentialData", "selection", "potentialNum"],
    components: {
        SkillStub,
    },
    data: function() {
        return {
            potentialId: 0,
            statFilter: [],
        }
    },
    created() {
        this.init();
    },
    computed: {
        sortedData() {
            let ret = this.potentialData.slice();
            
            ret.sort((a, b) => {
                return a.id - b.id;
            });

            for (let i = 0; i < ret.length; ++i) {
                ret[i].idx = i + 1;
            }

            ret.sort((a, b) => {
                let cmp = b.rate - a.rate;
                if (cmp < 0) {
                    return -1;
                }
                if (cmp > 0) {
                    return 1;
                }

                cmp = a.potentialNumber - b.potentialNumber;
                if (cmp < 0) {
                    return -1;
                }
                if (cmp > 0) {
                    return 1;
                }

                return 0;
            });

            return ret;
        },
        availableStats() {
            let ret = {};
            for (let k in this.potentialData) {
                let v = this.potentialData[k];

                let joined = ItemStat.joinStatSet(v.states, "value");
                // Merge stats that are min/max
                for (let s in joined) {
                    let stat = this.statName(s);
                    if (stat.minmax) {
                        ret[stat.minmax] = true;
                    } else {
                        ret[s] = true;
                    }
                }
            }

            return Object.keys(ret).sort();
        },
        filterAsSet() {
            let ret = {};
            for (let k in this.statFilter) {
                let v = this.statFilter[k];
                ret[v] = true;
            }

            return ret;
        },
        isSkillOnly() {
            return this.potentialData.filter((p) => p.skill).length == this.potentialData.length;
        }
    },
    methods: {
        init() {
            if (this.potentialNum) {
                //  Convert this to a potential selection
                let isSet = false;
                for (let k in this.sortedData) {
                    let v = this.potentialData[k];
                    if (v.potentialNumber == this.potentialNum) {
                        this.select(v.id);
                        isSet = true;
                        break;
                    }
                }

                if (!isSet) {
                    this.select(this.sortedData[0].id);
                }
            } else if (this.selection) {
                //  Check that it exists
                let isSet = false;
                for (let k in this.potentialData) {
                    let v = this.potentialData[k];
                    if (v.id == this.selection) {
                        this.select(v.id);
                        isSet = true;
                        break;
                    }
                }

                if (!isSet) {
                    this.select(this.sortedData[0].id);
                }
            } else {
                this.select(this.sortedData[0].id);
            }

            this.resetFilterAll();
        },
        statSet(potential) {
            return ItemStat.joinStatSet(potential.states, "value");
        },
        select(potentialId) {
            this.potentialId = potentialId;
            this.$emit("potentialIdChange", this.potentialId);
        },
        statName(key) {
            return ItemStat.getStateInfo(key);
        },
        shouldFilter(potential) {
            let states = potential.states;
            for (let k in states) {
                let v = states[k];
                if (this.filterAsSet[v.state]) {
                    return false;
                }

                let stateInfo = ItemStat.getStateInfo(v.state);
                if (stateInfo.minmax && this.filterAsSet[stateInfo.minmax]) {
                    return false;
                }
            }

            return true;
        },
        resetFilterNone() {
            this.statFilter = [];
        },
        resetFilterAll() {
            this.statFilter = this.availableStats.slice();
        }
    }

}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.potential-info {
    position: relative;

    .stat-filter {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        max-height: 75px;

        .stat-select {
            display: inline-block;
            flex: 0 1;
        }

        margin-bottom: 10px;
    }

    .skill-potential-list {
        margin-top: 8px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .skill-entry {
            flex: 0 0 325px;
            position: relative;
            font-size: 0;
            background: fade(@dv-c-background, 50%);
            transition: background-color ease-in 0.125s;
            cursor: pointer;

            .pid {
                position: absolute;
                font-size: 10px;
                top: 4px;
                .right( 6px);
                color: transparent;
                transition: color ease-in 0.125s;
            }

            &:hover,
            &[active] {
                background: fade(lighten(@dv-c-accent-3, -30%), 50%);

                .pid {
                    color: @dv-c-accent-1;
                }
            }
        }
    }

    .potential-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 10px 0;

        max-height: 650px;
        overflow-y: auto;

        .potential-entry {
            flex: 0 1 275px;
            padding: 8px;
            border: 1px solid @dv-c-foreground;
            cursor: pointer;
            position: relative;
            background: fade(@dv-c-background, 50%);
            transition: background-color ease-in 0.125s;
            width: 275px;

            &[active] {
                background: fade(@dv-c-accent-3, 20%);

                .pid {
                    color: @dv-c-accent-1;
                }
                .rate {
                    color: @dv-c-foreground;
                    &::after {
                        color: @dv-c-accent-2;
                    }
                }

                .skill-option {
                }
            }

            &:hover {
                background: fade(@dv-c-foreground, 30%);

                .pid {
                    color: @dv-c-foreground;
                    .potential-key {
                        color: @dv-c-foreground;
                    }
                }

                .rate {
                    color: @dv-c-foreground;
                    &::after {
                        color: @dv-c-accent-2;
                    }
                }

                .skill-option {
                    .skill-info {
                        .skill-id {
                            color: @dv-c-body;
                        }
                    }

                    .skill-class {
                        color: @dv-c-accent-2;
                    }
                }
            }

            .pid {
                position: absolute;
                font-size: 10px;
                top: 4px;
                .right( 6px);
                color: transparent;
                transition: color ease-in 0.125s;

                .potential-key {
                    transition: color ease-in 0.125s;
                    color: fade(@dv-c-foreground, 20%);
                }
            }

            .grid-cover {
                pointer-events: none;
            }

            .skill-option {
                width: 100%;
            }

            .skill-option {
                display: flex;
                flex-direction: row;

                .skil-icon {
                    flex: 0 0;
                }

                .skill-info {
                    flex: 1 0;
                    .margin-left( 8px);
                    .margin-right( 24px);
                    .skill-id {
                        font-size: 12px;
                        letter-spacing: 0.2em;
                        text-transform: uppercase;
                        word-wrap: break-word;
                        color: fade(@dv-c-body, 20%);
                        transition: color ease-in 0.125s;
                        line-height: 10px;
                    }

                    .skill-class {
                        transition: color ease-in 0.125s;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 0.3em;
                        font-family: @dv-f-geomanist;
                        color: @dv-c-accent-1;
                    }

                    .skill-name {
                        text-transform: uppercase;
                        letter-spacing: 0.1em;
                        font-family: @dv-f-geomanist;
                        color: @dv-c-foreground;
                        font-size: 16px;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }
                }
            }

            .rate {
                position: absolute;
                .text-align(right);
                .right( 0.4em);
                top: 50%;
                color: @dv-c-accent-1;
                transition: color ease-in 0.125s;
                transform: translate(0%, -50%);
                padding-bottom: 6px;

                &::after {
                    content: "RATE";
                    position: absolute;
                    color: @dv-c-idle;
                    font-size: 10px;
                    bottom: -4px;
                    .left( 0);
                    .right( 0);
                    text-align: center;
                    transition: color ease-in 0.125s;
                }
            }
        }
    }
}
</style>

