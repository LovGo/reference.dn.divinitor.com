<template>
<div class="stat-small">
    <div class="data-entry">
        <div class="level">
            <label for="level">Lvl</label>
            <input v-model="level" type="number" min="1" max="100" />
        </div>
        <div class="container">
            <div class="left">
                <input type="radio" id="stat" value="STAT" v-model="inputType" />
                <label for="stat" value="STAT">
                    <div class="tag">Value</div>
                    <input v-model="value" type="number" v-on:click="select" v-on:focus="select" v-on:input="capValue" ref="STAT"/>
                </label>
                <div class="cap">{{ maxStat | thousands }}</div>
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
                    <input v-model="percent" type="number" v-on:click="select" v-on:focus="select" v-on:input="capPercent" ref="PERCENT"/>
                </label>
                <div class="cap percent">{{ maxPercent | thousands }}</div>
            </div>
        </div>
    </div>

    <router-link :to="stat" class="more">More Info<i class="fa fa-angle-double-right"></i></router-link>
</div>
</template>

<script>
import StatName from '@/const/StatName';

export default {
    name: 'genstats-small',
    data () {
        return {
            level: 95,
            value: 0,
            percent: 0,
            minPercent: 0,
            maxPercent: 100,
            minStat: 0,
            maxStat: 9999999,
            inputType: "STAT",
            caps: [],
        };
    },
    props: ["stat"],
    created() {
        this.fetchData();
        this.value = this.minStat;
        this.percent = this.minPercent;
    },
    computed: {
        statName() {
            return StatName[this.stat];
        }
    },
    watch: {
        percent: function(to, from) {
            this.calculate();
        },
        value: function(to, from) {
            this.calculate();
        }
    },
    methods: {
        fetchData() {
            //  Load the stat caps

        },
        select(evt) {
            this.inputType = evt.target.parentNode.attributes.value.value;
            this.$refs[this.inputType].focus();
        },
        calculate() {
            if (this.inputType == "STAT") {
                this.percent = this[this.stat + this.inputType]();
            } else {
                this.value = this[this.stat + this.inputType]();
            }
        },
        capPercent() {
            this.percent = Number(this.percent);
            if (this.percent > this.maxPercent) {
                this.percent = this.maxPercent;
                return false;
            }
            if (this.percent < this.minPercent) {
                this.percent = this.minPercent;
                return false;
            }
        },
        capValue() {
            this.value = Number(this.value);
            if (this.value > this.maxStat) {
                this.value = this.maxStat;
                return false;
            } 
            if (this.value < this.minStat) {
                this.value = this.minStat;
                return false;
            } 
        },
        linearPERCENT() {
            return 12;
        },
        linearSTAT() {
            return 420;
        },
        critPERCENT() {
            return linearPERCENT();
        },
        critSTAT() {
            return linearSTAT();
        },
        critdmgPERCENT() {
            return linearPERCENT();
        },
        critdmgSTAT() {
            return linearSTAT();
        },
        defPERCENT() {
            return linearPERCENT();
        },
        defSTAT() {
            return linearSTAT();

        },
        fdPERCENT() {
            return 0;

        },
        fdSTAT() {
            return 0;

        }
    }
}
</script>

<style lang="less" scoped>
@import "../less/core.less";

.stat-small {
    position: relative;
    border: 1px solid @dv-c-accent-1;
    padding: 10px 10px 40px 10px;
    background-color: rgba(0, 0, 0, 0.25);

    &:hover {
        background-color: rgba(0, 0, 0, 0.75);
    }
    input[type="number"] {
        -moz-appearance:textfield;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
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

            &:focus, &:hover {
                border-bottom: 1px solid @dv-c-foreground;
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
            opacity: 0.5;
            transition: opacity ease-in 0.125s;

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
        right: 0.5em;
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
