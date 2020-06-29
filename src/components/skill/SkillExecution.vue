<template>
<ul class="skill-exec">
    <li class="exec-entry" v-for="(proc, i) in procs"
        :key="i">
        {{ proc.desc }} <span class="raw">{{ proc.type }}: {{ proc.params }}</span>
    </li>
    <li class="exec-entry" v-if="procs.length == 0">
        No executors
    </li>
</ul>
</template>

<script lang="ts">
import Vue from 'vue'
import { SkillProcessor } from '../../models/skills/SkillEnums';

interface IProcessor {
    type: SkillProcessor;
    params: string[];
    desc?: string;
}

interface IData {
    procs: IProcessor[];
}

const processorMap: {[k: number /* SkillProcessor */]: (params: string[]) => string|Promise<string>} = {
    [SkillProcessor.DO_ACTION]: (params) => `Action '${params[0]}'`,
    [SkillProcessor.DO_LOOPING_ACTION]: (params) => `Looping action '${params[0]}', '${params[1]}', '${params[2]}' for ${Number(params[3]) / 1000}s` + (params[4] ? ` with ${params[4]} movement speed` : ''),
    [SkillProcessor.CHANGE_PROJECTILE]: async (params) => `Change projectile ${params[0]} to ${params[1]}`,
    [SkillProcessor.DIVIDED_STATE_EFFECT_ARG]: (params) => `Divide state effect ${params}`,
    [SkillProcessor.IMPACT_BLOW]: () => `Impact blow`,
    [SkillProcessor.AURA]: (params) => `Apply effect as an aura ${params[0]} units in radius`,
    [SkillProcessor.ADD_ACTION_SUFFIX]: (params) => `Add suffix '${params[0]}' to actions ${params.slice(1).map((s) => "'" + s + "'").join(', ')}`,
    [SkillProcessor.APPLY_RANGED_STATE_EFFECT]: (params) => `Apply state effect ${params[2]} for ${Number(params[3]) / 1000}s to targets within ${params[0]} units at a ${params[1]}% chance`,
    [SkillProcessor.MODIFY_ACTION_ON_BUBBLE_COUNT]: (params) => modifyOnBubbleCount(params),
    [SkillProcessor.MODIFY_STATE_EFFECT_ON_BUBBLE_COUNT]: (params) => `ModifyStateEffectOnBubbleCount ${params[0]}`,
    [SkillProcessor.SUMMON_DO_ACTION]: (params) => `SummonDoAction '${params[0]}'`,
    [SkillProcessor.CTC]: (params) => `Store up to ${params[0]} cooldown charges`,
    [SkillProcessor.UNKNOWN16]: (params) => `Looping action '${params[0]}', '${params[1]}', '${params[2]}' for ${Number(params[3]) / 1000}s` + (params[4] ? ` with ${params[4]} movement speed` : '') + ` on collision do ${params[5]} unk1 ${params[6]} unk2 ${params[7]}`,
    [SkillProcessor.MODIFY_ON_DIRECTION]: (params) => `If the ${params[0]} key is pressed, append _${params[0]} to the action name`,
    [SkillProcessor.MODIFY_ON_SUMMON_COUNT]: (params) => modifyOnMonsterCount(params),
};

function modifyOnBubbleCount(params: string[]): string {
    let ret: string[] = [];
    const split = params[0].split(';');
    for (let i = 0; i < split.length / 3; ++i) {
        const j = i * 3;
        const bubbleId = split[j];
        const bubbleCount = split[j + 1];
        const actionName = split[j + 2];
        const fragment = `At ${bubbleCount}x bubble ${bubbleId}, use action ${actionName}`;
        ret.push(fragment);
    }

    return ret.join('; ');
}


