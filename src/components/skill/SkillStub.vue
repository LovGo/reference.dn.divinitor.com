<template>
<div class="skill-stub" :fill="fill"
    @mouseenter="onHoverIn" @mouseleave="onHoverOut"
    ref="stubRoot">
    <div class="info" v-if="skill.isSuccess() && skill.value"
            :type="skillTypeToString(skill.value.skillType)">
        <div class="icon">
            <div class="skill-icon">
                <sprite-icon v-if="skill.value.skillIcon.index == 0 && skill.value.buffIcon && skill.value.buffIcon.index != 0" 
                    :icon-info="skill.value.buffIcon"/>
                <sprite-icon v-else-if="skill.value.skillIcon.index == 0 && skill.value.debuffIcon && skill.value.debuffIcon.index != 0" 
                    :icon-info="skill.value.debuffIcon"/>
                <sprite-icon v-else :icon-info="skill.value.skillIcon" />
            </div>
        </div>
        <div class="detail">
            <div class="id">
                {{ skill.value.id }}
            </div>
            <div class="name">
                {{ skill.value.name.message }}
            </div>
            <div class="details">
                <div class="job" v-if="skill.value.requiredJob">
                    <div class="class-icon">
                        <sprite-icon :icon-info="skill.value.requiredJob.icon" :size-override="16" />
                    </div>
                    {{ skill.value.requiredJob.name.message }}
                </div>
                <div v-if="skill.value.skillType == SkillType.ACTIVE">
                    active skill
                </div>
                <div v-else-if="skill.value.skillType == SkillType.PASSIVE">
                    passive skill
                </div>
                <div v-else-if="skill.value.skillType == SkillType.AUTOMATIC_PASSIVE">
                    auto passive skill
                </div>
                <div v-else-if="skill.value.skillType == SkillType.EX_PASSIVE">
                    skill enhancement
                </div>
                <div v-else-if="skill.value.skillType == SkillType.AUTOMATIC_ACTIVATION">
                    auto skill
                </div>
                
                <div class="element" v-if="skill.value.element != -1">
                    <i class="fa fa-fire fire" v-if="skill.value.elementStr == 'FIRE'"></i>
                    <i class="fa fa-snowflake-o ice" v-else-if="skill.value.elementStr == 'WATER'"></i>
                    <i class="fa fa-bolt light" v-else-if="skill.value.elementStr == 'LIGHT'"></i>
                    <i class="fa fa-adjust dark" v-else-if="skill.value.elementStr == 'DARK'"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="error info" v-else-if="skill.error">
        <div class="icon">
            <div class="skill-icon">
                <i class="fa fa-exclamation-triangle"></i>
            </div>
        </div>
        <div class="detail">
            <div class="id">
                {{ skillId }}
            </div>

            <div class="name">
                Skill data error
            </div>
        </div>
    </div>
    <div class="loading" v-else>
        <div class="load-content">
            <loader :load-text="`Skill ${skillId}`" />
        </div>
    </div>
    <div class="tooltip" v-if="isHover">
        <skill-stub-tooltip :skill-data="skill.value" :show="true" />
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import LoadingErrorable from "@/models/util/LoadingErrorable";
import SkillProvider from "@/api/SkillProvider";

import SpriteIcon from "@/components/util/SpriteIcon.vue";
import Loader from "@/components/util/Loader.vue";
import SkillStubTooltip from "@/components/skill/SkillStubTooltip.vue";

import ISkill from '@/models/skills/ISkill';
import { SkillType } from '@/models/skills/SkillEnums';
import { filters } from '@/filters/Filters';

import { debounce } from 'lodash';

interface IData {
    skill: LoadingErrorable<ISkill, any>;
    isHover: boolean;
    hoverIn(): void;
    hoverOut(): void;
}

export default Vue.extend({
    props: {
        "skillId": {
            type: Number as () => number,
        },
        "fill": {
            type: Boolean as () => boolean,
        },
        "skillData": {
            type: Object as () => ISkill,
        },
    },
    components: {
        SpriteIcon,
        Loader,
        SkillStubTooltip,
    },
    data(): IData {
        return {
            skill: new LoadingErrorable(),
            isHover: false,
            hoverIn: () => {},
            hoverOut: () => {},
        };
    },
    watch: {
        skillId() {
            this.fetchData();
        },
        skillData() {
            this.fetchData();
        }
    },
    mounted() {
        this.hoverIn = debounce(() => {
            this.isHover = true;
        }, 250);
        this.hoverOut = debounce(() => {
            this.isHover = false;
        }, 500);
        this.fetchData();
    },
    computed: {
        SkillType(): any {
            return SkillType;
        }
    },
    methods: {
        async fetchData() {
            if (this.skillData) {
                this.skill.done(this.skillData);
                this.$emit("done", this.skill.value);
                return;
            }

            this.skill.startLoad();
            try {
                const skillData = await SkillProvider.getSkill(this.skillId);
                this.skill.done(skillData);
                this.$emit("done", this.skill.value);
            } catch (err) {
                // console.log(err);
                this.skill.failed(err);
            }
        },
        skillTypeToString(type: SkillType): string {
            return filters.skillType(type);
        },
        onHoverIn() {
            this.isHover = true;
        },
        onHoverOut(event: MouseEvent) {
            // if (event.)
            this.isHover = false;
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.skill-stub {
    display: inline-block;
    position: relative;
    padding: 0;
    margin: 0;
    font-size: 0px;

    &[fill] {
        width: 100%;
    }

    >.tooltip {
        position: absolute;
        z-index: 100;
        pointer-events: none;
        opacity: 0.0;
        top: 0;
        transition: opacity 0.125s ease-in;
    }

    &:hover >.tooltip {
        opacity: 1.0;
    }


    .info {
        position: relative;
        display: flex;
        min-width: 0;
        overflow: hidden;

        &[type="active"] {
            .icon,
            .detail {
                border-color: @dv-c-foreground;
            }
        }

        &[type="enhancement"],
        &[type="enhancement"] {
            .icon,
            .detail {
                border-color: @rank-unique;
            }
        }

        &.error {
            .icon,
            .detail {
                border-color: @dv-c-red;
            }
        }

        .icon {
            flex: 0 0 60px;
            border: 1px solid;
            border-color: @rank-divine;
            background-color: black;
            position: relative;
            width: 60px;
            height: 60px;
            .skill-icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .detail {
            position: relative;
            flex: 1 0 0;
            border: 1px solid;
            .border-left(none);
            border-color: @rank-divine;
            padding: 10px;
            .padding-left(12px);
            padding-top: 4px;

            .id {
                font-size: 10px;
                color: @dv-c-disabled;
                padding: 0;
                margin: 0;
                line-height: 0.5em;

                &::before {
                    content: "#";
                }
            }

            .name {
                font-family: @dv-f-geomanist;
                font-size: 18px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: @dv-c-foreground;
                white-space: nowrap;
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

    .loading {
        height: 60px;
        border: 1px solid @dv-c-idle;
        font-size: 14px;
        color: @dv-c-idle;
        white-space: nowrap;
        min-width: 200px;
        overflow: hidden;
        position: relative;

        .load-content {
            position: absolute;
            top: 16px;
            .left(8px);
        }
    }
    
    .error {
        font-size: 14px;
        color: @dv-c-red;
        white-space: nowrap;
        min-width: 200px;
        overflow: hidden;
        position: relative;

        .icon {
            .fa {
                font-size: 30px;
            }
        }

        .detail {
            padding-top: 14px;

            .name {
                color: @dv-c-red;
            }
        }
    }
}

</style>
