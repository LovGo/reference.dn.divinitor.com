<template>
<div class="item-set">

    <div class="set-text" v-if="setData.setText">
        {{setData.setText}}
    </div>

    
    <transition name="fade">
        <div v-if="loading" class="loading">
            <div class="loader-box">
                <div class="loader"></div>
                <div class="label">Loading item set</div>
            </div>
        </div>
    </transition>
    <transition name="fade">
        <div class="flow-container" v-if="!loading">
            <div class="left-col col">
                <div class="title">
                    Set Bonus Stats
                </div>

                <table class="set-bonus-table">
                    <thead>
                        <th>Set Size</th>
                        <th>Stats</th>
                    </thead>

                    <tr v-for="v in setContents.setBonusStats" :key="v.setSize">
                        <th>
                            {{v.setSize}}
                        </th>
                        <td>
                            <stat-grid :statSet="convertToStatSet(v.states)" hideHeader="true"></stat-grid>
                        </td>
                    </tr>

                </table>
            </div>
            <div class="right-col col">
                <div class="title">
                    {{setContents.itemsInSet.length | thousands}} Items in Set
                </div>

                <form class="filter" v-if="setContents.itemsInSet.length > 20">
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
                        <span class="normal" v-if="hasGrade.normal">
                            <input id="filter-grade-normal" type="checkbox" v-model="filter.grades.normal" />
                            <label for="filter-grade-normal">Normal</label>
                        </span>
                        <span class="magic" v-if="hasGrade.magic">
                            <input id="filter-grade-magic" type="checkbox" v-model="filter.grades.magic" />
                            <label for="filter-grade-magic">Magic</label>
                        </span>
                        <span class="rare" v-if="hasGrade.rare">
                            <input id="filter-grade-rare" type="checkbox" v-model="filter.grades.rare" />
                            <label for="filter-grade-rare">Rare</label>
                        </span>
                        <span class="epic" v-if="hasGrade.epic">
                            <input id="filter-grade-epic" type="checkbox" v-model="filter.grades.epic" />
                            <label for="filter-grade-epic">Epic</label>
                        </span>
                        <span class="unique" v-if="hasGrade.unique">
                            <input id="filter-grade-unique" type="checkbox" v-model="filter.grades.unique" />
                            <label for="filter-grade-unique">Unique</label>
                        </span>
                        <span class="legendary" v-if="hasGrade.legendary">
                            <input id="filter-grade-legendary" type="checkbox" v-model="filter.grades.legendary" />
                            <label for="filter-grade-legendary">Legendary</label>
                        </span>
                        <span class="divine" v-if="hasGrade.divine">
                            <input id="filter-grade-divine" type="checkbox" v-model="filter.grades.divine" />
                            <label for="filter-grade-divine">Divine</label>
                        </span>
                    </div>
                </form>

                <div class="item-list">
                    <div
                        v-for="item in sorted" 
                        :key="item.id"
                        v-if="shouldRender(item)"
                        class="result">
                        <item-card
                            :itemStub="item"
                            :itemId="item.id">
                        </item-card>
                    </div>
                    <div class="no result" :key="'none'">
                        <small-error-box
                            errorTitle="No Results"
                            iconClass="fa-question-circle"
                            errorContent="Try searching something else">
                        </small-error-box>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</div>
</template>

<script>
import Vue from 'vue';
import ItemStat from "@/api/item/itemstat";
import Item from "@/api/item/item";
import ItemFilter from "@/api/item/itemfilter";
import StatGrid from "@/components/game/StatGrid";

Vue.component('stat-grid', StatGrid);

