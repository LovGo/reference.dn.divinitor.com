<template>
<div class="skill-stub-tooltip" :show="show"
    :type="skillTypeToString(skillData.skillType)">
    <div class="skill-name">
            <div class="skill-icon">
                <sprite-icon v-if="skillData.skillIcon.index == 0 && skillData.buffIcon && skillData.buffIcon.index != 0" 
                    :icon-info="skillData.buffIcon"/>
                <sprite-icon v-else-if="skillData.skillIcon.index == 0 && skillData.debuffIcon && skillData.debuffIcon.index != 0" 
                    :icon-info="skillData.debuffIcon"/>
                <sprite-icon v-else :icon-info="skillData.skillIcon" />
            </div>
            {{ skillData.name.message }}
        </div>
    
    <div class="info-list">
        <div class="job entry" v-if="skillData.requiredJob">
            <div class="key">Class: </div>
            <div class="value">
                <div class="class-icon">
                    <sprite-icon :icon-info="skillData.requiredJob.icon" :size-override="16"/>
                </div>
                {{ skillData.requiredJob.name.message }}
            </div>
        </div>
        <div class="entry">
            <div class="key">Skill type: </div>
            <div class="value">
                <div v-if="skillData.skillType == SkillType.ACTIVE">
                    Active
                </div>
                <div v-else-if="skillData.skillType == SkillType.PASSIVE">
                    Passive
                </div>
                <div v-else-if="skillData.skillType == SkillType.AUTOMATIC_PASSIVE">
                    Auto-triggered Passive
                </div>
                <div v-else-if="skillData.skillType == SkillType.EX_PASSIVE">
                    Enhancement
                </div>
                <div v-else-if="skillData.skillType == SkillType.AUTOMATIC_ACTIVATION">
                    Automatically Used
                </div>
            </div>
        </div>
        <div class="entry">
            <div class="key">Apply Type: </div>
            <div class="value">
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
            </div>
        </div>
        <div class="entry">
            <div class="key">Target: </div>
            <div class="value">
                <!-- {{ targets }} -->
                <span v-if="skillData.targetTypeStr == 'SELF'">Caster</span>
                <span v-else-if="skillData.targetTypeStr == 'ENEMY'">Enemy</span>
                <span v-else-if="skillData.targetTypeStr == 'ALLIED'">Friendly units</span>
                <span v-else-if="skillData.targetTypeStr == 'PARTY_MEMBERS'">Party players</span>
                <span v-else-if="skillData.targetTypeStr == 'ALL'">All</span>
            </div>
        </div>
        <div class="element entry" v-if="skillData.element != -1">
            <div class="key">Element: </div>
            <div class="value">
                    <div class="fire" v-if="skillData.elementStr == 'FIRE'"><i class="fa fa-fire"></i> Fire</div>
                    <div class="ice" v-if="skillData.elementStr == 'WATER'"><i class="fa fa-snowflake-o"></i> Ice</div>
                    <div class="light" v-if="skillData.elementStr == 'LIGHT'"><i class="fa fa-bolt"></i> Light</div>
                    <div class="dark" v-if="skillData.elementStr == 'DARK'"><i class="fa fa-adjust"></i> Dark</div>
            </div>
        </div>
        <!-- <div class="entry" v-if="skillData.requiredWeapons.length > 0">
            <div class="key">Weapon: </div>
            <div class="value">
                {{ skillData.requiredWeapons }}
            </div>
        </div> -->
        
        <div class="entry">
            <div class="key">Max skill rank: </div>
            <div class="value">
                {{ skillData.spLevels }}<span v-if="skillData.techLevels > 0"> (can tech +{{skillData.techLevels}})</span>
            </div>
        </div>
        <div class="entry" v-if="skillData.globalCooldownPvE">
            <div class="key">Shared cooldown: </div>
            <div class="value">
                {{ skillData.globalCooldownPvE | milliseconds }}s
            </div>
        </div>
        <div class="buff entry" v-if="skillData.buffIcon && skillData.buffIcon.index != -1">
            <div class="key">Buff Icon: </div>
            <div class="value">
                <sprite-icon :icon-info="skillData.buffIcon"/>
            </div>
        </div>
        <div class="debuff entry" v-if="skillData.debuffIcon && skillData.debuffIcon.index != -1">
            <div class="key">Debuff Icon: </div>
            <div class="value">
                <sprite-icon :icon-info="skillData.debuffIcon"/>
            </div>
        </div>

        <template v-if="firstLevel">
        <div class="entry" v-if="firstLevel.requiredLevel > 1">
            <div class="key">Learned: </div>
            <div class="value">
                Lv {{ firstLevel.requiredLevel }}
            </div>
        </div>
        <div class="at-level">
            At rank {{ maxLevel.level }}
        </div>

        <div class="entry" v-if="maxLevel.cooldown > 0">
            <div class="key">Cooldown: </div>
            <div class="value">
                {{ maxLevel.cooldown | milliseconds }}s
            </div>
        </div>

        <div class="desc">
            <div v-html="maxLevel.skillDesc.message"></div>
        </div>

        <!-- <template v-if="maxLevel.pdmgBoardDamage != maxLevel.mdmgBoardDamage">
        <div class="entry">
            <div class="key">Physical Board damage: </div>
            <div class="value">
                {{ maxLevel.pdmgBoardDamage | skillBoardDamage }}%
            </div>
        </div>
        <div class="entry">
            <div class="key">Magic Board damage: </div>
            <div class="value">
                {{ maxLevel.mdmgBoardDamage | skillBoardDamage }}%
            </div>
        </div>
        </template>
        <div class="entry" v-else-if="maxLevel.pdmgBoardDamage != 1">
            <div class="key">Board damage: </div>
            <div class="value">
                {{ maxLevel.pdmgBoardDamage | skillBoardDamage }}%
            </div>
        </div> -->

        </template>
        <div class="error" v-else-if="fetched">
            Failed to load skill data
        </div>
        <div class="loading" v-else>
            <div class="loading-blinker" /> Loading skill data...
        </div>
        <template v-if="false">
        <div class="entry">
            <div class="key">Template: </div>
            <div class="value">
                Value
            </div>
        </div>
        </template>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import SpriteIcon from "@/components/util/SpriteIcon.vue";
