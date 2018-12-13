<template>
<div class="stat-grid">
    <table class="stat-table" v-if="Object.keys(statSet).length">
        <thead v-if="!hideHeader">
            <th class="first">Stat</th>
            <th>Base</th>
            <th v-if="enhanceStatSet">Enhancement</th>
            <th v-if="enhanceStatSet">Total</th>
        </thead>
        
        <tr v-if="pdmgSet || pdmgESet">
            <th class="stat">{{ statList['PHYSICAL_DAMAGE_MINMAX'].abbv }}</th>
            <td v-if="pdmgSet && pdmgSet.min">
                <span v-if="pdmgSet.min == pdmgSet.max">
                    {{ pdmgSet.min | stat }}
                </span>
                <span v-else>
                    {{ pdmgSet.min | stat }} - {{ pdmgSet.max | stat }}
                </span>
            </td>
            <td v-else>
                &#8210;
            </td>
            <td class="enhance" v-if="pdmgESet && enhanceStatSet">
                <span v-if="pdmgESet.min == pdmgESet.max">
                    +{{ pdmgESet.min | stat }}
                </span>
                <span v-else>
                    +{{ pdmgESet.min | stat }} - +{{ pdmgESet.max | stat }}
                </span>
            </td>
            <td v-else-if="enhanceStatSet">
                &#8210;
            </td>
            <td class="total" v-if="enhanceStatSet">
                <span v-if="safeSum(pdmgESet, pdmgSet, 'min') == safeSum(pdmgESet, pdmgSet, 'max')">
                    {{ safeSum(pdmgESet, pdmgSet, 'min') | stat }}
                </span>
                <span v-else>
                    {{ safeSum(pdmgESet, pdmgSet, 'min') | stat }} - {{ safeSum(pdmgESet, pdmgSet, 'max') | stat }}
                </span>
            </td>
        </tr>
        <tr v-if="mdmgSet || mdmgESet">
            <th class="stat">{{ statList['MAGICAL_DAMAGE_MINMAX'].abbv }}</th>
            <td v-if="mdmgSet && mdmgSet.min">
                <span v-if="mdmgSet.min == mdmgSet.max">
                    {{ mdmgSet.min | stat }}
                </span>
                <span v-else>
                    {{ mdmgSet.min | stat }} - {{ mdmgSet.max | stat }}
                </span>
            </td>
            <td v-else>
                &#8210;
            </td>
            <td class="enhance" v-if="mdmgESet && enhanceStatSet">
                <span v-if="mdmgESet.min == mdmgESet.max">
                    +{{ mdmgESet.min | stat }}
                </span>
                <span v-else>
                    +{{ mdmgESet.min | stat }} - +{{ mdmgESet.max | stat }}
                </span>
            </td>
            <td v-else-if="enhanceStatSet">
                &#8210;
            </td>
            <td class="total" v-if="enhanceStatSet">
                <span v-if="safeSum(mdmgESet, mdmgSet, 'min') == safeSum(mdmgESet, mdmgSet, 'max')">
                    {{ safeSum(mdmgESet, mdmgSet, 'min') | stat }}
                </span>
                <span v-else>
                    {{ safeSum(mdmgESet, mdmgSet, 'min') | stat }} - {{ safeSum(mdmgESet, mdmgSet, 'max') | stat }}
                </span>
            </td>
        </tr>

        
        <tr v-if="pdmgPSet || pdmgPESet">
            <th class="stat">{{ statList['PHYSICAL_DAMAGE_MINMAX_PERCENT'].abbv }}</th>
            <td v-if="pdmgPSet.min || pdmgPSet.max">
                <span v-if="pdmgPSet.min == pdmgPSet.max">
                    {{ pdmgPSet.min | statPercent }}
                </span>
                <span v-else>
                    {{ pdmgPSet.min | statPercent }} - {{ pdmgPSet.max | statPercent }}
                </span>
            </td>
            <td v-else>
                &#8210;
            </td>
            <td class="enhance" v-if="enhanceStatSet">
                <span v-if="pdmgPSet.min == pdmgPSet.max">
                    +{{ pdmgPESet.min | statPercent }}
                </span>
                <span v-else>
                    +{{ pdmgPESet.min | statPercent }} - +{{ pdmgPESet.max | statPercent }}
                </span>
            </td>
            <td v-else-if="enhanceStatSet">
                &#8210;
            </td>
            <td class="total" v-if="enhanceStatSet">
                <span v-if="pdmgPESet.min + pdmgPSet.min == pdmgPESet.max + pdmgPSet.max">
                    {{ pdmgPESet.min + pdmgPSet.min | statPercent }}
                </span>
                <span v-else>
                    {{ pdmgPESet.min + pdmgPSet.min | statPercent }} - {{ pdmgPESet.max + pdmgPSet.max | statPercent }}
                </span>
            </td>
        </tr>
        <tr v-if="mdmgPSet || mdmgPESet">
            <th class="stat">{{ statList['MAGICAL_DAMAGE_MINMAX_PERCENT'].abbv }}</th>
            <td v-if="mdmgPSet.min || pdmgPSet.max">
                <span v-if="mdmgPSet.min == mdmgPSet.max">
                    {{ mdmgPSet.min | statPercent }}
                </span>
                <span v-else>
                    {{ mdmgPSet.min | statPercent }} - {{ mdmgPSet.max | statPercent }}
                </span>
            </td>
            <td v-else>
                &#8210;
            </td>
            <td class="enhance" v-if="enhanceStatSet">
                <span v-if="mdmgPSet.min == mdmgPSet.max">
                    +{{ mdmgPESet.min | statPercent }}
                </span>
                <span v-else>
                    +{{ mdmgPESet.min | statPercent }} - +{{ mdmgPESet.max | statPercent }}
                </span>
            </td>
            <td v-else-if="enhanceStatSet">
                &#8210;
            </td>
            <td class="total" v-if="enhanceStatSet">
                <span v-if="mdmgPESet.min + mdmgPSet.min == mdmgPESet.max + mdmgPSet.max">
                    {{ mdmgPESet.min + mdmgPSet.min | statPercent }}
                </span>
                <span v-else>
                    {{ mdmgPESet.min + mdmgPSet.min | statPercent }} - {{ mdmgPESet.max + mdmgPSet.max | statPercent }}
                </span>
            </td>
        </tr>

        <tr v-for="(d, k) in statList" :key="k" v-if="cleanedStatSet[k] || cleanedEStatSet[k]">
            <th>{{ d.abbv }}</th>
            <td v-if="d.type == 'stat'">
                <span v-if="cleanedStatSet[k]">
                    {{ cleanedStatSet[k] | stat }}
                </span>
                <span v-else>
                    &#8210;
                </span>
            </td>
            <td v-if="d.type == 'percent'">
                <span v-if="cleanedStatSet[k]">
                    {{ cleanedStatSet[k] | statPercent }}
                </span>
                <span v-else>
                    &#8210;
                </span>
            </td>
            <td class="enhance" v-if="cleanedEStatSet && cleanedEStatSet[k] && d.type == 'stat'">
                +{{ cleanedEStatSet[k] | stat }}
            </td>
            <td class="enhance" v-else-if="cleanedEStatSet && cleanedEStatSet[k] && d.type == 'percent'">
                +{{ cleanedEStatSet[k] | statPercent }}
            </td>
            <td v-else-if="enhanceStatSet">
                &#8210;
            </td>
            <td class="total" v-if="d.type == 'stat' && enhanceStatSet">
                {{ sumStat(k) | stat }}
            </td>
            <td class="total" v-if="d.type == 'percent' && enhanceStatSet">
                {{ sumStat(k) | statPercent }}
            </td>
        </tr>

    </table>
    <div class="no-stats" v-else>No stats</div>
