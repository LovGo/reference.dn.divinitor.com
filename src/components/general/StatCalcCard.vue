<template>
<div class="stat-small">
    <div class="data-entry">
        <div class="level">
            <label for="level">Lvl</label>
            <input v-model="level" type="number" v-on:keyup.enter="unfocus"/>
        </div>
        <div class="container">
            <div class="left">
                <input type="radio" id="stat" value="STAT" v-model="inputType" />
                <label for="stat" value="STAT">
                    <div class="tag">Value</div>
                    <input v-model="value" type="number" v-on:click="select" v-on:focus="select" v-on:blur="capValue" v-on:keyup.enter="unfocus" ref="STAT"/>
                </label>
                <div class="cap">{{ limits.maxStat | thousands }}</div>
            </div>
            <div class="center">
                <div v-if="inputType == 'STAT'"  class="indicator stat">
                    <span v-on:click="select" value="PERCENT"><i class="fa fa-angle-left left"></i></span>
                    &#8226;
                    <span v-on:click="select" value="STAT"><i class="fa fa-angle-right right"></i></span>
                </div>
                <div v-else class="indicator percent" value="PERCENT">
                    <span v-on:click="select" value="PERCENT"><i class="fa fa-angle-left left"></i></span>
                    &#8226;
                    <span v-on:click="select" value="STAT"><i class="fa fa-angle-right right"></i></span>
                </div>
            </div>
            <div class="right">
                <input type="radio" id="percent" value="PERCENT" v-model="inputType" />
                <label for="percent" value="PERCENT">
                    <div class="tag">Percent</div>
                    <input v-model="percent" type="number" v-on:click="select" v-on:focus="select" v-on:blur="capPercent" v-on:keyup.enter="unfocus" ref="PERCENT"/>
                </label>
                <div class="cap percent">{{ limits.maxPercent }}</div>
            </div>
        </div>
    </div>

    <!-- <router-link :to="`/general/stat/${stat}`" class="more">More Info<i class="fa fa-angle-double-right"></i></router-link> -->
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import StatCalcProvider,{ IStatCalcResult } from "@/api/StatCalcProvider";
import ITypedMap from '@/models/util/ITypedmap';

interface ILimits {
    minPercent: number;
    maxPercent: number;
    minStat: number;
    maxStat: number;
}

interface IData {
    level: number;
    value: number;
    percent: number;
    limits: ILimits;
    inputType: string;
}

