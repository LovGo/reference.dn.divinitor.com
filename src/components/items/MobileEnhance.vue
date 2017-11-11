<template>
<div class="mobile-enchant">
    <transition name="fade">
        <div v-if="loading" class="loading">
            <div class="loader-box">
                <div class="loader"></div>
                <div class="label">Loading</div>
            </div>
        </div>
    </transition>
    <transition name="fade">
        <div v-if="!loading" class="entry">
            You can enhance <strong>Lv 95</strong> equipment at the following rates:
            <table class="rates">
                <thead>
                    <th class="first">Level</th>
                    <th class="ranks" v-for="rank in rankSet" :key="rank">
                        {{ rank }}
                    </th>
                </thead>
                <tr v-for="level in levelSet" :key="level">
                    <th>+{{level}}</th>
                    <td v-for="rank in rankSet" :key="rank">
                        {{ getRate(level, rank) | enhancePercent }}%
                    </td>

                </tr>
            </table>
        </div>
    </transition>
</div>
</template>

<script>
import Vue from 'vue';
import ItemIcon from "@/components/game/ItemIcon";
import ItemCard from "@/components/items/ItemCard";
import ItemStat from "@/api/item/itemstat";

import Item from "@/api/item/item";

Vue.component('item-icon', ItemIcon);
Vue.component('item-card', ItemCard);

export default {
    props: ["mobileEnchantId"],
    data: function() {
        return {
            loading: true,
            enchantData: null,
        }
    },
    created() {
        this.fetchData();
    },
    computed: {
        levelSet() {
            let ret = {};
            for (let k in this.enchantData) {
                let d = this.enchantData[k].rates;
                for (let j in d) {
                    ret[j] = true;
                }
            }
            let rret = [];
            for (let k in ret) {
                rret.push(Number(k));
            }

            return rret;
        },
        rankSet() {
            let ret = [];
            for (let k in this.enchantData) {
                let d = this.enchantData[k].rank;
                ret.push(d);
            }

            return ret;
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.enchantData = null;
            Item.getMobileEnchantInfo(this.mobileEnchantId, this.$store.state.regionCode,
                (res) => {
                    this.enchantData = res;
                    this.loading = false;
                },
                (err) => {

                });
        },
        getRate(level, rank) {
            for (let k in this.enchantData) {
                let d = this.enchantData[k];
                if (d.rank === rank) {
                    return Number(d.rates[String(level)]);
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.mobile-enchant {
    position: relative;
    min-height: 70px;

    .rates {
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
                text-align: left;

                &.first {
                    border-right: 2px solid @dv-c-body;
                    width: 50px;
                    text-align: right;
                }

                &.ranks {
                    width: 80px;
                    text-align: center;
                }
            }

            tr:hover {
                background: none;
            }
        }

        tr {
            padding-left: 0.125em;
            transition: background-color 0.25s ease-in;
        }

        tr:hover {
            background-color: rgba(0, 0, 0, 0.75);
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
