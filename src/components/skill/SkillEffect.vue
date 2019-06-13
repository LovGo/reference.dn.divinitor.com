<template>
<div class="skill-effect" v-if="display">
    <div class="index">
        {{ effect.index }}
    </div>
    <div class="effect-id">
        {{ effect.effectClass }}
    </div>
    <div class="effect-name">
        {{ effectName }}
    </div>
    <div class="effect-target">
        <span class="key">Applies to </span>
        <span class="value" v-if="effect.effectApplyTypeStr == 'SELF'">caster</span>
        <span class="value" v-else-if="effect.effectApplyTypeStr == 'TARGETED_ACTOR'">target(s)</span>
        <span class="value" v-else-if="effect.effectApplyTypeStr == 'ALL'">all affected</span>
        <span class="value" v-else-if="effect.effectApplyTypeStr == 'ENEMY'">enemies</span>
        <span class="value" v-else-if="effect.effectApplyTypeStr == 'ALLY'">allies</span>
    </div>
    <div class="describe">
        {{ description }} <span class="raw">"{{ value.value }}"</span>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import ISkillEffect from '@/models/skills/ISkillEffect';
import ISkillEffectValue from '@/models/skills/ISkillEffectValue';
import { Blows } from "@/models/skills/IStateBlow";
import { filters } from '@/filters/Filters';
import ISkillLevel from '../../models/skills/ISkillLevel';

interface IData {
    description: string;
}

export default Vue.extend({
    props: {
        "effect": {
            type: Object as () => ISkillEffect,
        },
        "value": {
            type: Object as () => ISkillEffectValue,
        },
        "forceShow": {
            type: Boolean as () => boolean,
        },
        "activeRankData": {
            type: Object as () => ISkillLevel,
        },
    },
    data(): IData {
        return {
            description: "Loading...",
        };
    },
    watch: {
        effect() {
            this.getDescription().then((v) => this.description = v);
        },
        value() {
            this.getDescription().then((v) => this.description = v);
        },
    },
    computed: {
        effectName(): string {
            let effectClass = this.effect.effectClass;
            let suffix = "";
            // if (effectClass === 0) {
            //     if (this.effect.index === 1 && this.activeRankData.pdmgBoardDamage != 0) {
            //         effectClass = 2;
            //         suffix = " (Slot 0)";
            //     } else if (this.effect.index === 2 && this.activeRankData.mdmgBoardDamage != 0) {
            //         effectClass = 29;
            //         suffix = " (Slot 1)";
            //     }
            // }

            const blows = Blows[effectClass];
            if (blows) {
                return blows.name + suffix;
            }

            return "";
        },
        display(): boolean {
            // Slot 0 and slot 1 are used for PDMG and MDMG if effectClass is zero
            // if (this.effect.effectClass === 0) {
            //     if (this.effect.index <= 2) {
            //         return !!this.value.value && this.value.value !== '0';
            //     }
            // }

            return this.forceShow || !(this.effect.effectClass == 0 && (!!this.value.value || this.value.value == ''));
        },
    },
    mounted() {
        this.getDescription().then((v) => this.description = v);
    },
    methods: {
        async getDescription(): Promise<string> {
            let effectClass = this.effect.effectClass;
            // if (effectClass === 0) {
            //     if (this.effect.index === 1 && this.activeRankData.pdmgBoardDamage != 0) {
            //         effectClass = 2;
            //     } else if (this.effect.index === 2 && this.activeRankData.mdmgBoardDamage != 0) {
            //         effectClass = 29;
            //     }
            // }

            const blow = Blows[effectClass];
            if (blow) {
                if (blow.describe) {
                    let desc = blow.describe(this.effect, this.value);
                    if (typeof desc === "string") {
                        return desc;
                    } else if (desc == null) {
                        return "";
                    } else {
                        desc = await desc;

                        if (desc == null) {
                            return "";
                        }

                        let ret = desc.text;
                        if (desc.appendDuration && this.value && this.value.duration) {
                            ret += ` for ${filters.milliseconds(this.value.duration)}s`;
                        }

                        return ret;
                    }
                } else {
                    let ret = blow.name;
                    if (this.value) {
                        ret += `: ${this.value.value} for ${filters.milliseconds(this.value.duration)}s`;
                    }

                    return ret;
                }
            } else {
                let ret = `Effect ${this.effect.effectClass}`;
                if (this.value) {
                    ret += `: ${this.value.value} for ${filters.milliseconds(this.value.duration)}s`;
                }

                return ret;
            }
        },
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.skill-effect {
    position: relative;
    padding: 10px;
    padding-top: 14px;
    
    max-width: 330px;

    @media @wide-desktop {
        max-width: 700px;
    }

    .index {
        position: absolute;
        top: 0;
        .right(0);
        font-size: 8px;
        color: @dv-c-idle;
    }

    .effect-id {
        position: absolute;
        top: 2px;
        font-size: 12px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        white-space: nowrap;
        color: @dv-c-idle;
        font-family: @dv-f-geomanist;

        &::before {
            content: "Effect";
            letter-spacing: 0.1em;
        }
    }

    .effect-name {
        font-size: 18px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        // white-space: nowrap;
        font-family: @dv-f-geomanist;
        color: @dv-c-foreground;
    }

    .effect-target {
        font-size: 14px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        white-space: nowrap;
        font-family: @dv-f-geomanist;

        .key {
            color: @dv-c-accent-1;
        }

        .value {
            color: @dv-c-accent-2;
        }
    }

    .describe {
        margin: 8px 0;

        .raw {
            color: transparent;
            transition: color 0.125s ease-in;

            &::before {
                content: "Parameter: ";
                text-transform: uppercase;
                font-size: 12px;
                padding-left: 10px;
            }
        }

        &:hover .raw {
            color: @dv-c-accent-2;
        }
    }
}

</style>