</div>
</template>

<script>

import ItemStat from "@/old/api/item/itemstat";

export default {
    props: ["statSet", "enhanceStatSet", "hideHeader"],
    data: function() {
        return {

        };
    },
    computed: {
        pdmgSet() {
            return this.extractPdmg(this.statSet);
        },
        mdmgSet() {
            return this.extractMdmg(this.statSet);
        },
        pdmgESet() {
            return this.extractPdmg(this.enhanceStatSet);
        },
        mdmgESet() {
            return this.extractMdmg(this.enhanceStatSet);
        },
        pdmgPSet() {
            return this.extractPdmgPercent(this.statSet);
        },
        mdmgPSet() {
            return this.extractMdmgPercent(this.statSet);
        },
        pdmgPESet() {
            return this.extractPdmgPercent(this.enhanceStatSet);
        },
        mdmgPESet() {
            return this.extractMdmgPercent(this.enhanceStatSet);
        },
        cleanedStatSet() {
            return this.clean(this.statSet);
        },
        cleanedEStatSet() {
            return this.clean(this.enhanceStatSet);
        },
        statList() {
            let rret = {};

            if (this.statSet) {
                for (let k in this.statSet) {
                    if (k === 'PHYSICAL_DAMAGE_MIN' || k === 'PHYSICAL_DAMAGE_MAX') {
                        rret['PHYSICAL_DAMAGE_MINMAX'] = ItemStat.getStateInfo('PHYSICAL_DAMAGE_MINMAX');
                        continue;
                    }
                    if (k === 'MAGICAL_DAMAGE_MIN' || k === 'MAGICAL_DAMAGE_MAX') {
                        rret['MAGICAL_DAMAGE_MINMAX'] = ItemStat.getStateInfo('MAGICAL_DAMAGE_MINMAX');
                        continue;
                    }
                    if (k === 'PHYSICAL_DAMAGE_MIN_PERCENT' || k === 'PHYSICAL_DAMAGE_MAX_PERCENT') {
                        rret['PHYSICAL_DAMAGE_MINMAX_PERCENT'] = ItemStat.getStateInfo('PHYSICAL_DAMAGE_MINMAX_PERCENT');
                        continue;
                    }
                    if (k === 'MAGICAL_DAMAGE_MIN_PERCENT' || k === 'MAGICAL_DAMAGE_MAX_PERCENT') {
                        rret['MAGICAL_DAMAGE_MINMAX_PERCENT'] = ItemStat.getStateInfo('MAGICAL_DAMAGE_MINMAX_PERCENT');
                        continue;
                    }
                    
                    rret[k] = ItemStat.getStateInfo(k);
                }
            }
            if (this.enhanceStatSet) {
                for (let k in this.enhanceStatSet) {
                    if (k === 'PHYSICAL_DAMAGE_MIN' || k === 'PHYSICAL_DAMAGE_MAX') {
                        rret['PHYSICAL_DAMAGE_MINMAX'] = ItemStat.getStateInfo('PHYSICAL_DAMAGE_MINMAX');
                        continue;
                    }
                    if (k === 'MAGICAL_DAMAGE_MIN' || k === 'MAGICAL_DAMAGE_MAX') {
                        rret['MAGICAL_DAMAGE_MINMAX'] = ItemStat.getStateInfo('MAGICAL_DAMAGE_MINMAX');
                        continue;
                    }
                    if (k === 'PHYSICAL_DAMAGE_MIN_PERCENT' || k === 'PHYSICAL_DAMAGE_MAX_PERCENT') {
                        rret['PHYSICAL_DAMAGE_MINMAX_PERCENT'] = ItemStat.getStateInfo('PHYSICAL_DAMAGE_MINMAX_PERCENT');
                        continue;
                    }
                    if (k === 'MAGICAL_DAMAGE_MIN_PERCENT' || k === 'MAGICAL_DAMAGE_MAX_PERCENT') {
                        rret['MAGICAL_DAMAGE_MINMAX_PERCENT'] = ItemStat.getStateInfo('MAGICAL_DAMAGE_MINMAX_PERCENT');
                        continue;
                    }
                    
                    rret[k] = ItemStat.getStateInfo(k);
                }
            }

            

            return rret;
        }
    },
    methods: {
        extractPdmg(statSet) {
            if (!statSet) {
                return null;
            }

            let ret = {
                min: 0,
                max: 0
            };

            ret.min = statSet.PHYSICAL_DAMAGE_MIN;
            ret.max = statSet.PHYSICAL_DAMAGE_MAX;

            if (ret.min == undefined || ret.max == undefined) {
                return null;
            }

            return ret;
        },
        extractMdmg(statSet) {
            if (!statSet) {
                return null;
            }

            let ret = {
                min: 0,
                max: 0
            };

            ret.min = statSet.MAGICAL_DAMAGE_MIN;
            ret.max = statSet.MAGICAL_DAMAGE_MAX;

            if (ret.min == undefined || ret.max == undefined) {
                return null;
            }

            return ret;
        },
        extractPdmgPercent(statSet) {
            if (!statSet) {
                return null;
            }

            let ret = {
                min: 0,
                max: 0
            };

            ret.min = statSet.PHYSICAL_DAMAGE_MIN_PERCENT;
            ret.max = statSet.PHYSICAL_DAMAGE_MAX_PERCENT;

            if (ret.min == undefined && ret.max == undefined) {
                return null;
            }

            ret.min = ret.min ? ret.min : 0;
            ret.max = ret.max ? ret.max : 0;

            return ret;
        },
        extractMdmgPercent(statSet) {
            if (!statSet) {
                return null;
            }

            let ret = {
                min: 0,
                max: 0
            };

            ret.min = statSet.MAGICAL_DAMAGE_MIN_PERCENT;
            ret.max = statSet.MAGICAL_DAMAGE_MAX_PERCENT;

            if (ret.min == undefined && ret.max == undefined) {
                return null;
            }

            ret.min = ret.min ? ret.min : 0;
            ret.max = ret.max ? ret.max : 0;

            return ret;
        },
        clean(statSet) {
            if (!statSet) {
                return {};
            }

            let clone = {};
            for (let k in statSet) {
                if (k === 'PHYSICAL_DAMAGE_MIN' || k === 'PHYSICAL_DAMAGE_MAX' || k === 'PHYSICAL_DAMAGE_MINMAX') {
                    continue;
                }
                if (k === 'MAGICAL_DAMAGE_MIN' || k === 'MAGICAL_DAMAGE_MAX' || k === 'MAGICAL_DAMAGE_MINMAX') {
                    continue;
                }
                if (k === 'PHYSICAL_DAMAGE_MIN_PERCENT' || k === 'PHYSICAL_DAMAGE_MAX_PERCENT' || k === 'PHYSICAL_DAMAGE_MINMAX_PERCENT') {
                    continue;
                }
                if (k === 'MAGICAL_DAMAGE_MIN_PERCENT' || k === 'MAGICAL_DAMAGE_MAX_PERCENT' || k === 'MAGICAL_DAMAGE_MINMAX_PERCENT') {
                    continue;
                }

                clone[k] = statSet[k];
            }

            return clone;
        },
        sumStat(key) {
            let base = this.cleanedStatSet[key];
            let enh = this.cleanedEStatSet[key];
            if (base == undefined) {
                return enh;
            }
            if (enh == undefined) {
                return base;
            }

            return base + enh;
        },
        safeSum(a, b, key) {
            if (!a || a[key] == undefined) {
                return b[key];
            }
            if (!b || b[key] == undefined) {
                return a[key];
            }

            return a[key] + b[key];
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
                    border-right: 2px solid @dv-c-body;
                    min-width: 50px;
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
