<template>
<div class="skills">
    <h1 class="divided">Skills</h1>
    <div class="options-grid">
        <router-link to="/skills/sim" class="option">
            <h2 class="heading">
                Skill Sim
                <div class="icon fa fa-gear"></div>
            </h2>
        </router-link>
        <router-link to="/skills/search" class="option">
            <h2 class="heading">
                Search
                <div class="icon fa fa-search"></div>
            </h2>
        </router-link>
    </div>

    <toast icon="fa-exclamation-triangle" type="">
        <template slot="header">
            Monster Mash
        </template>
        To see the skillsets of monsters, please go to the <router-link to="/monsters">Monsters section</router-link>.
    </toast>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Toast from "@/components/util/Toast.vue";
import SkillStubLink from "@/components/skill/SkillStubLink.vue";

export default Vue.extend({
    components: {
        Toast,
        SkillStubLink,
    }
    
});
</script>

<style lang="less" scoped>
@import "./../less/core.less";

.skills {
    .test {
        > div {
            height: 500px;
        }
    }
}

</style>
