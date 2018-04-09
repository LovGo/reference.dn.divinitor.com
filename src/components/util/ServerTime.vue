<template>
    <div class="server-time">
        <div class="timer current-time">
            <div class="head">
                Current server time
            </div>
            <div class="time" :big="big">
                {{ time }}
            </div>
            <div class="footer">
                Pacific Time Zone ({{ serverTimeZone }} UTC)
            </div>
        </div>
        <div class="reset-timers">
            <div class="timer daily-reset-timer">
                <div class="head">
                    Daily reset in
                </div>
                <div class="time">
                    {{ dailyResetCountdown }}
                </div>
                <div class="footer">
                    {{ nextDailyReset }}
                </div>
            </div>
            <div class="timer reward-reset-timer">
                <div class="head">
                    Daily rewards in
                </div>
                <div class="time">
                    {{ dailyRewardCountdown }}
                </div>
                <div class="footer">
                    {{ nextDailyReward }}
                </div>
            </div>
            <div class="timer weekly-reset-timer">
                <div class="head">
                    Weekly reset in
                </div>
                <div class="time">
                    {{ weeklyResetCountdown }}
                </div>
                <div class="footer">
                    {{ nextWeeklyReset }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import Moment from 'moment';
import * as Timezone from 'moment-timezone';

export default {
    props: ["big"],
    data() {
        return {
            intervalId: 0,
            time: "-- : -- : --",
            serverTimeZone: Moment().tz("America/Los_Angeles").format("ZZ"),
            dailyResetCountdown: "--h --m",
            nextDailyReset: "-- : -- : --",
            nextDailyResetTime: null,

            dailyRewardCountdown: "--h --m",
            nextDailyReward: "-- : -- : --",
            nextDailyRewardTime: null,

            weeklyResetCountdown: "--h --m",
            nextWeeklyReset: "-- : -- : --",
            nextWeeklyResetTime: null,
        };
    },
    created() {
        this._initClocks();
        this.intervalId = window.setInterval(() => this._updateClock(), 1000);
        this._updateClock();
    },
    destroyed() {
        window.clearInterval(this.intervalId);
    },
    methods: {
            _initClocks() {
                let localtz = Moment.tz.guess();
            let now = Moment();
            let nowPST = now.tz("America/Los_Angeles");
            let todayDailyReset = nowPST.clone().hour(9).minutes(0).seconds(0);
            let todayRewardReset = nowPST.clone().hour(0).minutes(0).seconds(0);
            let weeklyReset = nowPST.clone().day("Saturday").hour(9).minutes(0).seconds(0);
            if (nowPST.isAfter(todayDailyReset)) {
                todayDailyReset.add(1, "day");
            }
            if (nowPST.isAfter(todayRewardReset)) {
                todayRewardReset.add(1, "day");
            }
            if (nowPST.isAfter(weeklyReset)) {
                weeklyReset.add(1, "week");
            }

            this.nextDailyResetTime = todayDailyReset;
            this.nextDailyReset = todayDailyReset.tz(localtz).format("M/D HH:mm z");
            this.nextDailyRewardTime = todayRewardReset;
            this.nextDailyReward = todayRewardReset.tz(localtz).format("M/D HH:mm z");
            this.nextWeeklyResetTime = weeklyReset;
            this.nextWeeklyReset = weeklyReset.tz(localtz).format("M/D HH:mm z");
        },
        _updateClock() {
            let now = Moment();
            let nowPST = now.tz("America/Los_Angeles");
            this.time = nowPST.format("HH:mm:ss");
            
            if (nowPST.isAfter(this.nextDailyRestTime)) {
                this._initClocks();
            }
            let dailyResetDuration = Moment.duration(this.nextDailyResetTime.diff(nowPST));
            if (dailyResetDuration.hours() == 0) {
                this.dailyResetCountdown = `${dailyResetDuration.minutes()}m ${dailyResetDuration.seconds()}s`;
            } else {
                this.dailyResetCountdown = `${dailyResetDuration.hours()}h ${dailyResetDuration.minutes()}m`;
            } 

            if (nowPST.isAfter(this.nextDailyRewardTime)) {
                this._initClocks();
            }
            let dailyRewardDuration = Moment.duration(this.nextDailyRewardTime.diff(nowPST));
            if (dailyRewardDuration.hours() == 0) {
                this.dailyRewardCountdown = `${dailyRewardDuration.minutes()}m ${dailyRewardDuration.seconds()}s`;
            } else {
                this.dailyRewardCountdown = `${dailyRewardDuration.hours()}h ${dailyRewardDuration.minutes()}m`;
            }
            
            if (nowPST.isAfter(this.nextWeeklyResetTime)) {
                this._initClocks();
            }
            let weeklyResetDuration = Moment.duration(this.nextWeeklyResetTime.diff(nowPST));
            if (weeklyResetDuration.hours() == 0) {
                this.weeklyResetCountdown = `${weeklyResetDuration.minutes()}m ${weeklyResetDuration.seconds()}s`;
            } else if (weeklyResetDuration.days() == 0) {
                this.weeklyResetCountdown = `${weeklyResetDuration.hours()}h ${weeklyResetDuration.minutes()}m`;
            } else {
                this.weeklyResetCountdown = `${weeklyResetDuration.days()}d ${weeklyResetDuration.hours()}h`;
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.server-time {
    margin: 20px 0;

    .reset-timers {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .current-time {
        margin-bottom: 14px;
    }

    .timer {
            margin-right: 12px;
        flex: 1 1 auto;
        padding: 10px 16px;
        background-color: fade(@dv-c-background, 40%);
        border-left: 4px solid @dv-c-accent-1;

        transition: background-color ease-in 0.125s, border-color ease-in 0.125s;

        &:hover {
            background-color: @dv-c-background;
            border-color: @dv-c-foreground;
        }
    }

    .head {
        font-family: @dv-f-geomanist;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: @dv-c-foreground;
        font-size: 12px;
    }

    .time {
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

</style>
