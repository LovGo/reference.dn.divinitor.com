<template>
    <div class="monster">
        
        <!--
            LOADING
         -->
        <div class="top">&nbsp; <!-- Prevent margin collapse --></div>
        <transition name="fade">
            <div v-if="loading" class="loading">
                <load-indicator
                :loadText="`Monster #${monsterId}`"></load-indicator>
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
                    :secondaryInfo="`Monster ID #${monsterId}`"
                    canRetry="true"
                    v-on:retry="fetchData"
                    iconClass="fa-exclamation-triangle"></big-error-box>
            </div>
        </transition>
        <!--
            RESULT
         -->
        <div v-if="!loading && monsterData">
            <div class="go-back"
                v-on:click="goBack">
                <i class="fa fa-angle-double-left"></i>Back
            </div>

            <div class="header">
                <div class="title">
                    <div class="remark">
                        <span class="iid">#{{ monsterId }}</span>
                    </div>
                    <h2 class="head">
                        {{ name }}
                    </h2>
                    <div class="remark">
                        <span class="level">{{ monsterData.level }} </span>
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

                <table class="stats">
                    <thead>
                        <th class="first">Stat</th>
                        <th>Base</th>
                        <th v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            Difficulty {{ w.difficulty }}
                        </th>
                    </thead>
                    <tr>
                        <th>HP</th>
                        <td>{{ monsterData.baseStats.hp | thousands}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "hp") | thousands }}
                        </td>
                    </tr>
                    <tr>
                        <th>PDMG</th>
                        <td>
                            {{ monsterData.baseStats.pdmg.min | thousands}} -<br/>
                            {{ monsterData.baseStats.pdmg.max | thousands}}
                        </td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "pdmg") | thousands("min") }} -<br/>
                            {{ applyStat(w.statWeights, "pdmg") | thousands("max") }}
                        </td>
                    </tr>
                    <tr>
                        <th>MDMG</th>
                        <td>
                            {{ monsterData.baseStats.mdmg.min | thousands}} -<br/>
                            {{ monsterData.baseStats.mdmg.max | thousands}}
                        </td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "mdmg") | thousands("min") }} -<br/>
                            {{ applyStat(w.statWeights, "mdmg") | thousands("max") }}
                        </td>
                    </tr>
                    <tr>
                        <th>PDEF</th>
                        <td>{{ monsterData.baseStats.pdef | thousands}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "pdef") | thousands }}
                        </td>
                    </tr>
                    <tr>
                        <th>MDEF</th>
                        <td>{{ monsterData.baseStats.mdef | thousands}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "mdef") | thousands }}
                        </td>
                    </tr>
                    <tr>
                        <th>Para</th>
                        <td>{{ monsterData.baseStats.para | thousands}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "para") | thousands }}
                        </td>
                    </tr>
                    <tr>
                        <th>Crit</th>
                        <td>{{ monsterData.baseStats.crit | thousands}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "crit") | thousands }}
                        </td>
                    </tr>
                    <tr>
                        <th>Stun</th>
                        <td>{{ monsterData.baseStats.stun | thousands}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "stun") | thousands }}
                        </td>
                    </tr>
                    <tr>
                        <th>Para Resist</th>
                        <td>{{ monsterData.baseStats.paraResist | thousands}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "paraResist") | thousands }}
                        </td>
                    </tr>
                    <tr>
                        <th>Crit Resist</th>
                        <td>{{ monsterData.baseStats.critResist | thousands}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "critResist") | thousands }}
                        </td>
                    </tr>
                    <tr>
                        <th>Stun Resist</th>
                        <td>{{ monsterData.baseStats.stunResist | thousands}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "stunResist") | thousands }}
                        </td>
                    </tr>
                    <tr>
                        <th>Ele Atk</th>
                        <td>{{ monsterData.baseStats.eleAtk | statPercent}} {{ monsterData.elementalType }}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "eleAtk") | statPercent }} {{ monsterData.elementalType }}
                        </td>
                    </tr>
                    <tr>
                        <th>Fire Def</th>
                        <td>{{ monsterData.baseStats.fireDef | statPercent}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "fireDef") | statPercent }}
                        </td>
                    </tr>
                    <tr>
                        <th>Ice Def</th>
                        <td>{{ monsterData.baseStats.iceDef | statPercent}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "iceDef") | statPercent }}
                        </td>
                    </tr>
                    <tr>
                        <th>Light Def</th>
                        <td>{{ monsterData.baseStats.lightDef | statPercent}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "lightDef") | statPercent }}
                        </td>
                    </tr>
                    <tr>
                        <th>Dark Def</th>
                        <td>{{ monsterData.baseStats.darkDef | statPercent}}</td>
                        <td v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                            {{ applyStat(w.statWeights, "darkDef") | statPercent }}
                        </td>
                    </tr>
                </table>

                <table class="stats">
                    <thead>
                        <th class="first smaller">Difficulty</th>
                        <th>AI Script</th>
                    </thead>
                    <tr v-for="w in sorted(monsterData.difficulties, 'difficulty')" :key="w.id">
                        <th>D {{ w.difficulty }}</th>
                        <td>{{ w.aiScript }}</td>
                    </tr>
                </table>
            </div>
            <div class="section">
                <div class="title">Actor Info</div>

                <div>
                    Skin file: {{monsterData.actor.skn.name}}
                </div>
                <div>
                    Action file: {{monsterData.actor.act.name}}
                </div>
                <div>
                    Animation file: {{monsterData.actor.ani.name}}
                </div>
                <div v-if="monsterData.actor.cam.name">
                    Camera file: {{monsterData.actor.cam.name}}
                </div>
            </div>
            <div class="section">
                <div class="title">Weapons</div>
                TODO
            </div>
            <div class="section">
                <div class="title">Skillset</div>
                TODO
            </div>
            <div class="section">
                <div class="title">Status Immunities</div>
                {{monsterData.immunities}}
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import BigErrorBox from '@/components/util/BigErrorBox';

