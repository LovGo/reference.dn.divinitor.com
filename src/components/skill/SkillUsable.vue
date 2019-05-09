<template>
<div class="skill-usable">
    <div class="usable-entry" v-for="(checker, i) in checkers"
        :key="i">
        {{ checker }}
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SkillUsableChecker } from '../../models/skills/SkillEnums';

interface IChecker {
    type: SkillUsableChecker;
    params: string[];
}

export default Vue.extend({
    props: {
        usableCheckers: {
            type: Array as () => SkillUsableChecker[],
        },
        canUseParams: {
            type: Array as () => string[],
        },
    },
    computed: {
        checkers(): IChecker[] {
            const ret: IChecker[] = [];
            let paramIdx = 0;
            for (let i = 0; i < this.usableCheckers.length; ++i) {
                const checker = this.usableCheckers[i];
                switch (checker) {
                    case SkillUsableChecker.CAN_MOVE:
                    case SkillUsableChecker.CAN_JUMP:
                    case SkillUsableChecker.IS_HIT:
                    case SkillUsableChecker.ENERGY_CHARGE:
                    case SkillUsableChecker.CAN_GROUND_MOVE:
                    case SkillUsableChecker.TARGET_IN_RANGE:
                        ret.push({
                            type: checker,
                            params: [],
                        });
                        break;
                    case SkillUsableChecker.PROBABILITY:
                    case SkillUsableChecker.TOGGLE_IS_ACTIVE:
                    case SkillUsableChecker.SUMMON_IN_RANGE:
                        ret.push({
                            type: checker,
                            params: [this.canUseParams[paramIdx++]],
                        });
                        break;
                    case SkillUsableChecker.CASTER_STATE:
                    case SkillUsableChecker.HAS_HP:
                    case SkillUsableChecker.TARGET_STATE_EFFECT:
                        ret.push({
                            type: checker,
                            params: [this.canUseParams[paramIdx++], this.canUseParams[paramIdx++]],
                        });
                        break;
                    case SkillUsableChecker.NULL:
                    default:
                        continue;
                }
            }

            return ret;
        }
    }
})
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.skill-usable {

}
</style>

