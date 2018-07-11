<template>
<div class="item-acquire">
    <transition name="fade">
        <div v-if="loading" class="loading">
            <load-indicator
            loadText="Finding Item Sources"></load-indicator>
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
                    <p>Can be purchased from the following NPC shops:</p>
                    <form class="options">
                        <div class="checkbox">
                            <input type="checkbox" v-model="useGoldenGoose" id="goldenGoose" />
                            <label for="goldenGoose">Use Golden Goose discount (30%)</label>
                        </div>
                    </form>
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
                                            <span class="point" v-else-if="f.type == 'MENTOR_POINT'">
                                                <point-tag pointId="12" :amount="f.value"></point-tag>
                                            </span>
                                            <span class="point" v-else-if="f.type == 'COMMUNITY_POINT'">
                                                <point-tag pointId="31" :amount="f.value"></point-tag>
                                            </span>
                                            <span class="point" v-else-if="f.typeId == 32">
                                                <point-tag pointId="32" :amount="f.value"></point-tag>
                                            </span>
                                            <span class="point" v-else-if="f.type == 'CRYSTAL_POINT'">
                                                <point-tag pointId="30" :amount="f.value"></point-tag>
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

                                            <span class="gold" v-else>
                                                {{f.type}} {{f.typeId}}: {{f.value}}
                                            </span>
                                        </div>
                                        <div class="exchange-rate">
                                            <i class="fa fa-long-arrow-right"></i>x{{e.count}}
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

                <div class="subsection" v-if="acqData.box && acqData.box.length">
                    <h4>Item Pouch</h4>
                    <p>Can be obtained by opening:</p>

                    <form class="filter" v-if="acqData.box.length > 20">
                        <legend>Filter by</legend>
                        <div class="level-filter">
                            <label for="filter-level-min">Level </label>
                            <input id="filter-level-min" type="number" min="0" max="100" v-model="boxFilter.minLevel" />
                            <label> to </label>
                            <input id="filter-level-max" type="number" :min="boxFilter.minLevel" max="100" v-model="boxFilter.maxLevel" />
                        </div>
                        
                        <div class="name-class-filter">
                            <input id="filter-name" type="text" v-model="boxFilter.nameSearch" placeholder="Name Filter"/>

                            <!-- <label for="filter-class">Class</label>
                            <input id="filter-class" type="text" v-model="filter.selectClass" /> -->
                        </div>

                        <div class="grade-filter">
                            <span class="normal" v-if="hasBoxGrade.normal">
                                <input id="filter-grade-normal" type="checkbox" v-model="boxFilter.grades.normal" />
                                <label for="filter-grade-normal">Normal</label>
                            </span>
                            <span class="magic" v-if="hasBoxGrade.magic">
                                <input id="filter-grade-magic" type="checkbox" v-model="boxFilter.grades.magic" />
                                <label for="filter-grade-magic">Magic</label>
                            </span>
                            <span class="rare" v-if="hasBoxGrade.rare">
                                <input id="filter-grade-rare" type="checkbox" v-model="boxFilter.grades.rare" />
                                <label for="filter-grade-rare">Rare</label>
                            </span>
                            <span class="epic" v-if="hasBoxGrade.epic">
                                <input id="filter-grade-epic" type="checkbox" v-model="boxFilter.grades.epic" />
                                <label for="filter-grade-epic">Epic</label>
                            </span>
                            <span class="unique" v-if="hasBoxGrade.unique">
                                <input id="filter-grade-unique" type="checkbox" v-model="boxFilter.grades.unique" />
                                <label for="filter-grade-unique">Unique</label>
                            </span>
                            <span class="legendary" v-if="hasBoxGrade.legendary">
                                <input id="filter-grade-legendary" type="checkbox" v-model="boxFilter.grades.legendary" />
                                <label for="filter-grade-legendary">Legendary</label>
                            </span>
                            <span class="divine" v-if="hasBoxGrade.divine">
                                <input id="filter-grade-divine" type="checkbox" v-model="boxFilter.grades.divine" />
                                <label for="filter-grade-divine">Divine</label>
                            </span>
                            <span class="ancient" v-if="hasBoxGrade.ancient">
                                <input id="filter-grade-ancient" type="checkbox" v-model="boxFilter.grades.ancient" />
                                <label for="filter-grade-ancient">Ancient</label>
                            </span>
                        </div>
                    </form>


                    <div class="box-list">
                        <div class="entry" 
                            v-for="e in acqData.box" 
                            :key="e.boxItemId"
                            v-if="shouldBoxRender(e.boxItem)">
                            <item-card 
                                :itemId="e.boxItem.id"
                                :itemStub="e.boxItem"
                            ></item-card>
                        </div>
                    </div>
                </div>

                <div class="subsection" v-if="acqData.cash && acqData.cash.length">
                    <h4>Cash Shop</h4>
                    <p>Can be obtained by purchasing from the cash shop:</p>

                    <form class="options">
                        <div class="checkbox">
                            <input type="checkbox" v-model="showCashUnavailable" id="cash-unavailable" />
                            <label for="cash-unavailable">Show unavailable</label>
                        </div>
                    </form>

                    <div class="cash-list">
                        <router-link class="cash-entry"
                            v-for="e in acqData.cash"
                            :key="e.serialNumber"
                            v-if="(showCashUnavailable || (e.available && !isPackagedOnly(e)))"
                            :to="{path: `/items/cash/${e.serialNumber}`}">
                            <div class="serial">
                                {{e.serialNumber}}
                            </div>

                            <div class="package-tag" v-if="isPackagedOnly(e)">
                            </div>

                            <div class="name">{{e.name}}</div>

                            <div class="count">
                                <span v-if="e.count > 1">x{{e.count}}</span>
                            </div>

                            <div class="price">
                                <div v-if="!(e.useCoupon && e.price == 0)">
                                    <i class="fa fa-shopping-cart"></i> <strong>{{ e.price | thousands}}</strong> EC
                                </div>
                                <div v-if="e.useCoupon">
                                    <div v-if="e.couponItem" class="coupon">
                                        <item-icon-tooltip
                                            :itemId="e.couponItem.id"
                                            :itemStub="e.couponItem">
                                        </item-icon-tooltip>
                                    </div>
                                    <div v-else class="no-coupon">
                                        <i class="fa fa-exclamation-triangle"></i>Coupon unavailable
                                    </div>
                                </div>
                            </div>

                            <div class="params">
                                <div class="param" v-if="e.period > 0">
                                    <i class="fa fa-clock-o"></i> <strong>{{ e.period }}</strong> days
                                </div>
                                <div class="param" v-else>
                                    <i class="fa fa-clock-o"></i> <strong>Permanent</strong>
                                </div>
                                <div class="param" v-if="e.minCreditLevel > 1 && (e.creditable || e.useCoupon)">
                                    <i class="fa fa-credit-card"></i> Lv <strong>{{e.minCreditLevel}}</strong>+ to purchase with credit
                                </div>
                                <div class="param" v-else-if="e.minCreditLevel == 0 || (!e.creditable && !e.useCoupon)">
                                    <i class="fa negative fa-ban"></i> Cannot use credit
                                </div>
                                <div class="param" v-else>
                                    <i class="fa fa-credit-card"></i> Purchasable with credit
                                </div>
                                <div class="param" v-if="!e.canUseDnp">
                                     <i class="fa negative fa-ban"></i> Cannot use DNP
                                </div>
                                <div class="param" v-if="e.giftable">
                                     <i class="fa fa-gift"></i> Giftable
                                </div>
                                <div class="param" v-else>
                                     <i class="fa negative fa-ban"></i> Cannot gift
                                </div>
                            </div>
                            <div class="unavailable" v-if="!e.available">
                            </div>
                        </router-link>
                        <router-link class="cash-entry"
                            v-for="e in cashShopPackages"
                            :key="e.serialNumber"
                            v-if="(showCashUnavailable || e.available)"
                            :to="{path: `/items/cash/${e.serialNumber}`}">
                            <div class="serial">
                                {{e.serialNumber}}
                            </div>

                            <div class="package-tag" v-if="isPackagedOnly(e)">
                            </div>

                            <div class="name">{{e.name}}</div>

                            <div class="price">
                                <div v-if="!(e.useCoupon && e.price == 0)">
                                    <i class="fa fa-shopping-cart"></i> <strong>{{ e.price | thousands}}</strong> EC
                                </div>
                                <div v-if="e.useCoupon">
                                    <div v-if="e.couponItem" class="coupon">
                                        <item-icon-tooltip
                                            :itemId="e.couponItem.id"
                                            :itemStub="e.couponItem">
                                        </item-icon-tooltip>
                                    </div>
                                    <div v-else class="no-coupon">
                                        <i class="fa fa-exclamation-triangle"></i>Coupon unavailable
                                    </div>
                                </div>
                            </div>

                            <div class="params">
                                <div class="param" v-if="e.period > 0">
                                    <i class="fa fa-clock-o"></i> <strong>{{ e.period }}</strong> days
                                </div>
                                <div class="param" v-else>
                                    <i class="fa fa-clock-o"></i> <strong>Permanent</strong>
                                </div>
                                <div class="param" v-if="e.minCreditLevel > 1 && (e.creditable || e.useCoupon)">
                                    <i class="fa fa-credit-card"></i> Lv <strong>{{e.minCreditLevel}}</strong>+ to purchase with credit
                                </div>
                                <div class="param" v-else-if="e.minCreditLevel == 0 || (!e.creditable && !e.useCoupon)">
                                    <i class="fa negative fa-ban"></i> Cannot use credit
                                </div>
                                <div class="param" v-else>
                                    <i class="fa fa-credit-card"></i> Purchasable with credit
                                </div>
                                <div class="param" v-if="!e.canUseDnp">
                                     <i class="fa negative fa-ban"></i> Cannot use DNP
                                </div>
                                <div class="param" v-if="e.giftable">
                                     <i class="fa fa-gift"></i> Giftable
                                </div>
                                <div class="param" v-else>
                                     <i class="fa negative fa-ban"></i> Cannot gift
                                </div>
                            </div>
                            <div class="unavailable" v-if="!e.available">
                            </div>
                        </router-link>
                        <div class="no-results" v-if="!showCashUnavailable">
                            <small-error-box
                                errorTitle="No Results"
                                iconClass="fa-question-circle"
                                errorContent="Currently unavailable from the cash shop. Check the 'Show unavailable' checkbox to see unavailable packages">
                            </small-error-box>
                        </div>
                        
                    </div>

                    <!-- {{acqData.cash}} -->
                </div>

                <div class="no-results">
                    <small-error-box
                        errorTitle="No Results"
                        iconClass="fa-question-circle"
                        errorContent="Item not acquirable from NPC shops, crafting, or item pouches/boxes">
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
import ItemFilter from "@/api/item/itemfilter";
import Shop from "@/api/shop";

