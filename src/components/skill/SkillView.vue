<template>
<div class="skill-view">
    <div class="loading" v-if="skillDataLoader.loading"> 
        <loader :load-text="`Loading skill ${this.skillId}`"/>
    </div>
    <div class="result" v-if="skillDataLoader.isSuccess() && skillData">
        <div class="header">
            <div class="icon" v-if="this.hasSkillIcon">
                <sprite-icon :icon-info="this.skillData.skillIcon" />
            </div>
            <div class="title">
                <div class="remark">
                    <span class="id">#{{ this.skillId }}</span>
                </div>
                <h2 class="head">
                    <ui-string class="name" :message-data="this.skillData.name" />
                </h2>
                <div class="details">
                    <div class="job" v-if="this.skillData.requiredJob">
                        <div class="class-icon">
                            <sprite-icon :icon-info="this.skillData.requiredJob.icon" :size-override="16" />
                        </div>
                        {{ this.skillData.requiredJob.name.message }}
                    </div>
                    <div v-if="this.skillData.skillType == SkillType.ACTIVE">
                        active skill
                    </div>
                    <div v-else-if="this.skillData.skillType == SkillType.PASSIVE">
                        passive skill
                    </div>
                    <div v-else-if="this.skillData.skillType == SkillType.AUTOMATIC_PASSIVE">
                        auto passive skill
                    </div>
                    <div v-else-if="this.skillData.skillType == SkillType.EX_PASSIVE">
                        skill enhancement
                    </div>
                    <div v-else-if="this.skillData.skillType == SkillType.AUTOMATIC_ACTIVATION">
                        auto skill
                    </div>
                </div>
            </div>
        </div>

        <copy-link :copyContent="link">
            <i class="fa fa-share-square-o"></i> Copy link
            <template slot="ok"><i class="fa fa-check"></i> Link copied!</template>
        </copy-link>

        <div class="page-section">
            <div class="title">Basic Info</div>
            <div class="two-col">
                <table class="col">
                    <thead>
                        <th>Property</th>
                        <th>Value</th>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Skill Type</th>
                            <td>
                                <div v-if="skillData.skillType == SkillType.ACTIVE">
                                    Active skill
                                </div>
                                <div v-else-if="skillData.skillType == SkillType.PASSIVE">
                                    Passive skill
                                </div>
                                <div v-else-if="skillData.skillType == SkillType.AUTOMATIC_PASSIVE">
                                    Auto-triggered passive
                                </div>
                                <div v-else-if="skillData.skillType == SkillType.EX_PASSIVE">
                                    Skill enhancement
                                </div>
                                <div v-else-if="skillData.skillType == SkillType.AUTOMATIC_ACTIVATION">
                                    Automatically used
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>Apply Type</th>
                            <td>
                                <span v-if="skillData.durationTypeStr == 'INSTANT'">Regular</span>
                                <span v-else-if="skillData.durationTypeStr == 'BUFF'">Buff</span>
                                <span v-else-if="skillData.durationTypeStr == 'DEBUFF'">Debuff</span>
                                <span v-else-if="skillData.durationTypeStr == 'TIMED_TOGGLE'">Timed toggle</span>
                                <span v-else-if="skillData.durationTypeStr == 'ACTIVE_TOGGLE'">Active toggle</span>
                                <span v-else-if="skillData.durationTypeStr == 'AURA'">Aura</span>
                                <span v-else-if="skillData.durationTypeStr == 'ACTIVE_TOGGLE_PET'">Pet skill on/off</span>
                                <span v-else-if="skillData.durationTypeStr == 'SUMMON_DESUMMON_PET'">Toggle pet</span>
                                <span v-else-if="skillData.durationTypeStr == 'CHANGE_STANCE'">Stance change</span>
                                <span v-else-if="skillData.durationTypeStr == 'UNIFIED_SKILL'">Unified skill</span>
                            </td>
                        </tr>
                        <tr>
                            <th>Primary Target</th>
                            <td>
                                <span v-if="skillData.targetTypeStr == 'SELF'">Caster</span>
                                <span v-else-if="skillData.targetTypeStr == 'ENEMY'">Enemy</span>
                                <span v-else-if="skillData.targetTypeStr == 'ALLIED'">Friendly units</span>
                                <span v-else-if="skillData.targetTypeStr == 'PARTY_MEMBERS'">Party players</span>
                                <span v-else-if="skillData.targetTypeStr == 'ALL'">All</span>
                            </td>
                        </tr>
                        <tr>
                            <th>Elemental Type</th>
                            <td class="element">
                                <div class="fire" v-if="skillData.elementStr == 'FIRE'"><i class="fa fa-fire"></i> Fire</div>
                                <div class="ice" v-else-if="skillData.elementStr == 'WATER'"><i class="fa fa-snowflake-o"></i> Ice</div>
                                <div class="light" v-else-if="skillData.elementStr == 'LIGHT'"><i class="fa fa-bolt"></i> Light</div>
                                <div class="dark" v-else-if="skillData.elementStr == 'DARK'"><i class="fa fa-adjust"></i> Dark</div>
                                <div class="nonelemental" v-else><i class="fa fa-no-entry"></i> Non-elemental</div>
                            </td>
                        </tr>
                        <tr v-if="skillData.requiredWeapons.length != 0">
                            <th>Required Weapon(s)</th>
                            <td>
                                <div class="weapons">{{ weapons }}</div>
                            </td>
                        </tr>
                        <tr>
                            <th>Max Skill Rank</th>
                            <td v-if="isNaN(realMaxSkillLevel)">{{ skillData.spLevels }}</td>
                            <td v-else>{{ realMaxSkillLevel }}</td>
                        </tr>
                        <tr>
                            <th>Tech</th>
                            <td>
                                <div v-if="skillData.techLevels > 0">+{{ skillData.techLevels }}</div>
                                <div v-else>Cannot tech</div>
                            </td>
                        </tr>
                        <tr v-if="skillData.buffIcon && skillData.buffIcon.index != -1">
                            <th>Buff Icon</th>
                            <td>
                                <sprite-icon :icon-info="skillData.buffIcon"/>
                            </td>
                        </tr>
                        <tr v-if="skillData.debuffIcon && skillData.debuffIcon.index != -1">
                            <th>Debuff Icon</th>
                            <td>
                                <sprite-icon :icon-info="skillData.debuffIcon"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- <div class="col skill-video">
                    <div class="placeholder">Video here</div>
                </div> -->
            </div>
            <div class="extends" v-if="skillData.baseSkillId">
                <div class="label">This skill extends</div>
                <skill-stub-link :skill-id="skillData.baseSkillId" />
            </div>
        </div>

        <div class="rank page-section">
            <div class="title">Skill Rank Info</div>

        <div class="warn toast">
            <div class="content">
                <div class="heading">*Beeping truck noises*</div>
                This section is highly experimental and obviously not complete. Pardon the layout and bugs!
            </div>
        </div>

            <div class="options">
                <div class="checkbox">
                    <input id="pvp" type="checkbox" v-model="pvp" />
                    <label for="pvp">Display PvP Info</label>
                </div>
            </div>

            <!-- todo select rank -->
            <button v-on:click="down">-</button>
            <button v-on:click="up">+</button>
            {{ activeSkillRank }}

            <template v-if="activeRankData">
            <div class="rank-view">
                <div class="desc-pane">
                    <div class="rank-level">Rank {{ rankText }}<span v-if="pvp"> (PvP)</span></div>
                    <div class="entry" v-if="activeRankData.cooldown > 0">
                        <div class="key">Cooldown: </div>
                        <div class="value">
                            {{ activeRankData.cooldown | milliseconds }}s
                        </div>
                    </div>
                    <div class="entry" v-if="activeRankData.addThreat > 0">
                        <div class="key">Additional Threat: </div>
                        <div class="value">
                            {{ activeRankData.addThreat | thousands }}
                        </div>
                    </div>
                    <ui-string :message-data="activeRankData.skillDesc" :params="activeRankData.skillDescParam" :format="'html'" />
                </div>
                <div class="effect-pane" v-if="skillData.effects.length > 0">
                    <h4 class="pane-header">Applied effects</h4>
                    <div class="effect-options options">
                        <div class="checkbox">
                            <input id="show-all" type="checkbox" v-model="forceShowAllEffects" />
                            <label for="show-all">Display all</label>
                        </div>
                    </div>
                    <div class="effect" v-for="effect of skillData.effects" :key="effect.index">
                        <skill-effect :effect="effect" :value="effectValuesFor(effect.index, activeSkillRank)" :forceShow="forceShowAllEffects" />
                    </div>
                </div>
            </div>
            <div class="rank-view">
                <div class="processor-pane">
                    <h4 class="pane-header">Usage Constraints</h4>
                    <skill-usable
                        :canUseParams="activeRankData.canUseParams"
                        :usableCheckers="skillData.usableCheckers"/>
                </div>
            </div>
            <div class="rank-view">
                <div class="processor-pane">
                    <div>Processors</div>
                    <div v-for="(p, i) in skillData.processors" :key="i">
                        {{ p }}
                    </div>
                </div>
                <div class="processor-pane">
                    <div>ProcessParams</div>
                    <div v-for="(p, i) in activeRankData.processParams" :key="i">
                        {{ p }}
                    </div>
                </div>
                <div class="processor-pane">
                    <div>UsableCheckers</div>
                    <div v-for="(p, i) in skillData.usableCheckers" :key="i">
                        {{ p }}
                    </div>
                </div>
                <div class="processor-pane">
                    <div>CanUseParams</div>
                    <div v-for="(p, i) in activeRankData.canUseParams" :key="i">
                        {{ p }}
                    </div>
                </div>
            </div>
            <div class="state-effect-visual" v-if="activeRankData.stateEffectIds.length || activeRankData.stateEffectOtherIds.length">
                SEIDs {{ activeRankData.stateEffectIds.concat(activeRankData.stateEffectOtherIds).join(", ") }}
            </div>
            </template>
        </div>
    </div>
    <div class="error" v-if="skillDataLoader.error">
        <big-error-box
            :error-title="`Failed to load skill ${skillId}`"
            :error-content="skillDataLoader.error"
            :icon-class="'fa-exclamation-triangle'"
            :can-retry="true"
            v-on:retry="fetchData" />
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Loader from "@/components/util/Loader.vue";
import UiString from "@/components/uistring/UiString.vue";
import SpriteIcon from "@/components/util/SpriteIcon.vue";
import CopyLink from "@/components/util/CopyLink.vue";
import SkillEffect from "@/components/skill/SkillEffect.vue";
import BigErrorBox from "@/components/util/BigErrorBox.vue";
import SkillStubLink from "@/components/skill/SkillStubLink.vue";
import SkillUsable from "@/components/skill/SkillUsable.vue";

