<template>
<div class="stat-grid">
    <table class="stat-table">
        <thead v-if="!hideHeader">
            <th class="first">Stat</th>
            <th>Base</th>
            <th v-if="hasEnhance">Enhancement</th>
            <th v-if="hasEnhance">Total</th>
        </thead>

        <tr v-for="statKey in statList" :key="statKey.key">
            <th>{{ statKey.stateInfo.abbv }}</th>
            <td>{{ renderStat(statKey.stateInfo, statKey.base) }}</td>
        </tr>
    </table>
</div>
</template>

<script lang="ts">
import IItemState,{ deconstruct } from '@/models/items/IItemState';
import ITypedMap from '@/models/util/ITypedMap';
import { ItemState, IItemStateInfo, StateInfo } from '@/models/items/ItemEnums';

interface IData {

}

interface IStatEntry {
    key: string;
    stateInfo: IItemStateInfo;
    base: IItemState;
    enhance?: IItemState;
    total?: IItemState;
}

export default {
    // props: ["statSet", "enhanceStatSet", "hideHeader"],
    props: {
        statSet: {
            type: Array as () => IItemState[],
            required: true,
        },
        enhanceStatSet: {
            type: Array as () => IItemState[],
        },
        hideHeader: {
            type: Boolean as () => boolean,
        }
    },
    data(): IData {
        return {
        };
    },
    computed: {
        deconStatSet(): IItemState[] {
            return deconstruct(this.statSet);
        },
        deconEnhanceStatSet(): IItemState[] {
            if (this.enhanceStatSet) {
                return deconstruct(this.enhanceStatSet);
            }
            return [];
        },
        statList(): IStatEntry[] {
            const info: ITypedMap<IItemStateInfo> = {};
            for (let stat of this.deconStatSet) {
                const stateInfoName = ItemState[stat.state];
                const stateInfo = StateInfo[stat.state];
                if (stateInfo) {
                    info[stateInfoName] = stateInfo;
                }
            }

            if (this.hasEnhance) {
                for (let stat of this.deconEnhanceStatSet) {
                    const stateInfoName = ItemState[stat.state];
                    const stateInfo = StateInfo[stat.state];
                    if (stateInfo) {
                        info[stateInfoName] = stateInfo;
                    }
                }
            }

            const ret: IStatEntry[] = [];
            for (let k in info) {
                const v = info[k];
                const base = this.deconStatSet.find((s) => ItemState[s.state] === k)!
                const enhance = this.hasEnhance ? this.deconEnhanceStatSet.find((s) => ItemState[s.state] === k) : undefined;

                ret.push({
                    key: k,
                    stateInfo: v,
                    base: base,
                    enhance: enhance,
                });
            }

            return ret;
        },
        hasEnhance(): boolean {
            return this.enhanceStatSet && this.enhanceStatSet.length > 0;
        }
    },
    methods: {
        renderStat(info: IItemStateInfo, state?: IItemState): string {
            if (state) {
                if (info.type === 'stat') {
                    return state.value.toLocaleString(undefined, {
                        useGrouping: true,
                        maximumFractionDigits: 0,
                    });
                }

                return state.value.toString();
            } else {
                return '&#8210';
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.stat-grid {

    .enhance {
        color: @dv-c-green;
    }

    .total {
        color: @dv-c-foreground;
    }

    .stat-table {
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

                &.first {
                    .border-right(2px solid @dv-c-body);
                    min-width: 50px;
                    .text-align(right);
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
            .padding-left(0.125em);
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
            .border-right(2px solid @dv-c-body);
            border-bottom-color: transparent;
            padding: 4px 12px 4px 0;
            .text-align(right);
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
            .padding-left(0.25em);
            .padding-right(0.5em);
        }
        tr:last-child td {
            border-bottom-color: transparent;
        }
    }

    .no-stats {
        color: @dv-c-body;
        padding: 4px 8px;
        width: 130px;
        margin: 6px 0 0 6px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        text-align: center;
        background-color: fade(@dv-c-red, 40%);
    }

}
</style>