Vue.component('big-error-box', BigErrorBox);

import Monster from "@/api/monster/monster";

export default {
    data: function() {
        return {
            monsterId: this.extractMonsterId(this.$route.params.monsterId),
            loading: true,
            monsterData: null,
            error: null,
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        '$route'(to, from) {
            this.monsterId = this.extractMonsterId(this.$route.params.monsterId);
        },
        monsterId(to, from) {
            if (to != from) {
                this.fetchData();
            }
        }
    },
    computed: {
        region() {
            return this.$store.state.regionCode;
        },
        name() {
            if (this.monsterData.name) {
                if (this.monsterData.name.message && this.monsterData.name.id) {
                    return this.monsterData.name.message;
                } else if (this.monsterData.name.id) {
                    return "Monster MID: " + this.monsterData.name.id;
                }
            }
            
            return "Monster #" + this.monsterId;
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.monsterData = null;

            Monster.getMonster(this.monsterId, this.$store.state.regionCode,
                (res) => {
                    this.monsterData = res;
                    this.loading = false;
                },
                (err) => {
                    this.error = err;
                    this.loading = false;
                });
        },
        extractMonsterId(str) {
            let split = str.split("-", 2);
            return Number(split[0]);
        },
        goBack() {
            this.$router.back();
        },
        sorted(array, fieldName) {
            return array.slice().sort((a, b) => {
                return a[fieldName] - b[fieldName];
            });
        },
        mapStatName(name) {
            //  TODO

            return name;
        },
        applyStat(difficultyObj, statName) {
            let stat = this.monsterData.baseStats[statName];
            let statMul = difficultyObj[statName];
            if (typeof stat === "object" && "min" in stat) {
                return {
                    min: Math.round(stat.min * statMul.min, 0),
                    max: Math.round(stat.max * statMul.max, 0)
                };
            }

            return Number(stat * statMul);
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../../less/core.less";

.monster {
    position: relative;
    min-height: 70px;
    margin-top: 0;
    padding-top: 0;
    width: 100%;
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

    .stats {
        
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
                    &.smaller {
                    }
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
}
</style>
