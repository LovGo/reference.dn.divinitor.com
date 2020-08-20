<template>
<div class="item-shop">
    <div class="loading" v-if="shopData.loading"> 
        <loader load-text="Loading shop"/>
    </div>
    <div class="result" v-if="shopData.value">
        <div class="shop-pane">
            <div class="pages">
                <div class="page-tab"
                    v-for="(i, num) in numPages"
                    :key="i"
                    @click="setPage(num)"
                    :active="num === pageNumber">
                    {{ i }}
                </div>
            </div>
            <div class="item-grid">
                <div class="grid-entry"
                    v-for="(slot, i) of currentPageSlots"
                    :key="i">
                    <template v-if="slot">
                        <item-icon-tooltip
                            :itemId="slot.itemId"
                            :count="slot.quantity"
                            :userData="slot"
                            :noLink="!useClick"
                            :directionHint="i > 14 ? 'up' : 'down'"
                            @click="clickItem"
                            >
                            <div class="purchase-details">
                                <div class="seals section" v-if="slot.seals >= 0">
                                    <template v-if="slot.seals == 0">
                                        Item can have bindings added
                                    </template>
                                    <template v-else>
                                        Item has <strong>{{ slot.seals }}</strong> unbinds
                                    </template>
                                </div>
                                <div class="costs section">
                                    <div class="cost-label">Price</div>
                                    <div class="cost"
                                        v-for="(cost, i) of slot.cost"
                                        :key="i">
                                        <div class="gold" v-if="cost.costType == 1">
                                            <template v-if="cost.costParam">{{ cost.costParam | gold }}</template>
                                        </div>
                                        <div class="card-container" v-else-if="cost.costType == 2">
                                            <item-card
                                                :itemId="cost.costItemId"
                                                :count="cost.costParam"
                                                :noLink="true"
                                                :onClick="()=>{}"/>
                                        </div>
                                        <template v-else-if="cost.costType == 3">
                                            <strong>{{ cost.costParam}} Ladder Points</strong>
                                        </template>
                                        <template v-else-if="cost.costType == 4">
                                            <strong>{{ cost.costParam}} Alliance Points</strong>
                                        </template>
                                        <div class="point-container" v-else>
                                            <point-tag
                                                :pointId="cost.costType"
                                                :amount="cost.costParam"
                                                :noTip="true"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="limits section" v-if="slot.limitReset">
                                    Limit <strong>{{ limitString(slot) }}</strong>
                                </div>
                                <div class="requirements section" v-if="slot.limitType">
                                    <template v-if="slot.limitType == 2">
                                        Lv <strong>{{ slot.limitParam }}+</strong> only
                                    </template>
                                    <template v-else-if="slot.limitType == 3">
                                        PvP rank <strong>{{ slot.limitParam }}+</strong> only
                                    </template>
                                    <template v-else-if="slot.limitType == 6">
                                        <strong>{{ slot.limitParam }}+</strong> Achievement Points only
                                    </template>
                                    <template v-else-if="slot.limitType == 7">
                                        Ladder rank <strong>{{ slot.limitParam }}+</strong> only
                                    </template>
                                </div>
                            </div>
                        </item-icon-tooltip>
                    </template>
                </div>
            </div>
        </div>
        <div class="tabs">
            <div class="tab"
                v-for="tab of shopData.value.tabs"
                :key="tab.id"
                @click="setTab(tab.id)"
                :active="tabIndex === tab.id">
                {{ tab.name.message }}
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import LoadingErrorable from '@/models/util/LoadingErrorable';
import ShopProvider from '@/api/ShopProvider';
import Loader from "@/components/util/Loader.vue";
import IItemShop, { IItemShopTab, IItemShopTabEntry, PurchaseLimitType, ShopLimitResetType } from '@/models/items/IItemShop';
import ItemIconTooltip from '@/old/items/ItemIconTooltip.vue';
import ItemCard from '@/old/items/ItemCard.vue';
import Points from '@/old/game/Points.vue';

Vue.component('point-tag', Points);

interface IData {
    shopData: LoadingErrorable<IItemShop, any>,
    tabIndex: number;
    pageNumber: number;
}

