<template>
<div class="item-cash-shop">
    <h1>Cash Shop</h1>
    <!--
        LOADING
        -->
    <div class="top">&nbsp; <!-- Prevent margin collapse --></div>
    <transition name="fade">
        <div v-if="loadingTabs" class="loading">
            <load-indicator
            loadText="Cash Shop" />
        </div>
    </transition>
    <!-- <div class="go-back"
        v-on:click="goBack">
        <i class="fa fa-angle-double-left"></i>Back
    </div> -->
    <!--
        ERROR
        -->
    <transition name="fade">
        <div class="error" v-if="error">
            <div class="go-back"
                v-on:click="goBack">
                <i class="fa fa-angle-double-left"></i>Back
            </div>
            <big-error-box 
                :errorTitle="'Error: ' + error.statusText" 
                :errorContent="error.bodyText" 
                :secondaryInfo="`Item ID #${itemId}`"
                canRetry="true"
                v-on:retry="fetchData"
                iconClass="fa-exclamation-triangle" />
        </div>
    </transition>
    <!--
        RESULT
        -->
    <div v-if="!loadingTabs && tabData">
        <div class="go-back"
            v-on:click="goBack">
            <i class="fa fa-angle-double-left"></i>Back
        </div>
        
        <form class="filter">
            <legend>Filter by</legend>
            <div class="level-filter">
                <label for="filter-level-min">Level </label>
                <input id="filter-level-min" type="number" min="0" max="100" v-model="filter.minLevel" />
                <label> to </label>
                <input id="filter-level-max" type="number" :min="filter.minLevel" max="100" v-model="filter.maxLevel" />
            </div>
            
            <div class="name-class-filter">
                <input id="filter-name" type="text" v-model="filter.nameSearch" placeholder="Name Filter"/>

                <!-- <label for="filter-class">Class</label>
                <input id="filter-class" type="text" v-model="filter.selectClass" /> -->
            </div>
            <div class="grade-filter">
                <div class="checkbox">
                    <input type="checkbox" v-model="showOverride" id="show-override" />
                    <label for="show-override">Show hidden</label>
                </div>
                <div class="red checkbox">
                    <input type="checkbox" v-model="filter.credit" id="hide-credit" />
                    <label for="hide-credit">Hide EYECredit unusable</label>
                </div>
                <div class="red checkbox">
                    <input type="checkbox" v-model="filter.dnp" id="hide-dnp" />
                    <label for="hide-dnp">Hide DNP unusable</label>
                </div>
                <div class="red checkbox">
                    <input type="checkbox" v-model="filter.coupon" id="hide-coupon" />
                    <label for="hide-coupon">Hide Coupon Required</label>
                </div>
            </div>
        </form>
        <div class="shop-pane">
            <div class="shop-tabs">
                <div class="shop-tab"
                    v-for="tab in tabData"
                    :key="tab.tabId"
                    v-if="tab.show || showOverride"
                    v-on:click="changeTab(tab)"
                    :active="tab.tabId == (activeTab ? activeTab.tabId : -1)"
                >
                    {{ tab.tabName.id ? tab.tabName.message : "Tab " + tab.tabId }}
                </div>
            </div>
            <div class="shop-body">
                <div class="sub-tabs">
                    <div class="sub-tab"
                        v-for="sub in activeTab.subtabs"
                        :key="sub.subTabId"
                        v-if="sub.show || showOverride"
                        v-on:click="changeSub(sub)"
                        :active="sub.subTabId == (activeSub ? activeSub.subTabId : -1)">

                        {{ sub.tabName.id ? sub.tabName.message : "Sub Tab " + sub.subTabId }}
                        <div class="bottom" />
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import Item from "@/api/item/item";
import CashShop from "@/api/item/cashshop";

export default {
    data: function() {
        return {
            filter: {
                minLevel: 0,
                maxLevel: 100,
                nameSearch: "",
                credit: false,
                dnp: false,
                coupon: false,
            },
            loadingTabs: true,
            tabData: null,
            loadingShopData: true,
            shopData: null,
            error: null,
            showOverride: false,
            activeTab: null,
            activeSub: null,
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.loadingTabs = true;
            this.loadingShopData = true;
            this.error = null;
            CashShop.getTabs().then((d) => {
                this.tabData = d.body;
                this.loadingTabs = false;
                for (let tab of this.tabData) {
                    if (tab.show) {
                        this.changeTab(tab);
                        break;
                    }
                }
            }, (err) => {
                console.log(err);
            });
        },
        changeTab(tab) {
            this.activeTab = tab;
            this.activeSub = null;
            for (let sub of this.activeTab.subtabs) {
                if (sub.show) {
                    this.activeSub = sub;
                    break;
                }
            }
        },
        changeSub(sub) {
            this.activeSub = sub;
        },
        filter() {

        },
        goBack() {
            this.$router.back();
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../../less/core.less";

.item-cash-shop {
    position: relative;

    .shop-pane {
        margin: 10px 0;
        .shop-tabs {
            display: flex;
            flex-direction: row;

            .shop-tab {
                flex: 1 1 auto;
                text-align: center;
                
                font-family: @dv-f-geomanist;
                color: @dv-c-foreground;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                font-size: 14px;
                border: @dv-c-foreground 1px solid;
                border-width: 1px 1px 1px 0;
                padding: 0.5em;
                cursor: pointer;
                transition: background-color 0.25s ease-in, color 0.25s ease-in;

                &:first-child {
                    border-left-width: 1px;
                }

                &:hover,
                &[active] {
                    background-color: @dv-c-foreground;
                    color: @dv-c-background;
                }
            }
        }

        .sub-tabs {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .sub-tab {
                flex: 0 1 150px;
                text-align: center;
                position: relative;
                
                font-family: @dv-f-geomanist;
                color: @dv-c-accent-3;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                font-size: 14px;
                padding: 0.25em;
                padding-bottom: 0.4em;
                cursor: pointer;
                transition: color 0.1s ease-in;
                margin-right: 20px;

                &:last-child {
                    margin-right: 0;
                }

                .bottom {
                    position: absolute;
                    bottom: 0;
                    left: 40%;
                    right: 40%;
                    border-bottom: fade(@dv-c-accent-3, 50%) 2px solid;
                    transition: left ease-in 0.1s, right ease-in 0.1s;
                }

                &:hover,
                &[active] {
                    color: @dv-c-foreground;
                    .bottom {
                        border-bottom-color: @dv-c-foreground;
                        left: 0;
                        right: 0;
                    }
                }
            }
        }
    }
}
</style>
