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
};

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
                            params: [this.processParams[paramIdx++], this.processParams[paramIdx++]],
                        });
                        break;
                    case SkillProcessor.APPLY_RANGED_STATE_EFFECT:
                        ret.push({
                            type: processorId,
                            params: [this.processParams[paramIdx++], this.processParams[paramIdx++], this.processParams[paramIdx++], this.processParams[paramIdx++]],
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
                                this.processParams[paramIdx++]
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
                }
            }

            for (let v of ret) {
                const res = (processorMap[v.type] && processorMap[v.type](v.params)) || '';
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
        max-width: 300px;
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