export default Vue.extend({
    props: {
        shopId: {
            type: Number as () => number,
        },
        useClick: {
            type: Boolean as () => boolean,
            default: false,
        },
    },
    components: {
        Loader,
        ItemIconTooltip,
        ItemCard,
    },
    data(): IData {
        return {
            shopData: new LoadingErrorable(),
            tabIndex: 0,
            pageNumber: 0,
        };
    },
    watch: {
        shopId() {
            this.load();
        }
    },
    computed: {
        numPages(): number {
            if (this.shopData.value) {
                const tab = this.currentTab;
                if (tab) {
                    return Math.max(1, Math.ceil(Math.max(...tab.entries.map((r) => r.index)) / 30));
                }
            }

            return 0;
        },
        currentTab(): IItemShopTab|null {
            if (this.shopData.value) {
                return this.shopData.value.tabs.find((t) => t.id === this.tabIndex) || null;
            }

            return null;
        },
        currentTabItems(): IItemShopTabEntry[] {
            const tab = this.currentTab;
            if (tab) {
                return tab.entries;
            }

            return [];
        },
        currentPageItems(): IItemShopTabEntry[] {
            return this.currentTabItems.filter((r) => r.index >= (this.pageNumber * 30) && r.index < ((this.pageNumber + 1) * 30));
        },
        currentPageSlots(): (IItemShopTabEntry|null)[] {
            const ret = [];
            for (let i = 0; i < 30; ++i) {
                const idx = (this.pageNumber * 30) + i;
                ret[i] = this.currentPageItems.find((r) => r.index === idx) || null;
            }

            return ret;
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            if (this.shopData.loading) {
                return;
            }

            this.shopData.startLoad();
            try {
                this.shopData.done(await ShopProvider.getShop(this.shopId));
                if (this.shopData.value && this.shopData.value.tabs[0]) {
                    this.tabIndex = this.shopData.value!.tabs[0].id;
                }
            } catch (error) {
                this.shopData.failed(error);
            }
        },
        setTab(idx: number) {
            this.tabIndex = idx;
            this.pageNumber = 0;
        },
        setPage(idx: number) {
            this.pageNumber = idx;
        },
        limitString(entry: IItemShopTabEntry): string {
            switch (entry.limitReset) {
                case ShopLimitResetType.DAILY:
                    return `${entry.limitCount} per day`;
                case ShopLimitResetType.DAILY_ACCOUNT:
                    return `${entry.limitCount} per day per account`;
                case ShopLimitResetType.WEEKLY:
                    return `${entry.limitCount} per week`;
                case ShopLimitResetType.WEEKLY_ACCOUNT:
                    return `${entry.limitCount} per week per account`;
                default:
                    return `${entry.limitCount} per unknown:${entry.limitReset}`;
            }
        },
        clickItem(ud: IItemShopTabEntry) {
            this.$emit('click', ud);
        }
    }
});
</script>

<style lang="less" scoped>
@import '~@/less/core.less';

.item-shop {

    .result {
        display: flex;
        flex-direction: row;
        justify-content: center;
        .shop-pane {
            @tile-size: 58px;

            .pages {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                min-height: 30px;

                .page-tab {
                    flex: 0 0 @tile-size;
                    text-align: center;
                    padding: 4px 0 6px;
                    border: 1px solid @dv-c-accent-1;
                    border-bottom: none;
                    cursor: pointer;
                    transition: all 0.125s ease-in;

                    &:hover {
                        background: fade(@dv-c-foreground, 40%);
                    }

                    &[active] {
                        border-color: @dv-c-accent-2;
                        background: fade(@dv-c-foreground, 20%);
                    }
                }
            }

            .item-grid {
                display: inline-grid;
                grid-template-columns: @tile-size @tile-size @tile-size @tile-size @tile-size;
                border: 1px solid @dv-c-accent-1;
                padding: 1px;
                grid-gap: 2px;
                background: fade(@dv-c-accent-2, 20%);

                .grid-entry {
                    width: @tile-size;
                    height: @tile-size;
                    background: fade(@dv-c-background, 80%);
                    transition: background-color 0.125s ease-in;

                    &:hover {
                        background: fade(@dv-c-background, 40%);
                    }

                    .purchase-details {

                        .cost-label {
                            text-transform: uppercase;
                            font-size: 12px;
                            letter-spacing: 0.1em;
                            font-family: @dv-f-geomanist;
                            margin: 4px 0 8px;
                        }
                        .cost {
                            .card-container {
                                width: 400px;
                                border: 1px solid @dv-c-foreground;
                            }

                            .point-container {
                                white-space: nowrap;
                                margin-top: -10px;
                                margin-left: -2px;
                            }

                            .gold {
                                color: @rank-divine;
                                margin: 4px 0;
                                font-weight: bold;
                            }
                        }
                    }

                    .section {
                        border-top: 1px solid @dv-c-idle;
                        margin-top: 6px;
                        padding-top: 4px;
                    }
                }
            }
        }

        .tabs {
            display: flex;
            flex-direction: column;
            margin-top: 30px + 15px;

            .tab {
                padding: 8px 12px 10px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                font-family: @dv-f-geomanist;

                border: 1px solid @dv-c-accent-1;
                border-left: none;
                text-align: center;
                border-top-width: 0px;
                background: fade(@dv-c-background, 40%);
                cursor: pointer;
                transition: background-color 0.125s ease-in, border-color 0.125s ease-in;

                &:first-child {
                    border-top-width: 1px;
                }

                &:hover {
                    background: fade(@dv-c-foreground, 40%);
                }

                &[active] {
                    border-color: @dv-c-accent-2;
                    border-top-width: 1px;
                    margin-top: -1px;
                    background: fade(@dv-c-foreground, 10%);

                    &:first-child {
                        margin-top: 0;
                    }
                }
            }
        }
    }
}
</style>