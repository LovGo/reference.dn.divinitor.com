<template>
<div class="potential-info">
    This item has <strong>{{potentialData.length}}</strong> additional stat options:
    <!-- TODO add filter by stat -->
    <div class="filter" v-if="potentialData.length > 6">
        Filter
    </div>

    <div class="potential-list" :scrollable="potentialData.length > 30">
        <div class="potential-entry" 
            v-for="d in sortedData" 
            :key="d.id" 
            :active="potentialId == d.id"
            v-on:click="select(d.id)">
            <div class="pid">{{d.id}}:{{d.potentialNumber}}</div>
            <div class="grid-cover">
                <stat-grid
                    :statSet="statSet(d)"
                    hideHeader="true"
                    v-if="!d.skill || d.states.length"
                    ></stat-grid>
                <div class="skill-option" v-if="d.skill">
                    <skill-icon :iconIndex="d.skill.iconIndex"></skill-icon>
                    <div class="skill-info">
                        <div class="skill-class">{{d.skill.job.displayName}}</div>
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
import ItemIcon from "@/components/game/ItemIcon";
import ItemStat from "@/api/item/itemstat";
import StatGrid from "@/components/game/StatGrid";
import SkillIcon from "@/components/game/SkillIcon";

import Item from "@/api/item/item";

Vue.component('item-icon', ItemIcon);
Vue.component('stat-grid', StatGrid);
Vue.component('skill-icon', SkillIcon);

export default {
    props: ["potentialData", "selection", "potentialNum"],
    data: function() {
        return {
            potentialId: 0,
        }
    },
    created() {
        this.init();
    },
    computed: {
        sortedData() {
            let ret = this.potentialData.slice();

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
        },
        statSet(potential) {
            return ItemStat.joinStatSet(potential.states, "value");
        },
        select(potentialId) {
            this.potentialId = potentialId;
            this.$emit("potentialIdChange", this.potentialId);
        }
    }

}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.potential-info {
    position: relative;

    .potential-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 10px 0;

        max-height: 650px;
        overflow-y: auto;

        .potential-entry {
            flex: 0 1 250px;
            padding: 8px;
            border: 1px solid @dv-c-foreground;
            cursor: pointer;
            position: relative;
            background: fade(@dv-c-background, 50%);
            transition: background-color ease-in 0.125s;

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
                    .skill-class {
                        color: @dv-c-accent-2;
                    }
                }
            }

            &:hover {
                background: fade(@dv-c-foreground, 30%);

                .pid {
                    color: @dv-c-foreground;
                }
                .rate {
                    color: @dv-c-foreground;
                    &::after {
                        color: @dv-c-accent-2;
                    }
                }

                .skill-option {
                    .skill-class {
                        color: @dv-c-accent-2;
                    }
                }
            }

            .pid {
                position: absolute;
                font-size: 10px;
                top: 4px;
                right: 6px;
                color: transparent;
                transition: color ease-in 0.125s;
            }

            .grid-cover {
                pointer-events: none;
            }

            .skill-option {
                display: flex;
                flex-direction: row;

                .skill-info {
                    margin-left: 8px;
                    margin-right: 24px;
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
                    }
                }
            }

            .rate {
                position: absolute;
                text-align: right;
                right: 0.4em;
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
                    left: 0;
                    right: 0;
                    text-align: center;
                    transition: color ease-in 0.125s;
                }
            }
        }
    }
}
</style>

