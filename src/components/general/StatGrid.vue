<template>
<div class="stat-grid">
    <table class="stat-table">
        <thead v-if="!hideHeader">
            <th class="first">Stat</th>
            <th>Base</th>
            <th v-if="hasEnhance">Enhancement</th>
            <th v-if="hasEnhance">Total</th>
        </thead>

        <tr v-for="stat in listOfRangedStates" :key="stat.state">
            <th> {{ stat.info.abbv }} </th>
            <td> {{ renderStat(stat) }} </td>
            <template v-if="hasEnhance">
                <td> {{ renderStat(stat, 'e') }} </td>
                <td> {{ renderStat(stat, 't') }} </td>
            </template>
        </tr>

        <tr v-for="stat in listOfStatesWithoutDmg" :key="stat.state">
            <th> {{ stat.info.abbv }} </th>
            <td> {{ renderStat(stat) }} </td>
            <template v-if="hasEnhance">
                <td> {{ renderStat(stat, 'e') }} </td>
                <td> {{ renderStat(stat, 't') }} </td>
            </template>
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

interface IItemStateInfoPair {
    state: ItemState;
    info: IItemStateInfo;
}

interface IRangedStatInfo {
    low: number;
    high: number;
}

export default {
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
        hasEnhance(): boolean {
            return this.enhanceStatSet && this.enhanceStatSet.length > 0;
        },
        listOfStates(): IItemStateInfoPair[] {
            let stats = this.deconStatSet.map((v) => v.state);
            if (this.hasEnhance) {
                stats = stats.concat(this.deconEnhanceStatSet.map((v) => v.state));
            }

            stats = stats.filter((v, i, a) => a.indexOf(v) === i);

            return stats.map((s) => ({
                state: s,
                info: StateInfo[s],
            }));
        },
        listOfStatesWithoutDmg(): IItemStateInfoPair[] {
            return this.listOfStates.filter((v) => {
                switch (v.state) {
                    case ItemState.PHYSICAL_DAMAGE_MIN:
                    case ItemState.PHYSICAL_DAMAGE_MAX:
                    case ItemState.MAGICAL_DAMAGE_MIN:
                    case ItemState.MAGICAL_DAMAGE_MAX:
                    case ItemState.PHYSICAL_DAMAGE_MIN_PERCENT:
                    case ItemState.PHYSICAL_DAMAGE_MAX_PERCENT:
                    case ItemState.MAGICAL_DAMAGE_MIN_PERCENT:
                    case ItemState.MAGICAL_DAMAGE_MAX_PERCENT:
                        return false;
                }

                return true;
            });
        },
        listOfRangedStates(): IItemStateInfoPair[] {
            return this.listOfStates.map((v) => {
                switch (v.state) {
                    case ItemState.PHYSICAL_DAMAGE_MIN:
                    case ItemState.PHYSICAL_DAMAGE_MAX:
                        return ItemState.PHYSICAL_DAMAGE_MINMAX;

                    case ItemState.MAGICAL_DAMAGE_MIN:
                    case ItemState.MAGICAL_DAMAGE_MAX:
                        return ItemState.MAGICAL_DAMAGE_MINMAX;

                    case ItemState.PHYSICAL_DAMAGE_MIN_PERCENT:
                    case ItemState.PHYSICAL_DAMAGE_MAX_PERCENT:
                        return ItemState.PHYSICAL_DAMAGE_MINMAX_PERCENT;

                    case ItemState.MAGICAL_DAMAGE_MIN_PERCENT:
                    case ItemState.MAGICAL_DAMAGE_MAX_PERCENT:
                        return ItemState.MAGICAL_DAMAGE_MINMAX_PERCENT;
                }

                return null;
            }).filter((v) => v != null)
            .filter((v, i, a) => a.indexOf(v) === i)
            .reverse()
            .map((v) => ({
                state: v!,
                info: StateInfo[v!],
            }));
        }
    },
    methods: {
        renderStat(stateInfo: IItemStateInfoPair, type: 'b'|'e'|'t' = 'b'): string {
            const info = stateInfo.info;
            if (info.type === 'compound') {
                const compound = info.compound!;
                let parts: string[] = [];
                for (let c of compound) {
                    const state = this.getState(c, type);
                    let value = '';
                    if (state) {
                        if (info.subtype === 'stat') {
                            value = state.value.toLocaleString(undefined, {
                                useGrouping: true,
                                maximumFractionDigits: 0,
                            });
                        } else if (info.subtype === 'percent') {
                            value = (state.value * 100).toLocaleString(undefined, {
                                useGrouping: true,
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            }) + '%';
                        } else {
                            value = state.value.toString();
                        }

                        parts.push(value);
                    }
                }

                // If the min and max values are the same, just merge them
                parts = parts.filter((v, i, a) => a.indexOf(v) === i);

                return parts.join(' - ');
            } else {
                const state = this.getState(stateInfo.state, type);
                if (state) {
                    if (info.type === 'stat') {
                        return state.value.toLocaleString(undefined, {
                            useGrouping: true,
                            maximumFractionDigits: 0,
                        });
                    } else if (info.type === 'percent') {
                        return (state.value * 100).toLocaleString(undefined, {
                            useGrouping: true,
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                        }) + '%';
                    }

                    return state.value.toString();
                } else {
                    return '—';
                }
            }
        },
        getState(state: ItemState, type: 'b'|'e'|'t' = 'b'): IItemState|null {
            if (type === 'b') {
                return this.deconStatSet.find((v) => v.state === state) || null;
            }
            if (type === 'e' && this.hasEnhance) {
                return this.deconEnhanceStatSet.find((v) => v.state === state) || null;
            }
            if (type === 't') {
                // todo
                return null;
            }

            return null;
        },
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