export default {
    props: ["setData", "itemId", "jobs"],
    data: function() {
        return {
            loading: true,
            error: null,
            setContents: null,
            filter: ItemFilter.defaultFilter(),
        }
    },
    created() {
        this.fetchData();
    },
    computed: {
        sorted() {
            if (this.setContents) {
                let ret = this.setContents.itemsInSet.slice(0);
                ret.sort((a, b) => {
                    //  Sort by rarity
                    let cmp = Item.rarityCompare(a, b);
                    if (cmp != 0) {
                        return cmp;
                    }

                    let an = a.name.name.toUpperCase();
                    let bn = b.name.name.toUpperCase();

                    let r = an < bn ? -1 : an > bn;

                    return r;
                });

                return ret;
            }

            return null;
        },
        hasGrade() {
            let ret = {
                normal: false,
                magic: false,
                rare: false,
                epic: false,
                unique: false,
                legendary: false,
                divine: false
            };
            
            if (!this.setContents.itemsInSet) {
                return ret;
            }

            for (let k in this.setContents.itemsInSet) {
                let item = this.setContents.itemsInSet[k];
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
                }
            }

            return ret;
        },
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.error = null;
            this.setContents = null;
            let jobIdList = this.jobs.map((v) => v.id);
            Item.getItemSet(this.itemId, jobIdList, this.$store.state.regionCode,
                (res) => {
                    this.setContents = res;
                    this.loading = false;
                    this.error = null;
                },
                (err) => {
                    this.loading = false;
                    this.error = err;
                });
        },
        convertToStatSet(states) {
            return ItemStat.joinStatSet(states, "value");
        },
        shouldRender(item) {
            return ItemFilter.shouldRender(this.filter, item);
        },
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-set {
    position: relative;
    min-height: 84px;

    .set-text {
        margin: 0.2em 0;
    }

    .filter {
        margin-bottom: 10px;
    }

    .flow-container {
        margin-top: 4px;
        display: flex;
        flex-direction: row;
        
        @media only screen and (max-width:@min-desktop-wide-width) {
            flex-wrap: wrap;
        }

        .left-col {
            flex: 0 1 auto;
            margin: 0 5px 0 0;
            width: 30%;
            min-height: 10px;

            @media only screen and (max-width:@min-desktop-wide-width) {
                flex: 1 1 auto;
                margin-bottom: 20px;
            }
        }

        .right-col {
            flex: 1 1 auto;
            margin: 0 5px;
        }

        .col {
            position: relative;
            padding-top: 30px;

            .title {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                font-family: @dv-f-geomanist;
                font-size: 14px;
                color: @dv-c-accent-2;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }
        }
    }


    .item-list {
        max-height: 400px;
        overflow-y: scroll;
        border-top: 2px solid @dv-c-accent-1;
        border-bottom: 2px solid @dv-c-accent-1;

        .result {
            // width: 380px;
            .item-card {
                border: 1px solid @dv-c-foreground;
                border-top-color: transparent;
            }

            &:first-child {
                .item-card {
                    border-top-color: @dv-c-foreground;
                }
            }

            &.no {
                display: none;
            }

            &:first-child.no {
                display: block;
            }
        }
    }

    .set-bonus-table {
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
                text-align: center;

                &:first-child {
                    border-right: 2px solid @dv-c-body;
                    // min-width: 50px;
                    text-align: right;
                }
            }

            tr:hover {
                background: none;
            }
        }

        tr {
            padding-left: 0.125em;
            transition: background-color 0.125s ease-in, color 0.125s ease-in;
        }
        
        tr th {
            border-right: 2px solid @dv-c-body;
            padding: 4px 12px 4px 0;
            text-align: right;
            color: @dv-c-foreground;
            font-size: 18px;
            font-weight: normal;
            text-transform: uppercase;
            // min-width: 68px;

        }

        th, td {
            border-bottom: 1px solid @dv-c-idle;
            padding: 4px 4px 4px 4px;
        }

        td {
            margin: 0;
            padding: 0;
        }

        td:first-child,
        th:first-child {
            padding-left: 0.25em;
            padding-right: 0.5em;
        }
        tr:last-child td, tr:last-child th {
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
