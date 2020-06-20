<template>
<transition name="fade-fast" mode="out-in">
<div class="skill-view" :key="skillId">
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
                    <span class="id">#<div class="inline-select">{{ this.skillId }}</div> / {{ this.skillData.ownerTable }}</span>
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

        <skill-basic-info
            :skillData="skillData"
            :skillLevelData="skillLevelData" />

        <div class="rank page-section">
            <div class="title">Skill Rank Info</div>

            <div class="warn toast">
                <div class="content">
                    <div class="heading">*Beeping truck noises*</div>
                    This section is highly experimental and obviously not complete. Pardon the layout and bugs!
                    <br/>Some information may be incomplete or incorrect.
                </div>
            </div>

            <div class="options">
                <div class="checkbox">
                    <input id="pvp" type="checkbox" v-model="pvp" />
                    <label for="pvp">Display PvP Info</label>
                </div>
            </div>

            <div class="rank-select">
                <!-- todo select rank -->
                <div class="tooltip">
                    <button v-on:click="down" :disabled="activeSkillRank === realMinSkillLevel">-</button>
                    <div class="tooltext" v-if="activeSkillRank !== realMinSkillLevel">Hold SHIFT while clicking to jump to {{ realMinSkillLevel }}</div>
                </div>
                <input type="number" :max="realMaxSkillLevel" :min="1" v-model.number="pendingSkillRank" />
                <div class="tooltip">
                    <button v-on:click="up" :disabled="activeSkillRank === realMaxSkillLevel">+</button>
                    <div class="tooltext" v-if="activeSkillRank !== realMaxSkillLevel">{{ upTooltipText }}</div>
                </div>
            </div>

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
                        <div class="entry" v-if="skillData.globalCooldownPvE > 0 && !pvp">
                            <div class="key">Shared Cooldown: </div>
                            <div class="value">
                                {{ skillData.globalCooldownPvE | milliseconds }}s (G {{ skillData.globalSkillGroupId }})
                            </div>
                        </div>
                        <div class="entry" v-if="skillData.globalCooldownPvP > 0 && pvp">
                            <div class="key">Shared Cooldown: </div>
                            <div class="value">
                                {{ skillData.globalCooldownPvP | milliseconds }}s (G {{ skillData.globalSkillGroupId }})
                            </div>
                        </div>
                        <div class="entry" v-if="activeRankData.requiredLevel > 0">
                            <div class="key">Required Level: </div>
                            <div class="value">
                                Lv {{ activeRankData.requiredLevel }}
                            </div>
                        </div>
                        <div class="entry" v-if="activeRankData.needHp > 0 || activeRankData.hpConsumeType > 0">
                            <div class="key">HP cost: </div>
                            <div class="value">
                                <template v-if="activeRankData.hpConsumeType > 0">
                                    {{ activeRankData.hpConsumeType | statPercent }}
                                </template>
                                <template v-else>
                                    {{ activeRankData.needHp | thousands }}
                                </template>
                            </div>
                        </div>
                        <div class="entry" v-if="activeRankData.needSp > 0">
                            <div class="key">Mana cost: </div>
                            <div class="value">
                                {{ activeRankData.needSp | thousands }}
                            </div>
                        </div>
                        <div class="entry" v-if="activeRankData.addThreat > 0">
                            <div class="key">Additional Threat: </div>
                            <div class="value">
                                {{ activeRankData.addThreat | thousands }}
                            </div>
                        </div>
                        <div class="entry" v-if="activeRankData.heroPoints">
                            <div class="key">Hero points: </div>
                            <div class="value">
                                {{ activeRankData.heroPoints | thousands }}
                            </div>
                        </div>
                        <ui-string :message-data="activeRankData.skillDesc" :params="activeRankData.skillDescParam" :format="'html'" />
                        
                        <div class="entry" v-if="activeRankData.pdmgBoardDamage > 0">
                            <div class="key">Internal PDMG: </div>
                            <div class="value">
                                {{ (activeRankData.pdmgBoardDamage + 1) | statPercent }}
                            </div>
                        </div>
                        <div class="entry" v-if="activeRankData.mdmgBoardDamage > 0">
                            <div class="key">Internal MDMG: </div>
                            <div class="value">
                                {{ (activeRankData.mdmgBoardDamage + 1) | statPercent }}
                            </div>
                        </div>
                        <div class="entry">
                            <div class="key">SLTID: </div>
                            <div class="value">
                                {{ activeRankData.id }}
                            </div>
                        </div>
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
                            <skill-effect
                                :effect="effect"
                                :value="effectValuesFor(effect.index, activeSkillRank)"
                                :activeRankData="activeRankData"
                                :forceShow="forceShowAllEffects" />
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
                    <div class="processor-pane">
                        <h4 class="pane-header">Skill Processors</h4>
                        <skill-execution
                            :processors="skillData.processors"
                            :processParams="activeRankData.processParams"/>
                    </div>
                </div>
                <div class="state-effect-visual">
                    <div class="se-section" v-if="activeRankData.stateEffectIds.length">
                        <h4 class="pane-header">Self State VFX</h4>
                        <state-effect
                            v-for="(seid, i) of activeRankData.stateEffectIds"
                            :key="i"
                            :stateEffectId="seid"
                        />
                    </div>
                    <div class="se-section" v-if="activeRankData.stateEffectOtherIds.length">
                        <h4 class="pane-header">Target State VFX</h4>
                        <state-effect
                            v-for="(seid, i) of activeRankData.stateEffectOtherIds"
                            :key="i"
                            :stateEffectId="seid"
                        />
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="warn toast">
                    <div class="content">
                        Skill not available in {{ pvp ? 'PvP' : 'PvE'}}
                    </div>
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
</transition>
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
import SkillExecution from "@/components/skill/SkillExecution.vue";
import SkillBasicInfo from "@/components/skill/SkillBasicInfo.vue";
import StateEffect from './StateEffect.vue';

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
    activeRankData: ISkillLevel|null;
    
    pendingSkillRank: number;
}