function modifyOnMonsterCount(params: string[]): string {
    let ret: string[] = [];
    const split = params[0].split(';');
    for (let i = 0; i < split.length / 3; ++i) {
        const j = i * 3;
        const monsterId = split[j];
        const monsterCount = split[j + 1];
        const actionName = split[j + 2];
        const fragment = `At ${monsterCount}x monster ${monsterId}, use action ${actionName}`;
        ret.push(fragment);
    }

    return ret.join('; ');
}
export default Vue.extend({
    props: {
        processors: {
            type: Array as () => number[],
        },
        processParams: {
            type: Array as () => string[],
        },
    },
    data(): IData {
        return {
            procs: [],
        };
    },
    watch: {
        async processors() {
            await this.evaluate();
        },
        async processParams() {
            await this.evaluate();
        },
    },
    async mounted() {
        await this.evaluate();
    },
    methods: {
        async evaluate() {
            this.procs = await this.calcProcs();
        },
        async calcProcs(): Promise<IProcessor[]> {
            const ret: IProcessor[] = [];
            let paramIdx = 0;
            for (let i = 0; i < this.processors.length; ++i) {
                const processorId = this.processors[i];
                if (processorId === SkillProcessor.NULL) {
                    continue;
                }

                switch (processorId) {
                    case SkillProcessor.DO_ACTION:
                    case SkillProcessor.AURA:
                    case SkillProcessor.DIVIDED_STATE_EFFECT_ARG:
                        const val = this.processParams[paramIdx++];
                        if (val != "0" && val) {
                            ret.push({
                                type: processorId,
                                params: [val],
                            });
                        }
                        break;
                    case SkillProcessor.CHANGE_PROJECTILE:
                        ret.push({
                            type: processorId,
                            params: [
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                            ],
                        });
                        break;
                    case SkillProcessor.APPLY_RANGED_STATE_EFFECT:
                        ret.push({
                            type: processorId,
                            params: [
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                            ],
                        });
                        break;
                    case SkillProcessor.DO_LOOPING_ACTION:
                        ret.push({
                            type: processorId,
                            params: [
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                            ],
                        });
                        break;
                    case SkillProcessor.UNKNOWN16:
                        ret.push({
                            type: processorId,
                            params: [
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                            ],
                        });
                        break;
                    case SkillProcessor.ADD_ACTION_SUFFIX:
                        const params: string[] = [];
                        for (; paramIdx < this.processParams.length; ++paramIdx) {
                            const v = this.processParams[paramIdx];
                            if (v == "0" || !v) {
                                --paramIdx;
                                break;
                            }

                            params.push(v);
                        }
                        ret.push({
                            type: processorId,
                            params,
                        });
                        break;
                    case SkillProcessor.APPLY_RANGED_STATE_EFFECT:
                        ret.push({
                            type: processorId,
                            params: [
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                                this.processParams[paramIdx++],
                            ],
                        });
                        break;
                    case SkillProcessor.CTC:
                    case SkillProcessor.MODIFY_ON_DIRECTION:
                    case SkillProcessor.MODIFY_ON_SUMMON_COUNT:
                    case SkillProcessor.MODIFY_ACTION_ON_BUBBLE_COUNT:
                    case SkillProcessor.MODIFY_STATE_EFFECT_ON_BUBBLE_COUNT:
                    case SkillProcessor.IMPACT_BLOW:
                    case SkillProcessor.SUMMON_DO_ACTION:
                        ret.push({
                            type: processorId,
                            params: [
                                this.processParams[paramIdx++],
                            ],
                        });
                        break;
                }
            }

            for (let v of ret) {
                const res = (processorMap[v.type] && processorMap[v.type](v.params)) || `Unk${v.type} ${v.params[0]}`;
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
        },
    }
})
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.skill-exec {
    margin: 4px 0;
    .padding-left(20px);

    .exec-entry {
        position: relative;
        max-width: 500px;
        .raw {
            pointer-events: none;
            position: absolute;
            left: 100%;
            top: 0;
            color: transparent;
            transition: color 0.125s ease-in;
            // white-space: nowrap;
            max-width: 200px;
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