export default Vue.extend({
    props: {
        "stat": {
            type: String as () => string,
        }
    },
    data(): IData {
        return {
            level: 95,
            value: 0,
            percent: 0,
            limits: {
                minPercent: 0,
                maxPercent: 100,
                minStat: 0,
                maxStat: 99999
            },
            inputType: "STAT",
        };
    },
    watch: {
        level() {
            this.loadStatCap().then(() => {
                this.calculate();
            });
        },
        percent() {
            if (this.inputType == "PERCENT") {
                this.calculate();
            }
        },
        value() {
            if (this.inputType == "STAT") {
                this.calculate();
            }
        },
    },
    computed: {
        isCritDmg(): boolean {
            return this.stat === "criticalDamage";
        },
    },
    created() {
        this.loadStatCap();
    },
    methods: {
        loadStatCap() {
            if (isNaN(this.level) || this.level <= 0 || this.level > 100) {
                this.limits.maxStat = 0;
                return Promise.resolve();
            }

            return StatCalcProvider.getStatCap(this.level, this.stat).then((caps) => {
                // Check again in case we beat the network
                if (isNaN(this.level) || this.level <= 0 || this.level > 100) {
                    this.limits.maxStat = 0;
                    return;
                }

                this.limits.maxPercent = caps.percent * 100;
                this.limits.maxStat = Math.round(caps.value);
                this.limits.minPercent = 0;

                if (this.isCritDmg) {
                    this.limits.maxPercent += 200;
                    this.limits.minPercent += 2;
                }

                this.percent = this.getTruncatedPercent() * 100;
            });
        },
        unfocus(evt: Event) {
            //@ts-ignore
            evt.target.blur();
        },
        select(evt: Event) {
            if (evt.target == null || !(evt.target instanceof Element) || evt.target.parentNode == null) {
                return;
            }

            this.inputType = (<ITypedMap<any>>(<HTMLElement>evt.target.parentNode).attributes)["value"].value;
            (this.$refs[this.inputType] as HTMLFormElement).focus();
        },
        capValue(evt: Event) {
            this.value = Number(this.value);
            if (this.value > 9999999) {
                this.value = 9999999;
                return false;
            } 
            if (this.value < this.limits.minStat) {
                this.value = this.limits.minStat;
                return false;
            }
        },
        capPercent(evt: Event) {
            this.percent = Number(this.percent);
            if (this.percent > this.limits.maxPercent) {
                this.percent = this.limits.maxPercent;
                return false;
            }
            if (this.percent < this.limits.minPercent) {
                this.percent = this.limits.minPercent;
                return false;
            }
        },
        getTruncatedValue() {
            return Math.min(this.limits.maxStat, Math.max(this.limits.minStat, this.value));
        },
        getTruncatedPercent() {
            return Math.min(this.limits.maxPercent, Math.max(this.limits.minPercent, this.percent / 100));
        },
        async calculate() {
            if (this.inputType == "STAT") {
                let percentVal = await StatCalcProvider.calculatePercent(this.level, this.stat, this.getTruncatedValue());
                let percent = Math.floor(percentVal.percent * 100);
                if (this.isCritDmg) {
                    percent += 200;
                }

                this.percent = percent;
            } else {
                let percent = this.getTruncatedPercent();
                if (this.isCritDmg) {
                    percent -= 2;
                }

                let statVal = await StatCalcProvider.calculateValue(this.level, this.stat, percent);
                this.value = Math.floor(statVal.value);
            }
        },
    },
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.stat-small {
    position: relative;
    border: 1px solid @dv-c-accent-1;
    padding: 10px 10px 40px 10px;
    background-color: rgba(0, 0, 0, 0.25);
    transition: background-color 0.125s ease-in;

    &:hover {
        background-color: rgba(0, 0, 0, 0.75);
    }

    .data-entry {

        input[type="number"] {
            width: 4em;
            margin: 0 auto;
            text-align: center;
            background: none;
            border: none;
            color: @dv-c-foreground;
            font-size: 24px;
            border-bottom: 1px solid transparent;
            transition: border-color 0.125s ease-in;

            &:focus,
            &:hover:focus {
                border-bottom: 1px solid @dv-c-foreground;
            }
            
            &:hover {
                border-bottom: 1px solid fade(@dv-c-foreground, 60%);
            }

            &::selection {
                background: @dv-c-foreground;
                color: @dv-c-background;
            }
        }

        .level {
            text-align: center;
            label {
                display: block;
                width: 100%;
                text-align: center;
                text-transform: uppercase;
                color: @dv-c-accent-2;
                letter-spacing: 0.3em;
                margin: 0 0 0 4px;
                padding: 0;
            }
        }

        .container {
            display: flex;
            margin: 10px auto;

            input[type="number"] {
                width: 100%;
                font-size: 48px;
            }

        }

        .left {
            flex: 1;
            text-align: right;
        }

        .center {
            flex: 0 0 auto;
            text-align: center;
            margin: 12px 20px;
            vertical-align: center;

            .indicator {

                font-size: 64px;
                letter-spacing: -0.1em;
                color: @dv-c-body;
                padding: 0 6px 0 0;

                @active: @dv-c-foreground;
                @idle: @dv-c-idle;

                .left, .right {
                    cursor: pointer;
                }

                &.percent {
                    .left {
                        color: @active;
                    }
                     .right {
                        color: @idle;
                    }
                }

                &.stat {
                    .left {
                        color: @idle;
                    }
                    .right {
                        color: @active;
                    }
                }
            }
        }

        .right {
            flex: 1;
            text-align: left;
        }

        input[type="radio"] {
            display: none;
        }

        input[type="radio"]+label {
            display: block;
            // opacity: 0.75;
            // transition: opacity ease-in 0.125s;

            .tag {
                display: block;
                text-align: center;
                text-transform: uppercase;
                font-family: @dv-f-geomanist;
                letter-spacing: 0.3em;
                color: @dv-c-accent-2;
                font-size: 18px;
            }
        }

        input[type="radio"]:checked+label {
            opacity: 1.0;
        }

        .cap {
            color: @dv-c-idle;
            text-align: center;
            position: relative;
            margin-top: 20px;

            &::before {
                content: "STAT CAP";
                font-size: 10px;
                text-align: center;
                color: @dv-c-accent-1;
                position: absolute;
                left: 0;
                right: 0;
                top: -14px;
            }

            &.percent::after {
                content: "%";
            }
        }
    }

    .more {
        position: absolute;
        bottom: 0.5em;
        .right(0.5em);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 14px;
        color: @dv-c-accent-1;
        &:hover {
            color: @dv-c-foreground;
        }

        .fa {
            margin-left: 0.5em;
            color: @dv-c-accent-2;
            font-size: 18px;
        }
    }

    .hover-show {
        opacity: 0.0;
        transition: opacity ease-in 0.125s;
    }

    &:hover {
        .hover-show {
            opacity: 1.0;
        }
    }
}
</style>