Vue.component('item-icon-tooltip', ItemIconTooltip);
Vue.component('point-tag', Points);

import Loader from "@/components/util/Loader";
Vue.component("load-indicator", Loader);

export default {
    props: ["item"],
    data: function() {
        return {
            loading: true,
            acqData: null,
            error: null,
            activeCraftGroup: 0,
            useGoldenGoose: true,
            showCashUnavailable: false,
            boxFilter: ItemFilter.defaultFilter(),
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
        itemId() {
            return this.item.id;
        },
        activeCraftSet() {
            return this.acqData.craft[this.activeCraftGroup].entries;
        },
        hasBoxGrade() {
            let ret = {
                normal: false,
                magic: false,
                rare: false,
                epic: false,
                unique: false,
                legendary: false,
                divine: false,
                ancient: false,
            };
            
            if (!this.acqData.box) {
                return ret;
            }

            for (let k in this.acqData.box) {
                let item = this.acqData.box[k].boxItem;
                switch(item.rank) {
                    case "NORMAL":
                        ret.normal = true;
                        break;
                    case "MAGIC":
                        ret.magic = true;
                        break;
                    case "RARE":
                        ret.rare = true;
                        break;
                    case "EPIC":
                        ret.epic = true;
                        break;
                    case "UNIQUE":
                        ret.unique = true;
                        break;
                    case "LEGENDARY":
                        ret.legendary = true;
                        break;
                    case "DIVINE":
                        ret.divine = true;
                        break;
                    case "ANCIENT":
                        ret.ancient = true;
                        break;
                }
            }

            return ret;
        },
        cashShopPackages() {
            if (!this.acqData.cash) {
                return [];
            }

            let boxSet = {};
            for (let v of this.acqData.cash) {
                if (v.containingPackages && v.containingPackages.length) {
                    for (let pkg of v.containingPackages) {
                        boxSet[String(pkg.serialNumber)] = pkg;
                    }
                }
            }

            return Object.values(boxSet);
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

            function craftEntryEquals(a, b) {
                if (a.nameId != b.nameId) {
                    return false;
                }
                if (a.descId != b.descId) {
                    return false;
                }
                if (a.cost != b.cost) {
                    return false;
                }
                if (a.materials.length != b.materials.length) {
                    return false;
                }
                for (let k in a.materials) {
                    let av = a.materials[k];
                    let bv = b.materials[k];
                    console.log(av.itemId, bv.itemId);
                    if (av.itemId != bv.itemId) {
                        return false;
                    }
                    if (av.count != bv.count) {
                        return false;
                    }
                }

                return true;
            }

            if (data.craft && data.craft.length > 0) {
                let dcraft = [];
                let cset = data.craft.slice(0);
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

                    //  Coalesce options too
                    for (let k1 in v.entries) {
                        let v1 = v.entries[k1];
                        if (v1.dup) {
                            continue;
                        }

                        for (let k2 = Number(k1) + 1; k2 < v.entries.length; ++k2) {
                            let v2 = v.entries[k2];
                            if (craftEntryEquals(v1, v2)) {
                                v2.dup = true;
                            }
                        }
                    }

                    let edup = v.entries.slice(0);
                    v.entries = [];
                    for (let k1 in edup) {
                        let v1 = edup[k1];
                        if (v1.dup) {
                            continue;
                        }
                        v.entries.push(v1);
                    }
                }

                ret.craft = dcraft;
            }

            ret.tuner = data.tuner;
            
            data.box.sort((a, b) => {
                let an = a.boxItem.name.name.toUpperCase();
                let bn = b.boxItem.name.name.toUpperCase();

                let r = an < bn ? -1 : an > bn;

                return r;
            });
            
            ret.box = data.box;

            ret.cash = data.cash;

            ret.quest = data.quest;
            ret.stageClear = data.stageClear;

            return ret;
        },

        selectCraft(index) {
            this.activeCraftGroup = index;
        },
        shouldBoxRender(item) {
            return ItemFilter.shouldRender(this.boxFilter, item);
        },

        isPackagedOnly(cashEntry) {
            return cashEntry.containingPackages && cashEntry.containingPackages.length > 0 &&
                cashEntry.category == 0 && cashEntry.subcategory == 0;
        },
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
            h4 {
                font-family: @dv-f-geomanist;
                font-size: 14px;
                color: @dv-c-accent-2;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }
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

                            .exchange-rate {
                                padding: 8px 0;
                                .fa {
                                    padding: 0 10px 0 4px;
                                }
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
                    padding: 6px 8px 2px 8px;
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
                    padding: 6px 8px 2px 8px;
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

        .box-list {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            max-height: 364px;
            overflow-y: scroll;
            border-top: 2px solid @dv-c-accent-1;
            border-bottom: 2px solid @dv-c-accent-1;

            .result {
                &.no {
                    display: none;
                }

                &:first-child.no {
                    display: block;
                }
            }

            .entry {
                flex: 1 1 400px;
                border: 1px solid @dv-c-foreground;
                border-top-color: transparent;

                &:first-child {
                    border-top-color: @dv-c-foreground;
                }

                @media only screen and (min-width:@min-desktop-wide-width) {
                    border-right-color: transparent;
                    &:first-child,
                    &:nth-child(2) {
                        border-top-color: @dv-c-foreground;
                    }
                    &:nth-child(2n) {
                        border-right-color: @dv-c-foreground;
                    }
                    &:last-child {
                        border-right-color: @dv-c-foreground;
                    }
                    &:first-child:last-child {
                        border-right-color: @dv-c-foreground;
                    }

                }
            }
        }

        .cash-list {
            margin: 20px 0;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            // max-height: 364px;
            // overflow-y: scroll;
            // border-top: 2px solid @dv-c-accent-1;
            // border-bottom: 2px solid @dv-c-accent-1;
            .cash-entry {
                flex: 1 1 400px;
                border: 1px solid @dv-c-foreground;
                border-top-color: transparent;
                display: block;
                color: @dv-c-body;

                &:first-child {
                    border-top-color: @dv-c-foreground;
                }
                position: relative;
                padding: 10px 14px;
                padding-right: 40px;
                transition: background-color 0.125s ease-in;

                &:hover {
                    background-color: fade(@dv-c-foreground, 20%);
                }

                @media only screen and (min-width:@min-desktop-wide-width) {
                    border-left-color: transparent;
                    &:first-child,
                    &:nth-child(2) {
                        border-top-color: @dv-c-foreground;
                    }
                    &:nth-child(2n - 1) {
                        border-left-color: @dv-c-foreground;
                    }
                    &:last-child {
                        border-left-color: @dv-c-foreground;
                    }
                    &:first-child:last-child {
                        border-left-color: @dv-c-foreground;
                    }

                }

                .serial {
                    color: fade(@dv-c-body, 20%);
                    position: absolute;
                    top: 0;
                    right: 2px;
                    text-align: right;
                    font-size: 12px;
                    letter-spacing: 0.1em;
                }

                .package-tag {
                    height: 22px;
                    &::after {
                        content: "AVAILABLE IN PACKAGE ONLY";
                        position: absolute;
                        background-color: fade(@dv-c-accent-2, 20%);
                        left: 0;
                        right: 0;
                        top: 0;
                        text-align: center;
                        font-family: @dv-f-geomanist;
                        color: @dv-c-body;
                        letter-spacing: 0.2em;
                        padding: 4px 0;
                        // border-bottom: 2px solid @dv-c-red;
                    }
                }

                .unavailable{
                    height: 22px;
                    &::after {
                        content: "UNAVAILABLE";
                        position: absolute;
                        background-color: fade(@dv-c-red, 20%);
                        left: 0;
                        right: 0;
                        bottom: 0;
                        text-align: center;
                        font-family: @dv-f-geomanist;
                        color: @dv-c-body;
                        letter-spacing: 0.2em;
                        padding: 4px 0;
                        // border-bottom: 2px solid @dv-c-red;
                    }
                }

                .name {
                    font-family: @dv-f-geomanist;
                    font-size: 18px;
                    color: @dv-c-foreground;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                }

                .desc {
                    margin: 8px 0;
                }

                .price {
                    font-size: 18px;
                    line-height: 24px;
                    vertical-align: middle;
                    color: @dv-c-foreground;
                    
                    strong {
                        color: white;
                        font-weight: normal;
                    }
                    .fa {
                        margin-right: 8px;
                    }

                    .coupon {
                        margin-left: 10px;
                        &:first-child {
                            margin-left: 0;
                        }
                    }

                    .no-coupon {
                        &:first-child {
                            margin-left: 0;
                        }
                        margin-left: 10px;
                        padding: 6px 12px 6px 10px;
                        background: fade(@dv-c-red, 25%);
                        border-left: @dv-c-red 4px solid;
                        vertical-align: top;
                        text-transform: uppercase;
                        letter-spacing: 0.2em;
                        font-size: 14px;
                        color: @dv-c-body;
                        .fa {
                            color: @dv-c-red;
                        }
                    }
                }

                .count {
                    position: absolute;
                    top: 50%;
                    right: 10px;
                    transform: translateY(-50%);
                    font-size: 18px;
                    color: @dv-c-accent-2;
                }

                .params {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    margin: 10px 0;

                    .param {
                        margin: 0 16px 0 0;

                        // &:first-child {
                        //     margin-left: 0;
                        // }

                        .negative {
                            color: @dv-c-red;
                        }
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
