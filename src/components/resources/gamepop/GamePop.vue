<template>
<div class="game-pop">
    <h1>Server Stats</h1>

    <div class="section">
        <div class="stat">
            <h2 class="head">Connected Accounts</h2>
            <div class="value">
                {{ lastEntry ? lastEntry.cp.toLocaleString() : "--" }}
            </div>
            <div class="footer" v-if="lastEntry">
                As of {{ moment(lastEntry.t).format("MMM DD YYYY HH:mm") }}
            </div>
        </div>

        <div class="interval">
            Current interval from 
            <strong v-if="lastEntry">{{ moment(lastEntry.t).format("MMM DD YYYY HH:mm")}}</strong><strong v-else>-</strong> 
            to 
            <strong v-if="lastEntry">{{ moment().subtract(this.range.d, this.range.uu).format("MMM DD YYYY HH:mm")}}</strong><strong v-else>-</strong> 
        </div>

        <div v-if="popData" class="chart-container">
            <server-pop-chart :popData="popData" :range="range"/>
        </div>

        

    </div>
</div>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import Region from '@/api/region'

import ServerPopChart from './ServerPopChart';

Vue.component("server-pop-chart", ServerPopChart);

const RANGE_OPTIONS = [
    {
        name: "6 Months",
        id: "180d",
        d: 180,
        u: "d",
        uu: "days"
    },
    {
        name: "30 Days",
        id: "30d",
        d: 30,
        u: "d",
        uu: "days"
    },
    {
        name: "14 Days",
        id: "14d",
        d: 14,
        u: "d",
        uu: "days"
    },
    {
        name: "7 Days",
        id: "7d",
        d: 7,
        u: "d",
        uu: "days"
    },
    {
        name: "1 Day",
        id: "1d",
        d: 1,
        u: "d",
        uu: "days"
    },
    {
        name: "12 Hours",
        id: "12h",
        d: 12,
        u: "h",
        uu: "hours"
    },
    {
        name: "6 Hours",
        id: "6h",
        d: 6,
        u: "h",
        uu: "hours"
    },
    {
        name: "1 Hour",
        id: "1h",
        d: 1,
        u: "h",
        uu: "hours"
    }
]

export default {
    data() {
        return {
            range: RANGE_OPTIONS[6],    //  12 hours
            popData: null,
            loading: true,
            error: null,
            refreshTimer: null,
        }
    },
    computed: {
        lastEntry() {
            if (this.popData && this.popData.length > 0) {
                return this.popData[this.popData.length - 1];
            } else {
                return null;
            }
        }
    },
    created() {
        this.load();
        this.refreshTimer = window.setInterval(() => {
            console.log("Refreshing");
            this.load();
        }, 15*60*1000);
    },
    methods: {
        load() {
            this.loading = true;
            Region.getServerStats(null, this.range).then((d) => {
                this.popData = d.body;
                this.loading = false;
            }, (err) => {
                console.error(err);
                this.error = err;
                this.loading = false;
            })
        },
        moment(val) {
            return moment(val);
        }
    },
    beforeDestroy() {
        window.clearInterval(this.refreshTimer);
    }
}
</script>

<style lang="less">
@import "../../../less/core.less";

.game-pop {
    position: relative;

    .chart-container {
        margin: 10px 0;
    }

    .interval {
        margin: 10px 0;
    }

    .stat {
        margin-right: 12px;
        padding: 10px 16px;
        background-color: fade(@dv-c-background, 40%);
        border-left: 4px solid @dv-c-accent-1;

        transition: background-color ease-in 0.125s, border-color ease-in 0.125s;

        &:hover {
            background-color: @dv-c-background;
            border-color: @dv-c-foreground;
        }

        .head {
            font-family: @dv-f-geomanist;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: @dv-c-foreground;
            margin: 0;
        }

        .value {
            font-family: @dv-f-lato;
            // font-weight: 300;
            font-size: 36px;
            letter-spacing: 0.1em;
            color: @dv-c-body;
            text-transform: uppercase;
        }

        .footer {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            color: @dv-c-idle;
        }
    }
}

</style>
