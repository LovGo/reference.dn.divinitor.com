<template>
<div class="tunings">
    <transition name="fade">
        <div v-if="loading" class="loading">
            <div class="loader-box">
                <div class="loader"></div>
                <div class="label">Finding tunings</div>
            </div>
        </div>
    </transition>
    <transition name="fade">
        <div class="error" v-if="error">
            <small-error-box 
                :errorTitle="'Failed to load data'" 
                :errorContent="error.statusText + ': ' + error.bodyText" 
                :secondaryInfo="`Item ID #${itemId}`"
                canRetry="true"
                v-on:retry="fetchData"
                iconClass="fa-exclamation-triangle"></small-error-box>
        </div>
    </transition>
    <transition name="fade" appear>
        <div v-if="!loading && !error && Object.keys(data.tunings).length" class="wrapper">
            <div class="title">Tuning</div>
            This item can be tuned using these tuners to get:
            <br/>
            <div class="tuning-list">
                <div class="list-entry" v-for="v in data.tunings" :key="v.tunerId">
                    <div class="tuner" v-if="trimTuners(v).length">
                        <div class="col-title">Tuner #{{v.tunerId}}</div>
                        <div class="item-entry" v-for="t in trimTuners(v)" :key="t.id">
                            <item-card
                                :itemId="t.id"
                                :itemStub="t"></item-card>
                        </div>
                    </div>
                    <div class="tuner" v-else>
                        <div class="col-title">Tuner #{{v.tunerId}}</div>
                        No tuners exist for this tuning.
                    </div>
                    <div class="options">
                        <div class="col-title">Options</div>
                        <div class="item-entry" v-for="t in v.options" :key="t.id">
                            <item-card
                                :itemId="t.id"
                                :itemStub="t"
                                :potentialNum="t.potentialNum"></item-card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</div>
</template>

<script>
import Vue from 'vue';
import ItemCard from "@/components/items/ItemCard";

import Item from "@/api/item/item";

Vue.component('item-card', ItemCard);

export default {
    props: ["itemId", "parentItem"],
    data: function() {
        return {
            loading: true,
            data: null,
            error: null,
        };
    },
    computed: {

    },
    created() {
        this.fetchData();
    },
    watch: {
        itemId(to, from) {
            if (to != from) {
                this.fetchData();
            }
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.data = null;
            this.error = null;
            Item.getItemTunings(this.itemId, this.$store.state.regionCode,
                (res) => {
                    this.error = null;
                    this.data = res;
                    this.loading = false;
                },
                (err) => {
                    this.loading = false;
                    this.error = err;
                });
        },
        trimTuners(v) {
            let ret = [];
            for (let k in v.tuners) {
                if (v.tuners[k].id == 1073894675 && this.parentItem.type.type == "TALISMAN") {
                    continue;
                }
                if (v.tuners[k].id == 1073895685 && this.parentItem.type.type == "WEAPON") {
                    continue;
                }

                ret.push(v.tuners[k]);
            }

            return ret;
        }
    },
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.tunings {
    position: relative;
    // width: 100%;

    .wrapper {
        position: relative;
        margin-top: 40px;
        border-top: 1px solid @dv-c-accent-1;
        padding-top: 4px;
        .title {
            font-size: 12px;
            color: @dv-c-accent-1;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            position: absolute;
            top: -1.3em;
            left: 0;
            user-select: none;
        }

    }

    .tuning-list {
        position: relative;
        display: flex;
        flex-direction: column;

        margin-top: 6px;

        // border-left: 4px solid @dv-c-accent-3;
        // padding-left: 10px;
        // margin-left: 2px;

        .list-entry {
            flex: 0 0 auto;

            position: relative;
            display: flex;
            flex-direction: row;

            border-bottom: 1px solid @dv-c-idle;
            // border: 1px solid @dv-c-accent-2;
            padding: 8px 0 16px 0;

            &:last-child {
                border-bottom: none;
            }
            
            .col-title {
                position: absolute;
                top: -20px;
                left: 0;
                right: 0;
                font-family: @dv-f-geomanist;
                font-size: 14px;
                color: @dv-c-accent-2;
                text-transform: uppercase;
                letter-spacing: 0.2em;
            }

            .tuner {
                position: relative;
                flex: 1 1 0;
                margin-top: 20px;
                
                display: flex;
                flex-direction: column;
                padding-right: 8px;
                border-right: 1px solid @dv-c-idle;
            }

            .options {
                position: relative;
                flex: 1 1 0;
                margin-top: 20px;

                display: flex;
                flex-direction: column;
                margin-left: 8px;
            }

            .item-entry {
                flex: 0 0 auto;
                border: 1px solid @dv-c-foreground;
                border-bottom: none;

                &:last-child {
                    border-bottom: 1px solid @dv-c-foreground;
                }
            }
        }
    }

    .loading {
        position: relative;
        min-height: 70px;
        .loader-box {
            position: absolute;
            // top: 0;
            // left: 0;
            // right: 0;
            // bottom: 0;
            // background: rgba(0, 0, 0, 0.5);
            padding: 16px 0 0 16px;
            min-height: 70px;
            
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

