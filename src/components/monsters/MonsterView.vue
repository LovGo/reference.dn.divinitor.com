<template>
<transition name="fade-fast" mode="out-in">
<div class="monster-view">
    <div class="loading" v-if="loading">
        <loader :load-text="`Loading monster ${this.monsterId}`"/>
    </div>
    <div class="error" v-if="error">
        {{ error }}
    </div>
    <template v-if="monster">
        <div class="header">
            <div class="title">
                <div class="remark">
                    <span class="iid">#{{ monster.id }}</span>
                </div>
                <h2 class="head">
                    <ui-string :messageData="monster.name"/>
                </h2>
                <div class="remark">
                    <span class="level">{{ monster.level }} </span>
                </div>
            </div>
        </div>
        <div class="info toast">
            <div class="icon">
                <i class="fa fa-exclamation-triangle"></i>
            </div>
            <div class="content">
                <div class="heading">
                    Beware the imposter
                </div>
                <p>
                    Please make sure you're viewing the correct monster, as many monsters have duplicates. Verify 
                    the monster by performing a sanity check on the stats and by inspecting the Actor Info below 
                    (pay attention to the file names).
                </p>
            </div>
        </div>

        <div class="section">
            <div class="title">Stats</div>

            Please note that difficulty IDs are arbitrary and don't necessarily go in order of difficulty.
            <div class="stats">
                <table>
                    <thead>
                        <th>RowID</th>
                        <th>Diff</th>
                        <th>HP</th>
                        <th>PDMG</th>
                        <th>MDMG</th>
                        <th>PDEF</th>
                        <th>MDEF</th>
                        <th>Crit</th>
                        <th>Crit Res</th>
                        <th>Ele%</th>
                        <th>Fire Def</th>
                        <th>Ice Def</th>
                        <th>Light Def</th>
                        <th>Dark Def</th>
                        <th>AI Script</th>
                    </thead>
                    <tbody>
                        <tr v-for="d of sortedDifficulties" :key="d.id">
                            <th>{{ d.id }}</th>
                            <td>{{ d.difficulty }}</td>
                            <td>{{ monster.baseStats.hp * d.statWeights.hp | stat }}</td>
                            <td>{{ monster.baseStats.pdmg.min * d.statWeights.pdmg.min | stat }} - {{ monster.baseStats.pdmg.max * d.statWeights.pdmg.max | stat }}</td>
                            <td>{{ monster.baseStats.mdmg.min * d.statWeights.mdmg.min | stat }} - {{ monster.baseStats.mdmg.max * d.statWeights.mdmg.max | stat }}</td>
                            <td>{{ monster.baseStats.pdef * d.statWeights.pdef | stat }}</td>
                            <td>{{ monster.baseStats.mdef * d.statWeights.mdef | stat }}</td>
                            <td>{{ monster.baseStats.crit * d.statWeights.crit | stat }}</td>
                            <td>{{ monster.baseStats.critResist * d.statWeights.critResist | stat }}</td>
                            <td>{{ monster.baseStats.eleAtk * d.statWeights.eleAtk * 100 | stat }}%</td>
                            <td>{{ monster.baseStats.fireDef * d.statWeights.fireDef * 100 | stat }}%</td>
                            <td>{{ monster.baseStats.iceDef * d.statWeights.iceDef * 100 | stat }}%</td>
                            <td>{{ monster.baseStats.lightDef * d.statWeights.lightDef * 100 | stat }}%</td>
                            <td>{{ monster.baseStats.darkDef * d.statWeights.darkDef * 100 | stat }}%</td>
                            <td class="left"><a :href="`${baseApiUrl}/files/${d.aiScript}`" target="_blank">{{ d.aiScript }}</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="section">
                <div class="title">Actor Info</div>
                <table>
                    <thead>
                        <th class="first smaller">Resource</th>
                        <th>File</th>
                    </thead>
                    <tr>
                        <th>Skin</th>
                        <td class="left">
                            <a :href="`${baseApiUrl}/files/${monster.actor.skn.name}`" target="_blank">{{monster.actor.skn.name}}</a>
                            <span class="fid">{{monster.actor.skn.id}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th>Action</th>
                        <td class="left">
                            <a :href="`${baseApiUrl}/files/${monster.actor.act.name}`" target="_blank">{{monster.actor.act.name}}</a>
                            <span class="fid">{{monster.actor.act.id}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th>Animation</th>
                        <td class="left">
                            <a :href="`${baseApiUrl}/files/${monster.actor.ani.name}`" target="_blank">{{monster.actor.ani.name}}</a>
                            <span class="fid">{{monster.actor.ani.id}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th>Camera</th>
                        <td class="left">
                            <a :href="`${baseApiUrl}/files/${monster.actor.cam.name}`" target="_blank">{{monster.actor.cam.name}}</a>
                            <span class="fid">{{monster.actor.cam.id}}</span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="section">
            <div class="title">Skills</div>
            <input type="text" v-model="skillFilter" placeholder="Search ID..."/>
            <responsive-card-list :count="skillList.length">
                <responsive-card-list-entry v-for="(sk, i) in skillList" :key="i">
                    <skill-stub-link :skillId="sk.id" :fill="true" :level="sk.level" />
                </responsive-card-list-entry>
            </responsive-card-list>
        </div>
        <div class="section">
            <div class="title">Immunities</div>
            <table>
                <thead>
                    <th class="first smaller">State Effect</th>
                    <th>Immunity Rate</th>
                </thead>
                <tr v-for="(v, i) of immunities" :key="i">
                    <th>{{ v.stateEffectId }}</th>
                    <td>{{ v.immuneRateInt }}%</td>
                </tr>
            </table>
        </div>
    </template>
</div>
</transition>
</template>

<script lang="ts">
import Vue from 'vue';
import Loader from "@/components/util/Loader.vue";
import UiString from '@/components/uistring/UiString.vue';
import ResponsiveCardList from '@/components/util/ResponsiveCardList.vue';
import ResponsiveCardListEntry from '@/components/util/ResponsiveCardListEntry.vue';
import SkillStubTooltip from '@/components/skill/SkillStubTooltip.vue';
import SkillStubLink from '@/components/skill/SkillStubLink.vue';

import LegacyMonsterProvider from '@/api/MonsterProvider';
import ILegacyMonster, { ILegacyMonsterDifficulty, ILegacyMonsterImmunity } from '@/models/monsters/ILegacyMonster';
import IMonsterSkillEntry from '@/models/monsters/IMonsterSkillEntry';

interface IData {
    loading: boolean;
    error: string;
    monster: ILegacyMonster|null;
    skills: IMonsterSkillEntry[];
    skillFilter: string;
}

export default Vue.extend({
    components: {
        Loader,
        UiString,
        ResponsiveCardList,
        ResponsiveCardListEntry,
        SkillStubLink,
    },
    props: {
        monsterSlug: {
            type: String as () => string,
        } 
    },
    data(): IData {
        return {
            loading: false,
            error: '',
            monster: null,
            skills: [],
            skillFilter: '',
        }
    },
    filters: {
        stat(v: string): string {
            const n = Number(v);
            if (isNaN(n)) {
                return v;
            }
            
            return n.toLocaleString(undefined, {
                useGrouping: true,
                maximumFractionDigits: 0,
            });
        }
    },
    computed: {
        monsterId(): number {
            if (this.monsterSlug) {
                const res = Number(this.monsterSlug);
                if (isNaN(res)) {
                    return -1;
                }
                
                return res;
            }
            
            return -1;
        },
        sortedDifficulties(): ILegacyMonsterDifficulty[] {
            if (!this.monster) {
                return [];
            }
            
            return this.monster.difficulties.sort((a, b) => a.difficulty - b.difficulty);
        },
        baseApiUrl(): string {
            const region = this.$store.state.regionCode;
            return `/api/server/${region}`;
            
        },
        skillList(): IMonsterSkillEntry[] {
            if (!this.skills) {
                return [];
            }
            
            if (this.skillFilter) {
                const asNum = Number(this.skillFilter);
                if (!isNaN(asNum)) {
                    return this.skills.filter((s) => s.id === asNum);
                }
            }
            
            return this.skills;
        },
        immunities(): ILegacyMonsterImmunity[] {
            if (!this.monster) {
                return [];
            }
            
            return this.monster.immunities.sort((a, b) => a.stateEffectId - b.stateEffectId);
        }
    },
    watch: {
        monsterId() {
            this.load();
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            if (this.monsterId <= 0) {
                this.monster = null;
                this.error = 'Invalid monster ID';
                return;
            }
            
            this.loading = true;
            try {
                this.monster = await LegacyMonsterProvider.getMonster(this.monsterId);
                try {
                    this.skills = await LegacyMonsterProvider.getMonsterSkills(this.monster.skillTableId);
                } catch (skError) {
                    console.error(skError);
                }
            } catch (error) {
                this.error = String(error);
            } finally {
                this.loading = false;
            }
        }
    }
});
</script>

<style lang="less" scoped>
@import "../../less/core.less";
.monster-view {
    .header {
        position: relative;
        width: 100%;
        padding-left: 0;
        padding-bottom: 0;
        display: flex;
        flex-direction: row;

        .title {
            flex: 1 1 auto;
            border-left: 2px solid @dv-c-accent-1;
            padding-left: 12px;
            padding-top: 8px;
            padding-bottom: 8px;

            .head {
                margin: -4px 0;
                padding: 0;
                font-size: 24px;
            }

            .remark {
                font-size: 12px;
                letter-spacing: 0.2em;
                text-transform: uppercase;

                .tier {
                    display: inline-block;
                }

                .level {
                    color: @dv-c-accent-2;
                    &::before {
                        content: "LV ";
                        font-size: 0.625em;
                        color: @dv-c-accent-1;
                    }
                }

                .can-use {
                    color: @dv-c-accent-2;
                }

                .cash {
                    color: #10A020;
                }
            }
        }

    }

    
    .section {
        position: relative;
        margin-top: 25px;
        border-top: 1px solid @dv-c-accent-1;
        padding-top: 4px;
        .title {
            font-size: 12px;
            color: @dv-c-accent-1;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            position: absolute;
            top: -1.3em;
            left: 0;
            user-select: none;
        }

        .side-remark {
            font-size: 14px;
            color: @dv-c-body;
            .fa {
                color: @dv-c-foreground;
            }
            margin: 8px 0;
            // font-family: @dv-f-geomanist;
            // letter-spacing: 0.05em;
            // text-transform: uppercase;
        }
    }

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

                &.first {
                    border-right: 2px solid @dv-c-body;
                    width: 80px;
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
            background-color: fade(@dv-c-background, 70%);
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
            text-align: right;
        }
        
        .left {
            text-align: left;
        }

        td {
            padding: 0.25em 1em;
            letter-spacing: 0.05em;

            .substat {
                font-size: 12px;
            }
            
            &:hover a {
                color: @dv-c-foreground;
            }
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

    .stats {
        overflow-x: auto;
        max-width: 250px;
        @media only screen and (min-width: 450px) {
            max-width: 380px;
        }

        @media only screen and (min-width: 550px) {
            max-width: 500px;
        }

        @media only screen and (min-width:650px) {
            max-width: 400px;
        }

        @media only screen and (min-width:780px) {
            max-width: 500px;
        }

        @media only screen and (min-width:900px) {
            max-width: 644px;
        }

        @media only screen and (min-width:@min-desktop-wide-width) {
            max-width: 950px;
        }
    }

    .fid {
        color: @dv-c-accent-2;
        font-size: 0.75em;
        &::before {
            content: "#";
            color: fade(@dv-c-accent-2, 20%);
        }
    }
}
</style>
