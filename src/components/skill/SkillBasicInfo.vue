<template>

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
</template>

<script lang="ts">
import Vue from 'vue';
import SpriteIcon from "@/components/util/SpriteIcon.vue";
import SkillStubLink from "@/components/skill/SkillStubLink.vue";
import ISkill from '../../models/skills/ISkill';
import ISkillLevel from '../../models/skills/ISkillLevel';
import { WeaponType } from '../../models/items/ItemEnums';
import { SkillType } from '../../models/skills/SkillEnums';
export default Vue.extend({
    components: {
        SkillStubLink,
        SpriteIcon,
    },
    props: {
        skillData: {
            type: Object as () => ISkill,
        },
        skillLevelData: {
            type: Array as () => ISkillLevel[],
        },
    },
    computed: {
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
        SkillType(): typeof SkillType {
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
    }
})
</script>
