<template>
<div class="game-pop">
    <h1>Server Stats</h1>

    <div class="section">
        <h2 class="head">Players Online</h2>

        <div class="info toast">
            <div class="icon">
                <i class="fa fa-clock-o"></i>
            </div>
            <div class="content">
                <div class="heading">
                    OwO whats this?
                </div>
                <p>
                    This displays the number of accounts (aggregate) logged in to DN at a given point in time. 
                    Data is updated approximately every 15 minutes although sampling gaps exist due to server reliability.
                </p>
            </div>
        </div>
        
        <div>
            Range: 
            <select v-model="range">
                <option disabled value="">Please select one</option>
                <option :value="v" v-for="v in options" :key="v.id">
                    {{ v.name }}
                </option>
            </select>
            <div class="interval">
                Showing 
                <strong v-if="lastServerEntry">{{ moment().subtract(this.range.d, this.range.uu).format("MMM DD YYYY HH:mm")}}</strong><strong v-else>-</strong> 
                to 
                <strong v-if="lastServerEntry">{{ moment(lastServerEntry.t).format("MMM DD YYYY HH:mm")}}</strong><strong v-else>-</strong> 
            </div>
        </div>

        <div class="summary">
            <div class="sum-stat">
                <div class="title">Min</div>
                <div class="value">{{summaryServer.min | thousands}}</div>
            </div>
            <div class="sum-stat">
                <div class="title">Max</div>
                <div class="value">{{summaryServer.max | thousands}}</div>
            </div>
            <div class="sum-stat">
                <div class="title">Mean</div>
                <div class="value">{{summaryServer.mean | thousandsFloor}}</div>
            </div>
            <div class="sum-stat">
                <div class="title">Median</div>
                <div class="value">{{summaryServer.median | thousandsFloor}}</div>
            </div>
        </div>
        
        <div v-if="serverPop.data" class="chart-container">
            <transition name="fade">
                <div v-if="serverPop.loading" class="loading">
                    <load-indicator inline
                    loadText="Pulling fresh data" altText="Please wait" class="loader"/>
                </div>
            </transition>
            <transition name="fade">
            <div v-if="!serverPop.loading" class="stat">
                <div class="head">
                    Players Online
                </div>
                <div class="value">
                    {{ lastServerEntry ? lastServerEntry.cp.toLocaleString() : "--" }}
                </div>
                <div class="footer" v-if="lastServerEntry">
                    At {{ moment(lastServerEntry.t).format("MMM DD YYYY HH:mm") }}
                </div>
            </div>
            </transition>
            <server-pop-chart :popData="serverPop.data" :range="range"/>
        </div>
    </div>

    
    <div class="section">
        <h2 class="head">Saint's Haven Breakdown</h2>

        <div>
            Range: 
            <select v-model="range">
                <option disabled value="">Please select one</option>
                <option :value="v" v-for="v in options" :key="v.id">
                    {{ v.name }}
                </option>
            </select>
            <div class="interval">
                Showing 
                <strong v-if="lastChEntry">{{ moment().subtract(this.range.d, this.range.uu).format("MMM DD YYYY HH:mm")}}</strong><strong v-else>-</strong> 
                to 
                <strong v-if="lastChEntry">{{ moment(lastChEntry.t).format("MMM DD YYYY HH:mm")}}</strong><strong v-else>-</strong> 
            </div>
        </div>

        <div v-if="channelPop.data" class="chart-container">
            <transition name="fade">
                <div v-if="channelPop.loading" class="loading">
                    <load-indicator inline
                    loadText="Pulling fresh data" altText="Please wait" class="loader"/>
                </div>
            </transition>
            <channel-pop-chart :popData="channelPop.data" :range="range"/>
        </div>
        <div class="summary">
            <!-- <div class="sum-stat">
                <div class="title">Min</div>
                <div class="value">{{summary.min | thousands}}</div>
            </div>
            <div class="sum-stat">
                <div class="title">Max</div>
                <div class="value">{{summary.max | thousands}}</div>
            </div>
            <div class="sum-stat">
                <div class="title">Mean</div>
                <div class="value">{{summary.mean | thousandsFloor}}</div>
            </div>
            <div class="sum-stat">
                <div class="title">Median</div>
                <div class="value">{{summary.median | thousandsFloor}}</div>
            </div> -->
        </div>

        <div class="refresh">
            Refreshing in {{ refreshCountdown }}s {{ new Array(3 - (refreshCountdown % 4)).fill('.').join('') }}
            <div class="toploader">
                <div class="bar" :style="'width:' + refreshCountdownPercent * 100 + '%'" />
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import Region from '@/api/region'

import ServerPopChart from './ServerPopChart';
import ChannelPopChart from './ChannelPopChart';

Vue.component("server-pop-chart", ServerPopChart);
Vue.component("channel-pop-chart", ChannelPopChart);

const RANGE_OPTIONS = [
    {
        name: "6 Months",
        id: "180d",
        d: 180,
        u: "d",
        uu: "days",
        du: "month",
    },
    {
        name: "30 Days",
        id: "30d",
        d: 30,
        u: "d",
        uu: "days",
        du: "day"
    },
    {
        name: "14 Days",
        id: "14d",
        d: 14,
        u: "d",
        uu: "days",
        du: "day"
    },
    {
        name: "7 Days",
        id: "7d",
        d: 7,
        u: "d",
        uu: "days",
        du: "day"
    },
    {
        name: "1 Day",
        id: "1d",
        d: 1,
        u: "d",
        uu: "days",
        du: "hour"
    },
    {
        name: "12 Hours",
        id: "12h",
        d: 12,
        u: "h",
        uu: "hours",
        du: "hour"
    },
    {
        name: "6 Hours",
        id: "6h",
        d: 6,
        u: "h",
        uu: "hours",
        du: "hour"
    },
    {
        name: "1 Hour",
        id: "1h",
        d: 1,
        u: "h",
        uu: "hours",
        du: "minute"
    }
]