import LoadingErrorable from "@/models/util/LoadingErrorable";
import ISkill from '@/models/skills/ISkill';
import ISkillLevel from '@/models/skills/ISkillLevel';
import { SkillType } from '@/models/skills/SkillEnums';
import ITypedMap from '@/models/util/ITypedMap';

import SkillProvider from '@/api/SkillProvider';
import ISkillEffectValue from '@/models/skills/ISkillEffectValue';
import { axiosErrorToString } from '@/helpers/AxiosErrorUtils';
import { WeaponType } from '@/models/items/ItemEnums';

interface IData {
    skillId: number;
    skillDataLoader: LoadingErrorable<ISkill, any>;
    skillLevelPvEDataLoader: LoadingErrorable<ISkillLevel[], any>;
    skillLevelPvPDataLoader: LoadingErrorable<ISkillLevel[], any>;
    pvp: boolean;
    activeSkillRank: number;
    forceShowAllEffects: boolean;
}

export default Vue.extend({
    components: {
        BigErrorBox,
        CopyLink,
        Loader,
        SpriteIcon,
        UiString,
        SkillEffect,
        SkillStubLink,
        SkillUsable,
    },
    props: {
        "skillSlug": {
            type: String as () => string,
        },
    },
    data(): IData {
        return {
            skillId: 0,
            skillDataLoader: new LoadingErrorable(),
            skillLevelPvEDataLoader: new LoadingErrorable(),
            skillLevelPvPDataLoader: new LoadingErrorable(),
            pvp: false,
            activeSkillRank: 0,
            forceShowAllEffects: false,
        };
    },
    watch: {
        skillSlug() {
            this.extractDataFromUrl();
        },
        skillId() {
            this.fetchData();
        },
        activeSkillRank() {
            this.updateQueryParams();
        },
        pvp() {
            this.updateQueryParams();
        },
    },
    computed: {
        skillData(): ISkill|null {
            return this.skillDataLoader.value || null;
        },
        skillLevelDataLoader(): LoadingErrorable<ISkillLevel[], any> {
            return this.pvp ? this.skillLevelPvPDataLoader : this.skillLevelPvPDataLoader;  
        },
        skillLevelData(): ISkillLevel[] {
            return (this.pvp ? this.skillLevelPvPDataLoader.value : this.skillLevelPvEDataLoader.value) || [];
        },
        revSkillLevelData(): ISkillLevel[] {
            return (!this.pvp ? this.skillLevelPvPDataLoader.value : this.skillLevelPvEDataLoader.value) || [];
        },
        hasSkillIcon(): boolean {
            if (!this.skillData) {
                return false;
            }
            
            if (this.skillData.skillIcon.index == 0) {
                if (this.skillData.buffIcon && this.skillData.buffIcon.index >= 0) {
                    return false;
                }
                
                if (this.skillData.debuffIcon && this.skillData.debuffIcon.index >= 0) {
                    return false;
                }
            }

            return true;
        },
        activeRankData(): ISkillLevel|null {
            return this.skillLevelData.find((l) => l.level == this.activeSkillRank) || null;  
        },
        realMaxSkillLevel(): number {
            if (this.skillLevelData) {
                let r = Math.max(...this.skillLevelData.map((l) => l.level));
                if (!isFinite(r)) {
                    return NaN;
                }

                return r;
            }

            return NaN;
        },
        realMinSkillLevel(): number {
            if (this.skillLevelData) {
                return Math.min(...this.skillLevelData.map((l) => l.level));
            }

            return 1;
        },
        rankText(): string {
            if (this.skillData) {
                const techLvls = this.skillData.techLevels;
                const overLvls = this.activeSkillRank - this.skillData.spLevels;
                if (techLvls > 0 && overLvls > 0) {
                    return `${this.skillData.spLevels} (+${overLvls})`;
                }
            }

            return String(this.activeSkillRank);
        },
        slug(): string {
            if (this.skillData) {
                return SkillProvider.skillSlug(this.skillData);
            } else {
                return "";
            }
        },
        link(): string {
            let queries: any = {};
            queries = Object.assign(queries, this.$route.query);
            delete queries["embed"];
            queries.region = this.$store.state.regionCode;

            let url = window.location.origin + this.$route.path;

            let qString = Object.keys(queries).map(k => `${k}=${queries[k]}`).join("&");
            if (qString.length > 0) {
                url += "?" + qString;
            }

            return url;
        },
        SkillType(): any {
            return SkillType;
        },
        weapons(): string {
            if (this.skillData) {
                return this.skillData.requiredWeapons.map((v) => {
                    const n = WeaponType[v];
                    if (n) {
                        return n;
                    }

                    return `Weap ${v}`;
                }).join(", ");
            }

            return "";
        }
    },
    mounted() {
        this.extractDataFromUrl();
    },
    methods: {
        async fetchData() {
            if (this.skillId <= 0) {
                return;
            }

            this.skillDataLoader.startLoad();
            this.skillLevelPvEDataLoader.startLoad();
            this.skillLevelPvPDataLoader.startLoad();

            try {
                const skillDataRes = await SkillProvider.getSkill(this.skillId);
                this.skillDataLoader.done(skillDataRes);

                this.updateSlug();

                let shouldLoadPvpFirst = this.pvp;

                // console.log(`Loading ${shouldLoadPvpFirst ? "pvp" : "pve"} data`);
                const sl1 = await SkillProvider.getSkillLevels(this.skillId, shouldLoadPvpFirst);
                if (shouldLoadPvpFirst) {
                    this.skillLevelPvPDataLoader.done(sl1);
                } else {
                    this.skillLevelPvEDataLoader.done(sl1);
                }

                if (this.skillLevelData.length > 0) {
                    if (this.activeSkillRank == 0) {
                        this.activeSkillRank = this.skillLevelData[0].level;
                    }
                }

                // console.log(`Loading ${!shouldLoadPvpFirst ? "pvp" : "pve"} data`);
                const sl2 = await SkillProvider.getSkillLevels(this.skillId, !shouldLoadPvpFirst);
                if (!shouldLoadPvpFirst) {
                    this.skillLevelPvPDataLoader.done(sl2);
                } else {
                    this.skillLevelPvEDataLoader.done(sl2);
                }

                if (this.revSkillLevelData.length > 0) {
                    if (this.activeSkillRank == 0) {
                        this.activeSkillRank = this.revSkillLevelData[0].level;
                    }
                }

                const maxLvl = this.realMaxSkillLevel;
                if (this.activeSkillRank > maxLvl) {
                    this.activeSkillRank = maxLvl;
                }

                this.updateQueryParams();
            } catch (e) {
                this.skillDataLoader.failed(axiosErrorToString(e));
            }
        },

        extractDataFromUrl() {
            if (this.skillSlug) {
                const split = this.skillSlug.split("-", 2);
                const id = Number(split[0]);
                if (!isNaN(id)) {
                    this.skillId = id;
                }
            }

            const query = this.$route.query;
            if (query.pvp) {
                this.pvp = query.pvp === "1";
            }

            if (query.r) {
                const r = Number(query.r);
                if (!isNaN(r)) {
                    this.activeSkillRank = r;
                }
            }
        },

        effectValuesFor(index: number, rank: number): ISkillEffectValue|null {
            const rankData = this.skillLevelData.find((l) => l.level == rank) || null;
            if (!rankData) {
                return null;
            }

            return rankData.effectValues.find((e) => e.index == index) || null;
        },

        updateSlug() {
            if (this.slug != this.skillSlug) {
                this.$router.replace({
                    path: this.$route.path.replace(this.skillSlug, this.slug),
                    query: this.$route.query,
                });
            }
        },

        updateQueryParams() {
            if (this.skillLevelData == null) {
                return;
            }

            let query = Object.assign({}, this.$route.query);

            if (this.activeSkillRank <= this.realMinSkillLevel) {
                delete query.r;
            } else {
                query.r = String(this.activeSkillRank);
            }

            if (!this.pvp) {
                delete query.pvp;
            } else {
                query.pvp = "1";
            }

            this.$router.replace({
                path: this.$route.path,
                query: query,
            });
        },
        
        down() {
            if (this.activeSkillRank > this.realMinSkillLevel) {
                --this.activeSkillRank;
            }
        },

        up() {
            if (this.activeSkillRank < this.realMaxSkillLevel) {
                ++this.activeSkillRank;
            }
        }
        
    }

});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.skill-view {
    .result {
        .header {
            position: relative;
            width: 100%;
            .padding-left(0);
            padding-bottom: 0;
            display: flex;
            flex-direction: row;
            margin: 8px 0 10px 0;

            .icon{ 
                flex: 0 0 50px;
                vertical-align: middle;
                padding-top: 10px;

                // width: 50px;
                
                .centering {
                    position: absolute;
                    top: 50%;
                    transform: translate(0px, -50%);
                }

            }

            .title {
                flex: 1 1 auto;
                .margin-left(6px);
                .border-left(2px solid @dv-c-accent-1);
                .padding-left(12px);
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
                }

                .details {
                    white-space: nowrap;
                    color: @dv-c-accent-1;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-size: 12px;

                    & > div {
                        display: inline-block;
                        .margin-left(0.3em);

                        &:first-child {
                            .margin-left(0);
                        }
                    }

                    .job {
                        color: @dv-c-accent-2;

                        .class-icon {
                            transform: translate(0, 1px);
                            display: inline-block;
                        }
                    }
                }
            }
        }

        .weapons {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .skill-video {
            border: 1px solid @dv-c-accent-3;
            margin: 8px 20px;
            width: 320px;
            flex-basis: 320px;
            height: 240px;
            
            .placeholder {
                text-align: center;
                padding: 20px;
            }
        }

        .extends {
            .label {
                margin-bottom: 8px;
            }
        }

        .rank.page-section {
            .options {
                margin: 8px 0 16px 0;
            }

            .rank-view {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                .rank-level {
                    text-align: center;
                    text-transform: uppercase;
                    color: @dv-c-foreground;
                    font-size: 16px;
                    font-family: @dv-f-geomanist;
                    letter-spacing: 0.05em;
                    margin-bottom: 12px;
                }

                
                .entry {
                    line-height: 20px;

                    .key {
                        display: inline-block;
                        .margin-right(0.3em);
                        text-transform: uppercase;
                        font-family: @dv-f-geomanist;
                        font-size: 12px;
                        color: @dv-c-foreground;
                        vertical-align: middle;
                    }

                    .value {
                        display: inline-block;
                        vertical-align: middle;
                    }
                }

                .desc-pane {
                    @width: 250px;
                    flex: 0 0 @width;

                    border: 1px solid @dv-c-accent-1;
                    width: @width;
                    padding: 16px;
                }

                .effect-pane {
                    flex: 1 1;
                    .margin-left(8px);

                    .pane-header {
                        padding-top: 0;
                        .padding-left(10px);
                        margin-top: 0;
                    }

                    .effect-options {
                        .margin-left(8px);
                    }
                }

                .processor-pane {
                    .margin-right(12px);
                }
            }
        }
    }
}
</style>

