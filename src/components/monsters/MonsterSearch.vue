<template>
<div class="monster-search">
<h1>Monster Search</h1>
    <div class="go-back"
        v-on:click="goBack">
        <i class="fa fa-angle-double-left"></i>Back
    </div>

    Temporary search page (please no feedback here, this will all get torn out later). Search results are capped to 150 entries.
    <br/>
    Styles on this page are not refined and there may be display issues (like smushed text)
    <br/>

    <div class="warn toast">
    THIS PAGE IS A WORK IN PROGRESS
    </div>

    <form class="search-form" v-on:submit.prevent="search">
        <div class="filter">
            <legend>Search</legend>

            <div class="level-filter">
                <label for="filter-level-min">Level </label>
                <input id="filter-level-min" type="number" min="0" max="100" v-model="filter.minLevel" />
                <label> to </label>
                <input id="filter-level-max" type="number" :min="filter.minLevel" max="100" v-model="filter.maxLevel" />
            </div>

            <div class="name-class-filter">
                <input id="filter-name" type="text" v-model="filter.nameSearch" placeholder="Item name"/>
            </div>
        </div>

        <div class="button-row">
            <button class="submit" v-on:click.prevent="search">Search</button>
            <button class="submit" v-on:click.prevent="resetFilter">Reset</button>
        </div>
        
    </form>


    <div class="result-wrapper">
        <transition name="fade">
            <div v-if="loading" class="loading">
                <div class="loader-box">
                    <div class="loader"></div>
                    <div class="label">Loading</div>
                </div>
            </div>
        </transition>
        <div class="monster-results" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="0">
            <div class="wrap" v-if="results.length">
                <div class="count">Found <span class="val">{{ approxResultCount | thousands }} results</span></div>
                <div v-for="monster in results" :key="monster.id" class="monster-result">
                    <router-link :to="{path: `/monsters/${monster.id}`}">
                        <monster-card
                            :monsterId="monster.id" 
                            :stub="monster"
                        />
                    </router-link>
                </div>
            </div>
            <div v-else>
                <div class="no-results" v-if="!loading">
                    <div class="error" v-if="error">
                        <big-error-box 
                            :errorTitle="'Error: ' + error.statusText" 
                            :errorContent="error.bodyText" 
                            v-on:retry="fetchData"
                            canRetry="true"
                            iconClass="fa-exclamation-triangle"></big-error-box>
                    </div>
                    <div v-else>
                        <big-error-box 
                            :errorTitle="'No Results'" 
                            :errorContent="'Try searching something different.'" 
                            v-on:retry="fetchData"
                            canRetry="true"
                            iconClass="fa-question-circle"></big-error-box>
                    </div>
                </div>
            </div>
            <div v-if="end" class="end-results">
                End of results
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';

import Monster from "@/api/monster/monster";

import MonsterCard from "@/components/monsters/entry/MonsterCard";
import BigErrorBox from '@/components/util/BigErrorBox';

Vue.component('big-error-box', BigErrorBox);
Vue.component('monster-card', MonsterCard);

export default {

    data: function() {
        return {
            filter: {
                nameSearch: null,
                minLevel: 0,
                maxLevel: 100
            },
            results: [],
            loading: false,
            page: 0,
            approxResultCount: 0,
            end: false,
            error: null,
            lastChangeTimer: null,
        };
    },
    created() {
        this.reset();
        this.onLoad();
        this.fetchData();
    },
    watch: {
    },
    computed: {

    },
    methods: {
        onLoad() {
            this.filter.nameSearch = this.$route.query.q;
            if (this.$route.query.lmin) {
                this.filter.minLevel = this.$route.query.lmin;
            }
            if (this.$route.query.lmax) {
                this.filter.maxLevel = this.$route.query.lmax;
            }
        },
        fetchData() {
            clearTimeout(this.lastChangeTimer);
            this.loading = true;
            Monster.getBulk({
                    page: this.page,
                    size: 50,
                    query: this.filter
                },
                null,
                (res) => {
                    this.results.push(...res.monsters);
                    this.end = this.results.length >= res.estimatedSize;
                    this.approxResultCount = res.estimatedSize;
                    this.error = null;
                    //  Add a slight delay cuz otherwise its too fast
                    setTimeout(() => this.loading = false, 250);
                },
                (err) => {
                    console.error(err);
                    this.error = err;
                    this.loading = false;
                    this.end = true;
                }
            );
        },
        goBack() {
            this.$router.back();
        },
        loadMore() {
            if (!this.end) {
                this.page += 1;
                this.fetchData();
            }
        },
        reset() {
            this.filter = {
                nameSearch: null,
                minLevel: 0,
                maxLevel: 100
            };
            this.filter.ext = {

            };
        },
        resetFilter() {
            this.reset();
            this.updateQuery();
        },
        search() {
            this.page = 0;
            this.results = [];
            this.end = false;
            this.updateQuery();
            this.fetchData();
        },
        updateQuery() {
            let query = {};
            if (this.filter.nameSearch) {
                query.q = this.filter.nameSearch;
            }
            if (this.filter.minLevel) {
                query.lmin = this.filter.minLevel;
            }
            if (this.filter.maxLevel != 100) {
                query.lmax = this.filter.maxLevel;
            }
            this.$router.replace({ 
                name: 'monster-search', 
                query: query
            });
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.monster-search {

    .search-form {
        .button-row {
            margin-top: 10px;
        }
    }

    .result-wrapper {
        margin-top: 20px;
        position: relative;

        .loading {
            width: 100%;
            position: absolute;
            height: 100%;
            padding-right: 16px;
            z-index: 10;
            
            .loader-box {
                position: fixed;
                text-align: center;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                transform: translate(5%, 0);

                .label {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 50%;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: @dv-c-foreground;
                    transform: translate(0, 10px);
                }

                .loader,
                .loader:after {
                    border-radius: 50%;
                    width: 10em;
                    height: 10em;
                }
                .loader {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    line-height: 100%;
                    font-size: 16px;
                    margin: -5em -6em;
                    text-indent: -9999em;
                    border-top: 1.1em solid rgba(0, 0, 0, 0.75);
                    border-right: 1.1em solid rgba(0, 0, 0, 0.75);
                    border-bottom: 1.1em solid rgba(0, 0, 0, 0.75);
                    border-left: 1.1em solid @dv-c-foreground;
                    background: rgba(0, 0, 0, 0.5);
                    //   -webkit-transform: translateZ(0);
                    //   -ms-transform: translateZ(0);
                    //   transform: translateZ(0);
                    -webkit-animation: load8 1.1s infinite linear;
                    animation: load8 1.1s infinite linear;
                }
            }
        }

        .monster-results {
            position: relative;

            .wrap {
                position: relative;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                padding-top: 20px;
            }

            .monster-result {
                flex: 1 1 300px;
                border: 1px solid @dv-c-foreground;
            }

            .count {
                position: absolute;
                top: 0;
                font-weight: normal;
                letter-spacing: 0.1em;
                color: @dv-c-accent-1;
                font-family: @dv-f-geomanist;
                text-transform: uppercase;
                letter-spacing: 0.3em;
                font-size: 14px;

                .val {
                    color: @dv-c-accent-2;
                }
            }
        }

        .end-results {
            text-align: center;
            margin-top: 10px;
            border-top: 1px solid @dv-c-accent-1;
            padding-top: 0.25em;
            padding-bottom: 0.25em;
            font-family: @dv-f-geomanist;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 16px;
            color: @dv-c-foreground;
        }
    }
}
</style>