import ISkill from '@/models/skills/ISkill';
import ISkillLevel from '@/models/skills/ISkillLevel';
import SkillProvider from '@/api/SkillProvider';
import { SkillType } from '@/models/skills/SkillEnums';
import ITypedMap from '@/models/util/ITypedMap';
import { filters } from '@/filters/Filters';

interface IData {
    skillLevelData: ISkillLevel[];
    fetched: boolean;
}

export default Vue.extend({
    components: {
        SpriteIcon,
    },
    props: {
        "skillData": {
            type: Object as () => ISkill,
        },
        "show": {
            type: Boolean as () => boolean,
        },
    },
    data(): IData {
        return {
            skillLevelData: [],
            fetched: false,
        };
    },
    watch: {
        show(to: boolean, from: boolean) {
            if (to == from) {
                return;
            }

            if (to) {
                if (!this.fetched) {
                    this.fetchData();
                }

                this.$anime({
                    targets: ".skill-stub-tooltip",
                    opacity: "1.0",
                });
            } else {
                this.$anime({
                    targets: ".skill-stub-tooltip",
                    opacity: "0.0",
                });
            }
        },
        skillData() {
            this.fetched = false;
            this.skillLevelData = [];
        }
    },
    computed: {
        SkillType(): any {
            return SkillType;
        },
        firstLevel(): ISkillLevel|null {
            return this.skillLevelData.find((l) => l.level == 1) || this.skillLevelData.length > 0 ? this.skillLevelData[0] : null;
        },
        maxLevel(): ISkillLevel|null {
            return this.skillLevelData.find((l) => l.level == this.skillData.spLevels) || this.firstLevel;
        },
        // targets(): string {
        //     const effects = Object.keys(this.skillData.effects.map((e) => {
        //         let ret: ITypedMap<boolean> = {};
        //         ret[e.effectApplyTypeStr] = true;
        //         return ret;
        //     }).reduce((prev, curr) => Object.assign(prev, curr), {}));

        //     return effects.join(", ");
        // }
    },
    mounted() {
        if (this.show) {
            this.fetchData();
        }
    },
    methods: {
        async fetchData() {
            this.skillLevelData = [];
            this.skillLevelData.push(...(await SkillProvider.getSkillLevels(this.skillData.id)));
            this.fetched = true;
        },
        skillTypeToString(type: SkillType): string {
            return filters.skillType(type);
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.skill-stub-tooltip {
    display: none;

    pointer-events: none;

    padding: 10px;
    border: 1px solid @rank-divine;
    background: @dv-c-background;

    &[type="active"] {
        border-color: @dv-c-foreground;
        .skill-name {
            color: @dv-c-foreground;
        }
    }

    &[type="enhancement"],
    &[type="enhancement"] {
        border-color: @rank-unique;
        .skill-name {
            color: @rank-unique;
        }
    }

    z-index: 100;
    width: 200px;

    font-size: 14px;
    color: @dv-c-body;

    box-shadow: 0 0 20px fade(black, 80%);

    &[show] {
        display: block;
    }

    .skill-name {
        font-size: 14px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-family: @dv-f-geomanist;
        color: @rank-divine;
        margin-bottom: 8px;
    }

    .info-list {
        
        .entry {
            line-height: 20px;

            .key {
                display: inline-block;
                .margin-right(0.3em);
                text-transform: uppercase;
                font-family: @dv-f-geomanist;
                font-size: 12px;
                color: @dv-c-accent-2;
                vertical-align: middle;
            }

            .value {
                display: inline-block;
                vertical-align: middle;
            }

            &.job {
                .class-icon {
                    display: inline-block;
                }
            }
        }

        .at-level {
            text-align: center;
            text-transform: uppercase;
            color: @dv-c-foreground;
            font-size: 12px;
            font-family: @dv-f-geomanist;
            letter-spacing: 0.05em;
            margin-top: 8px;
            margin-bottom: 2px;
        }
    }

    .loading {
        margin: 8px 0 0 0;
        padding: 4px 0 10px 0;
        font-size: 12px;
        // text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-family: @dv-f-geomanist;
        color: @dv-c-idle;
    }

    .error {
        margin: 8px 0 0 0;
        background: fade(lighten(@dv-c-red, -30%), 50%);
        color: lighten(desaturate(@dv-c-red, 50%), 30%);
        padding: 4px 0;
        font-size: 12px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-family: @dv-f-geomanist;
    }
}

</style>
