<template>
<div class="stats">
    <h1>Stat Calculations</h1>
    <div class="go-back"
        v-on:click="goBack">
        <i class="fa fa-angle-double-left"></i>Back
    </div>
    <div v-if="multiview">

        <!-- <label>Lvl </label>
        <input v-model="globalLvl" type="number" min="1" max="100" />
        <button v-on:click="setLevel">
            Set all to Lvl {{ globalLvl }}
        </button> -->
        
        <h2>Final Damage</h2>
        <gen-stat-small stat="fd"></gen-stat-small>

        <h2>Final Damage (Linear)</h2>
        <gen-stat-small stat="fdlin"></gen-stat-small>

        <h2>Critical Chance</h2>
        <gen-stat-small stat="crit"></gen-stat-small>

        <h2>Critical Damage</h2>
        <gen-stat-small stat="critdmg"></gen-stat-small>

        <h2>Defense</h2>
        <gen-stat-small stat="def"></gen-stat-small>


    </div>
    <div v-else>
        <h2>{{ statName }}</h2>

        <h3>Amount to Cap by Level</h3>
        <div class="chart-container">
            <stat-line-chart :stat="stat"></stat-line-chart>
        </div>

        <h3>Percentage by Level</h3>
        <label for="val">Enter stat amount:</label>
        <input v-model="value" type="number" v-on:blur="updateChart" v-on:keyup.enter="unfocus" ref="STAT" id="val"/>
        <div class="chart-container">
            <stat-equal-line-chart :stat="stat" :value="value"></stat-equal-line-chart>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import GenStatSmall from '@/components/general/stat/GenStatSmall';
import StatName from '@/const/StatName';
import StatCalc from '@/api/StatCalc';
import StatLineChart from '@/components/general/stat/StatLineChart';

Vue.component('gen-stat-small', GenStatSmall);

export default {
    name: 'genstats',
    data () {
        return {
            globalLvl: 95,
            stat: '',
            value: 0,
        };
    },
    watch: {
        '$route' (to, from) {
            if (to.params.statName !== from.params.statName) {
                this.value = 0;
                this.fetchData();
            }
        }
    },
    computed: {
        visible(stat) {
            return this.stat === stat || this.stat === "";
        },
        statName() {
            return StatName[this.stat];
        },
        multiview() {
            return this.stat === '';
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            let statName = this.$route.params.statName;
            this.stat = statName ? statName : '';
        },
        updateChart() {

        },
        unfocus(evt) {
            evt.target.blur();
        },
        goBack() {
            this.$router.back();
        }
    },
    StatName: StatName
}
</script>

<style lang="less" scoped>
@import "../../../less/core.less";

.stats {
    .chart-container {
        margin-top: 10px;
        height: 370px;
    }

    label {
        display: inline-block;
        font-size: 18px;
    }

    input[type="number"] {
        width: 5em;
        margin: 0 0 20px 10px;
        text-align: left;
        background: none;
        border: none;
        color: @dv-c-foreground;
        font-size: 24px;
        border-bottom: 1px solid transparent;
        border-bottom: 1px solid fade(@dv-c-foreground, 70%);
        transition: border-color ease-in 0.125s;

        &:focus,
        &:hover:focus {
            border-bottom: 1px solid @dv-c-foreground;
        }
        
        &:hover {
            border-bottom: 1px solid fade(@dv-c-foreground, 90%);
        }

        &::selection {
            background: @dv-c-foreground;
            color: @dv-c-background;
        }
    }
}
</style>
