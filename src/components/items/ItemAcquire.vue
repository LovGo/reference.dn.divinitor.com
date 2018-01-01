<template>
<div class="item-acquire">
    <transition name="fade">
        <div v-if="loading" class="loading">
            <div class="loader-box">
                <div class="loader"></div>
                <div class="label">Finding sources</div>
            </div>
        </div>
    </transition>
    <transition name="fade">
        <div class="result" v-if="!loading">

            <p>
                This item can be acquired from the following:
            </p>

            <div class="acq-list">
                <div class="subsection" v-if="acqData.shop && acqData.shop.length">
                    <h4>Shops</h4>
                    <form class="options">
                        <div class="checkbox">
                            <input type="checkbox" v-model="useGoldenGoose" id="goldenGoose" />
                            <label for="goldenGoose">Use Golden Goose discount (30%)</label>
                        </div>
                    </form>
                    <p>Purchase from the following NPC shops:</p>
                    <div class="shop-list">
                        <div class="shop-entry" v-for="v in acqData.shop" :key="v.shopId">
                            <div class="shop-name">
                                {{v.shopName}}
                            </div>
                            <div class="shop-item-list">
                                <div class="shop-item-entry" v-for="(e, k) in v.entries" :key="k">
                                    <div class="tab">
                                        {{e.tabName}} Tab
                                    </div>

                                    <div class="fee" v-if="e.fees.length">
                                        <div class="fee-entry" v-for="f in e.fees" :key="f.type">
                                            <span class="gold" v-if="f.type == 'GOLD'">
                                                <span v-if="useGoldenGoose">
                                                    {{ f.value * 0.7 | gold }}
                                                </span>
                                                <span v-else>
                                                    {{ f.value | gold }}
                                                </span>
                                            </span>
                                            <span class="item" v-else-if="f.type == 'TICKET'">
                                                <item-icon-tooltip
                                                    :itemId="f.item.id"
                                                    :itemStub="f.item"
                                                    :count="f.value">
                                                </item-icon-tooltip>
                                            </span>
                                            <span class="point" v-else-if="f.type == 'NIGHTMARE_POINT'">
                                                <point-tag pointId="8" :amount="f.value"></point-tag>
                                            </span>
                                            <span class="point" v-else-if="f.type == 'DUNGEON_POINT'">
                                                <point-tag pointId="14" :amount="f.value"></point-tag>
                                            </span>
                                            <span class="point" v-else-if="f.type == 'NEST_POINT'">
                                                <point-tag pointId="13" :amount="f.value"></point-tag>
                                            </span>
                                            <span class="point" v-else-if="f.type == 'LADDER_POINT'">
                                                <point-tag pointId="1" :amount="f.value"></point-tag>
                                            </span>
                                            <span class="point" v-else-if="f.type == 'FRIENDSHIP'">
                                                <span v-if="f.item == 0">
                                                    <point-tag pointId="2" :amount="f.value"></point-tag>
                                                </span>
                                                <span v-else-if="f.item == 1">
                                                    <point-tag pointId="4" :amount="f.value"></point-tag>
                                                </span>
                                                <span v-else-if="f.item == 2">
                                                    <point-tag pointId="3" :amount="f.value"></point-tag>
                                                </span>
                                                <span v-else>
                                                    {{f}}
                                                </span>
                                            </span>
                                            <span class="point" v-else-if="f.type == 'GUILDMASTER_POINT'">
                                                <point-tag pointId="17" :amount="f.value"></point-tag>
                                            </span>
                                            <span class="point" v-else-if="f.type == 'SLAYER_POINT'">
                                                <point-tag pointId="29" :amount="f.value"></point-tag>
                                            </span>
                                            <span class="point" v-else-if="f.type == 'BATTLEFIELD_POINT'">
                                                <point-tag pointId="15" :amount="f.value"></point-tag>
                                            </span>
                                            <span class="point" v-else-if="f.type == 'DAREDEVIL_POINT'">
                                                <point-tag pointId="16" :amount="f.value"></point-tag>
                                            </span>

                                            <span v-else>
                                                Unknown {{f.typeId}} {{f.type}}: {{f.value}}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="req-bar">
                                        <div class="limit" v-if="e.buyLimit && e.buyLimitType != 'NONE'">
                                            <i class="fa fa-clock-o"></i> <strong>{{e.buyLimit}}</strong> per
                                            <span v-if="e.buyLimitType == 'WEEKLY'">week</span>
                                            <span v-else-if="e.buyLimitType == 'DAILY'">day</span>
                                            <span v-else>{{e.buyLimitType}}</span>
                                        </div>
                                        <div class="reqs-label" v-if="e.reqType != 'NONE'">
                                            Requires
                                        </div>
                                        <div class="limit" v-if="e.reqType == 'MIN_LEVEL'">
                                            <i class="fa fa-arrow-circle-o-up"></i> Lv <strong>{{e.requirementValue | thousands}}</strong>+
                                        </div>
                                        <div class="limit" v-else-if="e.reqType == 'ACHIEVEMENT_POINTS'">
                                            <i class="fa fa-star"></i> <strong>{{e.requirementValue | thousands}}</strong>+ achievement points
                                        </div>
                                        <div class="limit" v-else-if="e.reqType == 'LADDER_RANK'">
                                            <i class="fa fa-shield"></i> Ladder <strong>{{e.requirementValue | ladderrank}}</strong>+ rank
                                        </div>
                                        <div class="limit" v-else-if="e.reqType == 'PVP_RANK'">
                                            <i class="fa fa-shield"></i> PvP <strong>{{e.requirementValue | pvprank}}</strong>+ rank
                                        </div>
                                        <div v-else-if="e.reqType == 'NONE'"></div>
                                        <div v-else>
                                            {{e}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="subsection" v-if="acqData.craft && acqData.craft.length">
                    <h4>Crafting</h4>
                    <p>Can be crafted at the blacksmith using:</p>
                    <div class="craft-box">
                        <div class="craft-group-list">
                            <div :class="`craft-group ${i == activeCraftGroup ? 'active' : ''}`" v-for="(g, i) in acqData.craft" :key="g.id" v-on:click="selectCraft(i)">
                                <span v-if="g.setNameId">{{g.setName}}</span>
                                <span v-else>{{g.partsName}}</span>
                                <span v-if="g.level > 1">(Lv {{g.level}})</span>
                            </div>
                        </div>
                        <div class="craft-group-entries">
                            <div class="craft-entry" v-for="e in activeCraftSet" :key="e.id">
                                <div class="costs">
                                    <div class="cost" v-for="(item, i) in e.materials" :key="i">
                                        <item-icon-tooltip
                                                    :itemId="item.stub.id"
                                                    :itemStub="item.stub"
                                                    :count="item.count">
                                                </item-icon-tooltip>
                                    </div>
                                </div>
                                <div class="gold">
                                    {{e.cost | gold}}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- <br/> -->
                    <!-- {{acqData.craft}} -->
                </div>

                <div class="subsection" v-if="acqData.tuner">
                    <h4>Tuners</h4>
                    <p>Obtain as a result of using the following item tuners:</p>
                </div>

                <div class="subsection" v-if="acqData.box">
                    <h4>Item Pouch</h4>
                    <p>Can be obtained from the following item pouches:</p>
                </div>

                <div class="no-results">
                    <small-error-box
                        errorTitle="No Results"
                        iconClass="fa-question-circle"
                        errorContent="Item not acquirable from shops, crafting, tuning, or boxes">
                    </small-error-box>
                </div>
            </div>
        </div>
    </transition>
</div>
</template>

<script>
import Vue from 'vue';
import Points from "@/components/game/Points";
import ItemIconTooltip from "@/components/items/ItemIconTooltip";

import Item from "@/api/item/item";
import Shop from "@/api/shop";

Vue.component('item-icon-tooltip', ItemIconTooltip);
Vue.component('point-tag', Points);

export default {
    props: ["itemId"],
    data: function() {
        return {
            loading: true,
            acqData: null,
            error: null,
            activeCraftGroup: 0,
            useGoldenGoose: true,
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
        }
    },
    computed: {
        activeCraftSet() {
            return this.acqData.craft[this.activeCraftGroup].entries;
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.error = null;
            this.tunerData = null;
            this.activeCraftGroup = 0;
            this.useGoldenGoose = true;
            Item.getItemAcquire(this.itemId, this.$store.state.regionCode,
                (res) => {
                    //  Perform a copy since we're going to be editing directly
                    //  Forcibly strip getters/setters that Vue injected
                    res = JSON.parse(JSON.stringify(res));

                    let data = this.process(res);
                    this.acqData = data;
                    this.loading = false;
                    this.error = null;
                },
                (err) => {
                    this.loading = false;
                    this.error = err;
                });
        },
        
        process(data) {
            let ret = {};
            if (data.shop) {
                let dshop = Shop.coalesce(data.shop);

                dshop.sort((a, b) => {
                    return a.shopId - b.shopId;
                });

                for (let k in dshop) {
                    let v = dshop[k];
                    v.shopName = "Loading";
                    for (let k1 in v.entries) {
                        let v1 = v.entries[k1];

                        v1.fees.sort((a, b) => {
                            return a.typeId - b.typeId;
                        });
                    }

                    Shop.getShopName(v.shopId, this.$store.state.regionCode,
                        (res) => {
                            v.shopName = res;
                        },
                        (err) => {
                            console.log(err);
                            v.shopName = "Shop " + v.shopId;
                        }
                    );
                }

                ret.shop = dshop;
            }

            function craftEquals(a, b) {
                if (a.partsNameId != b.partsNameId) {
                    return false;
                }
                if (a.setNameId != b.setNameId) {
                    return false;
                }
                if (a.level != b.level) {
                    return false;
                }
                if (a.rank != b.rank) {
                    return false;
                }
                if (a.cost != b.cost) {
                    return false;
                }
                if (a.entries.length != b.entries.length) {
                    return false;
                }

                return true;
            };

            if (data.craft && data.craft.length > 0) {
                let dcraft = [];
                let cset = data.craft.slice(0);
                console.log(cset);
                //  Coalesce items that differ only in job
                for (let k in cset) {
                    let v = cset[k];
                    if (v.dup) {
                        continue;
                    }

                    for (let k1 = Number(k) + 1; k1 < cset.length; ++k1) {
                        let v1 = cset[k1];
                        if (craftEquals(v, v1)) {
                            v1.dup = true;
                        }
                    }
                }

                for (let k in cset) {
                    let v = cset[k];
                    if (!v.dup) {
                        dcraft.push(v);
                    }
                }

                ret.craft = dcraft;
            }

            ret.tuner = data.tuner;
            ret.box = data.box;
            ret.quest = data.quest;
            ret.stageClear = data.stageClear;

            return ret;
        },

        selectCraft(index) {
            this.activeCraftGroup = index;
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-acquire {
    position: relative;
    min-height: 70px;

    .req-bar {
        display: flex;
        flex-direction: row;
        position: relative;

        .reqs-label {
            color: fade(@dv-c-red, 70%);
            font-size: 12px;
            font-weight: normal;
            text-transform: uppercase;
            height: 100%;
            padding: 4px 0 4px 6px;
            border-left: 1px solid @dv-c-idle;

            &:first-child {
                border-left: none;
                padding-left: 0;
            }
        }

        .limit {
            margin: 0 8px;

            &:first-child {
                margin-left: 0;
            }

            .fa {
                color: @dv-c-foreground;
            }
        }
    }

    .options {
        margin-top: 10px;
    }

    .acq-list {
        .subsection {

        }

        .shop-list {
            .shop-entry {
                display: flex;
                flex-direction: row;
                margin: 10px 0;
                padding: 8px;


                .shop-name {
                    flex: 0 1 120px;
                    text-align: right;
                    border-right: 2px solid @dv-c-body;
                    padding: 10px 10px 0 0;
                    color: @dv-c-foreground;
                    font-size: 12px;
                    font-weight: normal;
                    text-transform: uppercase;
                }

                .shop-item-list {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;

                    .shop-item-entry {
                        flex: 1 1 auto;
                        padding: 4px 0 4px 10px;
                        border-bottom: 1px solid @dv-c-idle;
                        transition: background-color 0.125s ease-in;
                        
                        // &:hover {
                        //     background: fade(@dv-c-foreground, 10%);
                        // }

                        &:last-child {
                            border-bottom: none;
                        }

                        .tab {
                            text-transform: uppercase;
                            letter-spacing: 0.2em;
                            font-family: @dv-f-geomanist;
                            color: @dv-c-accent-2;
                        }

                        .fee {
                            display: flex;
                            flex-direction: row;
                            padding: 4px 0;

                            .fee-entry {
                                flex: 0 0 auto;
                                border-left: 1px solid @dv-c-idle;
                                padding: 0 8px;

                                &:first-child {
                                    padding-left: 0;
                                    border-left: none;
                                }

                                & > span {
                                    display: inline-block;
                                }

                                .gold {
                                    padding: 8px 0;
                                    color: @rank-divine;
                                }

                                .point {
                                    padding-bottom: 10px;
                                }
                            }

                            .fee-label {
                                color: @dv-c-foreground;
                                font-size: 14px;
                                font-weight: normal;
                                text-transform: uppercase;
                                padding: 8px 4px;
                            }
                        }
                    }
                }
            }
        }

        .craft-box {
            border: 1px solid @dv-c-foreground;
            position: relative;
            display: flex;
            flex-direction: row;

            .craft-group-list {
                position: relative;
                flex: 0 0 200px;
                border-right: 1px solid @dv-c-foreground;
                padding-top: 24px;

                &::before {
                    content: "Crafting Category";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    padding: 4px;
                    border-bottom: 1px solid @dv-c-idle;
                    
                    font-size: 12px;
                    font-weight: normal;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-family: @dv-f-geomanist;
                    color: @dv-c-accent-2;
                }

                .craft-group {
                    padding: 8px;
                    cursor: pointer;
                    border-bottom: 1px solid @dv-c-idle;
                    font-size: 14px;
                    font-weight: normal;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-family: @dv-f-geomanist;
                    transition: background-color 0.125s ease-in, color 0.125s ease-in;

                    &:last-child {
                        border-bottom: none;
                    }

                    &.active {
                        background: fade(@dv-c-foreground, 20%);
                        color: @dv-c-foreground;
                    }

                    &:hover,
                    &.active:hover {
                        background: fade(@dv-c-foreground, 30%);
                        color: @dv-c-foreground;
                    }
                }
            }

            .craft-group-entries {
                position: relative;
                flex: 1 0 auto;
                padding-top: 24px;

                &::before {
                    content: "Required Materials";
                    font-family: @dv-f-geomanist;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    padding: 4px;
                    border-bottom: 1px solid @dv-c-idle;
                    
                    font-size: 12px;
                    font-weight: normal;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: @dv-c-accent-2;
                }

                .craft-entry {
                    padding: 8px;
                    border-bottom: 1px solid @dv-c-idle;
                    transition: background-color 0.125s ease-in, color 0.125s ease-in;

                    &:last-child {
                        border-bottom: none;
                    }

                    // &:hover {
                    //     background: fade(@dv-c-foreground, 30%);
                    //     color: @dv-c-foreground;
                    // }

                    .costs {
                        display: flex;
                        flex-direction: row;

                        .cost {
                            flex: 0 0 auto;
                        }
                    }

                    .gold {
                        color: @rank-divine;
                        padding: 8px;
                    }
                }

            }
        }

        .no-results {
            display: none;

            &:last-child:first-child {
                display: block;
            }
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