const refreshDuration = 300;

export default {
    data() {
        return {
            options: RANGE_OPTIONS,
            range: RANGE_OPTIONS[4],    //  24 hours
            serverPop: {
                data: [],
                loading: true,
                error: null,
            },
            channelPop: {
                data: [],
                loading: true,
                error: null,
            },
            refreshTimer: null,
            refreshCountdown: refreshDuration,
        }
    },
    computed: {
        lastServerEntry() {
            if (this.serverPop.data && this.serverPop.data.length > 0) {
                return this.serverPop.data[this.serverPop.data.length - 1];
            } else {
                return null;
            }
        },
        lastChEntry() {
            if (this.channelPop.data && this.channelPop.data.length > 0) {
                return this.channelPop.data[this.channelPop.data.length - 1];
            } else {
                return null;
            }
        },
        refreshCountdownPercent() {
            return 1 - this.refreshCountdown / refreshDuration;
        },
        summaryServer() {
            if (!this.serverPop.data.length) {
                return {
                    dat: [],
                    max: 0,
                    min: 0,
                    mean: 0,
                    median: 0,
                };
            }

            let dat = this.serverPop.data.map(d => d.cp).sort();
            let med = 0;
            let half = ~~(dat.length / 2);
            if (dat.length % 2 == 0) {
                med = (dat[half] + dat[half + 1]) / 2;
            } else {
                med = dat[half];
            }

            return {
                dat: dat,
                max: Math.max(...dat),
                min: Math.min(...dat),
                mean: dat.reduce((t, n) => t + n) / dat.length,
                median: med,
            }
        },
    },
    watch: {
        range(from, to) {
            if (from.id != to.id) {
                this.load();
            }
        }
    },
    created() {
        this.load();
        this.refreshTimer = window.setInterval(() => {
            this.refreshCountdown--;
            if (this.refreshCountdown <= 1 && this.refreshCountdown > 0) {
                this.loading = true;
            }
            if (this.refreshCountdown <= 0) {
                console.log("Refreshing");
                this.load();
            }
        }, 1000);
    },
    methods: {
        load() {
            this.loadServer();
            this.loadChannel();
        },
        loadServer() {
            this.serverPop.loading = true;
            Region.getServerStats(null, this.range).then((d) => {
                this.serverPop.data = d.body;
                this.serverPop.loading = false;
                this.refreshCountdown = refreshDuration;
            }, (err) => {
                console.error("Server", err);
                this.serverPop.error = err;
                this.serverPop.loading = false;
                this.refreshCountdown = refreshDuration;
            })
        },
        loadChannel() {
            this.channelPop.loading = true;
            Region.getChannelStats(null, 11, this.range).then((d) => {
                this.channelPop.data = d.body;
                this.channelPop.loading = false;
                this.refreshCountdown = refreshDuration;
            }, (err) => {
                console.error("Channel", err);
                this.channelPop.error = err;
                this.channelPop.loading = false;
                this.refreshCountdown = refreshDuration;
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
        position: relative;

        &:hover {
            .stat {
                opacity: 0.2;
            }
        }
    }

    .interval {
        margin: 4px 0 10px 10px;
        display: inline-block;
    }

    .loading {
        pointer-events: none;
        position: absolute;
        top: 40%;
        left: 55%;
        width: 300px;
        transform: translate(-50%, -50%);
    }

    .refresh {
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 12px;
        color: @dv-c-idle;

        .toploader {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            .bar {
                background-color: @dv-c-foreground;
                height: 100%;
                transition: width 1s linear;
                box-shadow: 0 0 10px 2px fade(@dv-c-foreground, 40%);
            }
        }
    }

    .stat {
        position: absolute;
        top: 45.5%;
        left: 50%;
        width: 300px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        text-align: center;
        opacity: 1.0;
        transition: opacity ease-in 0.125s;
        
        .head {
            font-family: @dv-f-geomanist;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: @dv-c-accent-2;
            text-shadow: 0px 0px 10px @dv-c-accent-2;
            font-size: 12px;
        }

        .value {
            font-family: @dv-f-lato;
            // font-weight: 300;
            font-size: 48px;
            letter-spacing: 0.1em;
            color: @dv-c-foreground;
            text-transform: uppercase;
            text-shadow: 0px 0px 10px @dv-c-foreground;
        }

        .footer {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            color: @dv-c-accent-2;
            text-shadow: 0px 0px 10px @dv-c-accent-2;
        }
    }

    .summary {
        display: flex;
        flex-direction: row;
        .sum-stat {
            flex: 1 1 auto;
            margin-right: 12px;
            flex: 1 1 auto;
            padding: 4px 10px;
            background-color: fade(@dv-c-background, 40%);
            border-left: 4px solid @dv-c-accent-1;

            .title {
                font-family: @dv-f-geomanist;
                letter-spacing: 0.3em;
                text-transform: uppercase;
                color: @dv-c-foreground;
                font-size: 12px;
            }

            .value {
                font-family: @dv-f-lato;
                // font-weight: 300;
                font-size: 16px;
                letter-spacing: 0.1em;
                color: @dv-c-body;
                text-transform: uppercase;
            }
        }
    }
}

</style>
