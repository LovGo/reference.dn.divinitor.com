<template>
<ul class="skill-usable">
    <li class="usable-entry" v-for="(checker, i) in checkers"
        :key="i">
        {{ checker.desc }} <span class="raw">{{ checker.type }}: {{ checker.params }}</span>
    </li>
    <li class="usable-entry" v-if="checkers.length == 0">
        No constraints
    </li>
</ul>
</template>

<script lang="ts">
import Vue from 'vue'
import { SkillUsableChecker } from '../../models/skills/SkillEnums';

interface IChecker {
    type: SkillUsableChecker;
    params: string[];
    desc?: string;
}

function op2Str(op: string): string {
    switch (op) {
        case "<": return "less than";
        case "":
        case "==": return "equal to";
        case "!=": return "not equal to";
        case ">": return "greater than";
        case "<=": return "at most";
        case ">=": return "at least";
        case "&": return "is";
        case "!&": return "is not";
        default: return op;
    }
}

const checkerMap: {[k: number /* SKillUsableChecker */]: (params: string[]) => string|Promise<string>} = {
    [SkillUsableChecker.CASTER_STATE]: (params) => `User's current action ${op2Str(params[1])} '${params[0]}'`,
    [SkillUsableChecker.HAS_HP]: (params) => `User's current HP ${op2Str(params[1])} ${params[0]}%`,
    [SkillUsableChecker.PROBABILITY]: (params) => `Random chance at ${params[0]}%`,
    [SkillUsableChecker.TARGET_STATE]: (params) => `Target is within ${params[2]} units and its current action ${op2Str(params[1])} '${params[0]}' `,
    [SkillUsableChecker.CAN_MOVE]: () => `User can move`,
    [SkillUsableChecker.CAN_JUMP]: () => `User can jump`,
    [SkillUsableChecker.IS_HIT]: () => `User is hit`,
    [SkillUsableChecker.TOGGLE_IS_ACTIVE]: async (params): Promise<string> => `Toggle skill ${params[0]} is active`, // todo
    [SkillUsableChecker.ENERGY_CHARGE]: (params) => `Energy charge ${params}`,
    [SkillUsableChecker.CAN_GROUND_MOVE]: () => `User can walk`,
    [SkillUsableChecker.TARGET_IN_RANGE]: (params) => `Target is in range ${params}`,
    [SkillUsableChecker.HAS_BUBBLES]: async (params): Promise<string> => `User has at least ${params[1]}x bubble ${params[0]}`, // todo
    [SkillUsableChecker.SUMMON_IN_RANGE]: (params) => `Summon ${params} is in range`,
    [SkillUsableChecker.TARGET_STATE_EFFECT]: async (params) => `Target has state effect ${params}`,
};

interface IData {
    checkers: IChecker[];
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
    data(): IData {
        return {
            checkers: [],
        };
    },
    watch: {
        async usableCheckers() {
            await this.evaluate();
        },
        async canUseParams() {
            await this.evaluate();
        },
    },
    async mounted() {
        await this.evaluate();
    },
    methods: {
        async evaluate() {
            this.checkers = await this.calcCheckers();  
        },
        async calcCheckers(): Promise<IChecker[]> {
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
                    case SkillUsableChecker.HAS_BUBBLES:
                    case SkillUsableChecker.TARGET_STATE_EFFECT:
                        ret.push({
                            type: checker,
                            params: [this.canUseParams[paramIdx++], this.canUseParams[paramIdx++]],
                        });
                        break;
                    case SkillUsableChecker.TARGET_STATE:
                        ret.push({
                            type: checker,
                            params: [this.canUseParams[paramIdx++], this.canUseParams[paramIdx++], this.canUseParams[paramIdx++]],
                        });
                        break;
                    case SkillUsableChecker.NULL:
                    default:
                        continue;
                }
            }

            for (let v of ret) {
                const res = (checkerMap[v.type] && checkerMap[v.type](v.params)) || '';
                let resStr = '';
                if (typeof res === 'string') {
                    resStr = res;
                } else {
                    resStr = await (res as Promise<string>);
                }

                v.desc = resStr;
                v.params = v.params.filter(p => p != null);
            };

            return ret;
        }
    }
})
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.skill-usable {
    margin: 4px 0;
    .padding-left(20px);

    .usable-entry {
        position: relative;
        .raw {
            pointer-events: none;
            position: absolute;
            top: 0;
            left: 100%;
            color: transparent;
            transition: color 0.125s ease-in;
            white-space: nowrap;
            padding: 4px 12px 6px 12px;
            z-index: 100;

            &::before {
                content: "Raw: ";
                text-transform: uppercase;
                font-size: 12px;
            }
        }

        &:hover .raw {
            color: @dv-c-accent-2;
            background: fade(@dv-c-background, 95%);
        }
    }
}
</style>

