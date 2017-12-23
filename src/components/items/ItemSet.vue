<template>
<div class="item-set">

    <div class="set-text" v-if="setData.setText">
        {{setData.setText}}
    </div>

    <div class="flow-container">
        <div class="left-col col">
            <div class="title">
                Set Bonus Stats
            </div>

            <table class="set-bonus-table">
                <thead>
                    <th>Set Size</th>
                    <th>Stats</th>
                </thead>

                <tr v-for="v in setData.setInfo.setBonusStats" :key="v.setSize">
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
                Items in Set
            </div>
            <div class="item-list">
                        <div
                            v-for="item in setData.setInfo.itemsInSet" 
                            :key="item.id"
                            class="result">
                            <item-card
                                :itemStub="item"
                                :itemId="item.id">
                            </item-card>
                        </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import ItemStat from "@/api/item/itemstat";
import Item from "@/api/item/item";
import StatGrid from "@/components/game/StatGrid";

Vue.component('stat-grid', StatGrid);

export default {
    props: ["setData"],
    data: function() {
        return {}
    },
    methods: {
        convertToStatSet(states) {
            return ItemStat.joinStatSet(states, "value");
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-set {

    .set-text {
        margin: 0.2em 0;
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
}

</style>
