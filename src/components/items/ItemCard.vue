<template>
    <div class="item-card" v-if="valid">
        <router-link v-if="!noLink" :to="{path: `/items/${itemEasyUrl}`, query: itemQuery}">
            <transition name="fade">
            <div v-if="loading" class="loading">
                <load-indicator
                :loadText="`Item #${itemId}`" inline></load-indicator>
            </div>
            </transition>
            <transition name="fade">
                <div v-if="!loading" class="entry">
                    <div class="icon">
                        <item-icon 
                            class="centering"
                            :iconIndex="itemData.iconIndex" 
                            :rank="itemData.rank"
                            :count="stackSize"
                            :type="itemData.type.type"
                        ></item-icon>
                    </div>
                    <div class="rate" v-if="rate">
                        {{ rate | rate}}%
                    </div>
                    <div class="title">
                        <div class="remark">
                            <span class="iid">#{{ itemId }}</span>
                        </div>
                        <div class="head">
                            <span v-if="goldAmt">{{ goldAmt | thousands }}</span>
                            {{ name }}
                        </div>
                        <div class="remark">
                            <span v-if="itemData.level > 1" class="level">{{ itemData.level }} </span> 
                            <span v-if="itemData.tier" class="tier" v-html="itemData.tier"></span>
                            <span :class="'rank-' + itemData.rank.toLowerCase()">{{ itemData.rank }}</span> 
                            <span v-if="timeLimit">{{ timeLimit }}-day</span>
                            <span v-else-if="itemData.durationDays">{{ itemData.durationDays }}-day</span>
                            <span v-if="canUse" class="can-use">{{ canUse }}</span>
                            <span v-if="itemData.cashItem" class="cash">Cash</span>
                            {{ category }}
                        </div>
                    </div>
                    <div class="potential" v-if="potentialNum">
                        <div class="wrapper">
                            Option
                            <div class="potential-entry" v-for="s in potentialStatList" :key="s.abbv">
                                {{s.abbv}}
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </router-link>
        <div v-else v-on:click="onClick">
            <transition name="fade">
                <div v-if="loading" class="loading">
                    <div class="loader-box">
                        <div class="loader"></div>
                        <div class="label">Loading #{{itemId}}</div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                                <div v-if="!loading" class="entry">
                    <div class="icon">
                        <item-icon 
                            class="centering"
                            :iconIndex="itemData.iconIndex" 
                            :rank="itemData.rank"
                            :count="stackSize"
                            :type="itemData.type.type"
                        ></item-icon>
                    </div>
                    <div class="rate" v-if="rate">
                        {{ rate | rate}}%
                    </div>
                    <div class="title">
                        <div class="remark">
                            <span class="iid">#{{ itemId }}</span>
                        </div>
                        <div class="head">
                            <span v-if="goldAmt">{{ goldAmt | thousands }}</span>
                            {{ name }}
                        </div>
                        <div class="remark">
                            <span v-if="itemData.level > 1" class="level">{{ itemData.level }} </span> 
                            <span v-if="itemData.tier" class="tier" v-html="itemData.tier"></span>
                            <span :class="'rank-' + itemData.rank.toLowerCase()">{{ itemData.rank }}</span> 
                            <span v-if="timeLimit">{{ timeLimit }}-day</span>
                            <span v-else-if="itemData.durationDays">{{ itemData.durationDays }}-day</span>
                            <span v-if="canUse" class="can-use">{{ canUse }}</span>
                            <span v-if="itemData.cashItem" class="cash">Cash</span>
                            {{ category }}
                        </div>
                    </div>
                    <div class="potential" v-if="potentialNum">
                        <div class="wrapper">
                            Option
                            <div class="potential-entry" v-for="s in potentialStatList" :key="s.abbv">
                                {{s.abbv}}
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import ItemIcon from "@/components/game/ItemIcon";
import ItemStat from "@/api/item/itemstat";

import Item from "@/api/item/item";

Vue.component('item-icon', ItemIcon);