export default Vue.extend({
    components: {
        BigErrorBox,
        CopyLink,
        Loader,
        SpriteIcon,
        UiString,
        SkillBasicInfo,
        SkillEffect,
        SkillStubLink,
        SkillUsable,
        SkillExecution,
        StateEffect,
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
            activeRankData: null,
            pendingSkillRank: 0,
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
            this.setCurrentSkillLevelData();
            this.updateQueryParams();
            this.pendingSkillRank = this.activeSkillRank;
        },
        pendingSkillRank() {
            const n = Number(this.pendingSkillRank);
            if (!isNaN(n) && n > 0 && n <= this.realMaxSkillLevel) {
                this.activeSkillRank = n;
            }
        },
        pvp() {
            this.setCurrentSkillLevelData();
            this.$nextTick().then(() => this.updateQueryParams());
        },
    },
    computed: {
        skillData(): ISkill|null {
            return this.skillDataLoader.value || null;
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
        maxNonTechLevel(): number {
            return this.skillData && this.skillData.spLevels || 0;
        },
        upTooltipText(): string {
            if (this.activeSkillRank >= this.maxNonTechLevel) {
                if (this.skillData) {
                    const techLvls = this.skillData.techLevels;
                    const overLvls = this.realMaxSkillLevel - this.skillData.spLevels;
                    if (techLvls > 0 && overLvls > 0) {
                        return `Hold SHIFT while clicking to jump to ${this.realMaxSkillLevel} (+${overLvls})`;
                    }
                }
            }
            
            return `Hold SHIFT while clicking to jump to ${this.maxNonTechLevel}`;
        },
        rankText(): string {
            if (this.skillData) {
                const techLvls = this.skillData.techLevels;
                const overLvls = this.activeSkillRank - this.skillData.spLevels;
                if (techLvls > 0 && overLvls > 0) {
                    return `${this.activeSkillRank} (+${overLvls})`;
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
        },
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

                this.setCurrentSkillLevelData();
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
        
        setCurrentSkillLevelData() {
            const skillLevelData = (this.pvp ? this.skillLevelPvPDataLoader.value : this.skillLevelPvEDataLoader.value) || [];
            // console.log(this.pvp, skillLevelData);
            this.activeRankData = skillLevelData.find((l) => l.level == this.activeSkillRank) || null;
        },

        down(evt: MouseEvent) {
            if (evt.shiftKey) {
                this.activeSkillRank = this.realMinSkillLevel;
            } else if (this.activeSkillRank > this.realMinSkillLevel) {
                --this.activeSkillRank;
            }
        },

        up(evt: MouseEvent) {
            if (evt.shiftKey) {
                if (this.activeSkillRank >= this.maxNonTechLevel) {
                    this.activeSkillRank = this.realMaxSkillLevel;
                } else {
                    this.activeSkillRank = this.maxNonTechLevel;
                }
            } else if (this.activeSkillRank < this.realMaxSkillLevel) {
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
            
            .rank-select {
                
                input[type="number"] {
                    background: none;
                    color: @dv-c-foreground;
                    font-size: 14px;
                    font-family: @dv-f-geomanist;
                    width: 40px;
                    padding: 10px;
                    text-align: center;
                    border: 1px @dv-c-idle solid;
                    transition: border-color ease-in 0.125s;
                    margin: 0 2px;

                    &:hover,
                    &:focus {
                        border-color: @dv-c-foreground;
                    }
                }
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
                    .margin-right(24px);
                }
            }
        }
    }
}
</style>

