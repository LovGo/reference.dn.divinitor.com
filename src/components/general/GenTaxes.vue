<template>
<div class="taxes">
    <h1>Taxes and Fees</h1>
    <div class="go-back"
        v-on:click="goBack">
        <i class="fa fa-angle-double-left"></i>Back
    </div>

    <p>
        These are the tax rates/gold fees for certain actions in Dragon Nest.
    </p>

    <transition name="fade">
        <div v-if="loading" class="loading">
            <load-indicator
            loadText="Taxes"></load-indicator>
        </div>
    </transition>
    <transition name="fade">
        <div class="error" v-if="error">
            <small-error-box 
                :errorTitle="'Failed to load data'" 
                :errorContent="error.statusText + ': ' + error.bodyText" 
                secondaryInfo="Taxes"
                canRetry="true"
                v-on:retry="fetchData"
                iconClass="fa-exclamation-triangle"></small-error-box>
        </div>
    </transition>
    <transition name="fade" appear>
        <div v-if="!loading && !error">
            <table>
                <thead>
                    <th>
                        Transaction
                    </th>
                    <th>
                        Fee Rate
                    </th>
                    <th>
                        Fee Amount
                    </th>
                    <th>
                        Total Cost
                    </th>
                </thead>
                <tr>
                    <th>
                        Server Storage
                    </th>
                    <td>
                        {{ taxes.serverStorageFee | goldG }}
                    </td>
                    <td>
                        {{ taxes.serverStorageFee | goldG }}
                    </td>
                    <td>
                        {{ taxes.serverStorageFee | goldG }}
                    </td>
                </tr>
                <tr>
                    <th>
                        Trade
                    </th>
                    <td>
                        {{ taxes.tradeFee | enhancePercent }}
                    </td>
                    <td>
                        {{ taxes.tradeFee * inputSafe * 10000 | goldG }}
                    </td>
                    <td>
                        {{ ((taxes.tradeFee * inputSafe + inputSafe) * 10000) | goldG }}
                    </td>
                </tr>
                <tr>
                    <th>
                        Mail
                    </th>
                    <td>
                        {{ taxes.mailFee | enhancePercent }}
                    </td>
                    <td>
                        {{ taxes.mailFee * inputSafe * 10000 | goldG }}
                    </td>
                    <td>
                        {{ ((taxes.mailFee * inputSafe + inputSafe) * 10000) | goldG }}
                    </td>
                </tr>
                <tr>
                    <th>
                        Market Listing*
                    </th>
                    <td>
                        {{ taxes.listingFee | enhancePercent }}
                    </td>
                    <td>
                        {{ taxes.listingFee * inputSafe * 10000 | goldG }}
                    </td>
                    <td>
                        {{ ((taxes.listingFee * inputSafe + inputSafe) * 10000) | goldG }}
                    </td>
                </tr>
                <tr>
                    <th>
                        Market Sell&#8224;
                    </th>
                    <td>
                        {{ taxes.marketSellFee | enhancePercent }}
                    </td>
                    <td>
                        {{ taxes.marketSellFee * inputSafe * 10000 | goldG }}
                    </td>
                    <td>
                        {{ ((inputSafe - taxes.marketSellFee * inputSafe) * 10000) | goldG }}
                    </td>
                </tr>
            </table>
            <div class="note">
                Assuming using a <router-link :to="{path: `/items/1107308544`}">Marketplace Pass</router-link>.
            </div>
            <div class="dagger note">
                This is the gold you will receive after clicking <strong>Collect</strong>.
            </div>
            <label for="gold">Calculate fee (gold): </label>
            <input id="gold" type="text" v-model="inputVal" placeholder="Gold Amount"/>
        </div>
    </transition>
</div>
</template>

<script>
import Vue from 'vue';
import Taxes from "@/api/taxes";

export default {
    data: function() {
        return {
            loading: true,
            taxes: null,
            inputVal: null,
            tradeVal: 0,
            mailVal: 0,
            marketListVal: 0,
            marketSelLVal: 0,
            error: null,
        }
    },
    created() {
        this.fetchData();
    },
    computed: {
        inputSafe() {
            if (!this.inputVal) {
                return 0;
            }

            let ret = Number(this.inputVal);
            if (isNaN(ret)) {
                return 0;
            }

            return ret;
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.error = null;

            Taxes.getTaxes(this.$store.state.regionCode,
                (res) => {
                    this.taxes = res;
                    this.loading = false;
                    this.error = null;
                },
                (err) => {
                    this.loading = false;
                    this.error = err;
                });
        },
        goBack() {
            this.$router.back();
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.taxes {

    table {
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
                    min-width: 40px;
                    text-align: right;
                }

                &.fixed {
                    width: 80px;
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

        tr:hover,
        tr.active:hover {
            background: fade(@dv-c-foreground, 30%);
            color: @dv-c-foreground;
        }

        tr.active {
            background: fade(@dv-c-foreground, 20%);
            color: @dv-c-foreground;
        }

        tr th {
            border-right: 2px solid @dv-c-body;
            border-bottom-color: transparent;
            padding: 4px 12px 4px 0;
            text-align: right;
            color: @dv-c-foreground;
            font-size: 12px;
            font-weight: normal;
            text-transform: uppercase;
            min-width: 68px;

        }

        th, td {
            border-bottom: 1px solid @dv-c-idle;
            padding: 4px 4px 4px 4px;
        }

        td {
            padding: 0 1em;
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

    .note {
        margin: 8px 0;
        &::before {
            content: "NOTE*";
            font-size: 0.75em;
            color: @dv-c-accent-2;
        }

        &.dagger {
            &::before {
                content: "NOTE†";
            }
        }
    }

    input[type="text"] {
        color: @rank-divine;
        border-bottom: 1px fade(@rank-divine, 40%) solid;
        
        &:hover,
        &:focus {
            border-bottom-color: @rank-divine;
        }
        
        &::placeholder {
            color: fade(@rank-divine, 40%);
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

