<template>
<div class="skill-stub-wrapper">
<router-link class="skill-stub-link" 
    :to="`/skills/${linkTarget}`"
    :fill="fill">
    <skill-stub :skill-id="skillId" :fill="fill" :skill-data="skillData" v-on:done="onLoaded"/>
</router-link>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import SkillStub from "@/components/skill/SkillStub.vue";
import ISkill from '@/models/skills/ISkill';
import SkillProvider from '@/api/SkillProvider';

interface IData {
    linkTarget: string;
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
        SkillStub,
    },
    data(): IData {
        return {
            linkTarget: `${this.skillId || this.skillData.id}`,
        };
    },
    methods: {
        onLoaded(skill: ISkill) {
            this.linkTarget = SkillProvider.skillSlug(skill);
            this.$emit("done", skill);
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.skill-stub-link {
    padding: 0;
    margin: 0;
    font-size: 0;
    display: inline-block;
    background: fade(@dv-c-background, 75%);
    transition: background-color 0.125s ease-in;

    &[fill] {
        display: inherit;
    }

    &:hover {
        background: fade(@dv-c-foreground, 10%);
    }
}

.skill-stub-wrapper {
    font-size: 0;
}

</style>