export default {
    props: [
        "itemId", 
        "count", 
        "itemStub", 
        "noLink", 
        "onClick",
        "timeLimit",
        "goldAmt",
        "potentialNum",
        "rate"
    ],
    name: "item-page",
    data: function() {
        return {
            stackSize: 0,
            loading: true,
            itemData: null,
            valid: true,
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        itemId(to, from) {
            if (to != from) {
                this.fetchData();
            }
        },
        count(to, from) {
            if (to != from) {
                this.stackSize = to;
            }
        }
    },
    computed: {
        name() {
            if (this.itemData.name) {
                if (this.itemData.name.name && this.itemData.name._NameID) {
                    return this.itemData.name.name;
                } else if (this.itemData.name._NameID) {
                    return "Item MID: " + this.itemData.name._NameID;
                }
            }
            
            return "Unnamed Item " + this.itemId;
        },
        canUse() {
            if (this.itemData.needClass) {
                return this.itemData.needClass.filter(c => c.id != 0).map(c => c.displayName).join("/\u200B");
            }

            return null;
        },
        category() {
            return Item.getItemDetailedCategory(this.itemData);
        },
        statSet() {
            return ItemStat.joinStatSet(this.itemData.stats);
        },
        itemQuery() {
            let ret = {};
            if (this.potentialNum) {
                ret.potential = this.potentialNum;
            }

            return ret;
        },
        potentialStatList() {
            if (this.itemData.potentials && this.potentialNum) {
                let potentials = this.itemData.potentials;
                for (let k in potentials) {
                    let v = potentials[k];
                    if (v.potentialNumber == this.potentialNum) {
                        let ret = [];
                        let states = v.states;
                        let retSet = {};
                        for (let k1 in states) {
                            let key = states[k1].state;
                            let stateInfo = ItemStat.getStateInfo(key);
                            if (stateInfo.minmax) {
                                key = stateInfo.minmax;
                                stateInfo = ItemStat.getStateInfo(key);
                            }

                            if (!retSet[key]) {
                                retSet[key] = stateInfo;
                                ret.push(stateInfo);
                            }
                        }

                        return ret.slice(0, Math.min(3, ret.length));
                    }
                }
            } else {
                return [];
            }
        },
        itemEasyUrl() {
            return Item.itemEasyUrl(this.itemId, this.itemData ? this.itemData : this.itemStub);
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.itemData = null;
            this.stackSize = this.count;
            this.valid = true;

            if (this.itemStub) {
                this.itemData = this.itemStub;
                if (!this.itemData.type) {
                    this.valid = false;
                    return;
                }
                this.loading = false;
                return;
            }

            Item.getItem(this.itemId, this.$store.state.regionCode,
                (res) => {
                    this.itemData = res;
                    this.loading = false;
                },
                (err) => {

                });
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-card {
    position: relative;
    padding: 0 0 0 10px;
    min-height: 64px;
    height: 100%;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.375);

    transition: background-color ease-in 0.125s;

    &:hover,
    &.active:hover {
        background: fade(@dv-c-foreground, 30%);
    }

    &.active {
        background: fade(@dv-c-foreground, 20%);
    }

    .entry {
        position: relative;
        padding: 4px 0;
        display: flex;
        flex-direction: row;
        color: @dv-c-body;

        .icon{ 
            flex: 0 0 50px;
            width: 50px;
            vertical-align: middle;

            .centering {
                position: absolute;
                top: 12px;
                // transform: translate(0px, -50%);
            }
        }
        
        &:hover .title {
            .remark {
                .iid {
                    color: @dv-c-body;
                }

                .level::before {
                    color: @dv-c-body;
                }
            }
        }
        
        .title {
            flex: 1 1 auto;
            padding-left: 12px;
            padding-top: 0px;
            padding-bottom: 20px;

            &:last-child {
                padding-right: 40px;
            }

            .head {
                margin: -2px 0;
                padding: 0;
                font-size: 16px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                font-family: @dv-f-geomanist;
                color: @dv-c-foreground;
            }


            .remark {
                font-size: 12px;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                word-wrap: break-word;

                .iid {
                    color: fade(@dv-c-body, 20%);
                    transition: color ease-in 0.125s;
                }

                .tier {
                    display: inline-block;
                }

                .level {
                    color: @dv-c-accent-2;
                    &::before {
                        content: "LV ";
                        font-size: 0.625em;
                        color: @dv-c-accent-1;
                        transition: color ease-in 0.125s;
                    }
                }

                .can-use {
                    color: @dv-c-accent-2;
                }

                .cash {
                    color: #10A020;
                }
            }
        }

        .potential {
            flex: 0 0 80px;
            position: relative;
            color: @dv-c-accent-1;
            font-size: 10px;
            font-weight: normal;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-align: center;
            .wrapper {
                position: absolute;
                right: 0;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
            }

            .potential-entry {
                font-size: 14px;
                color: @dv-c-foreground;
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
            }
        }

        &:hover .rate {
            color: @dv-c-foreground;
        }
    }

    .loading {
        .loader-box {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
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
