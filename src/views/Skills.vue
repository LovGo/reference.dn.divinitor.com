<template>
<div class="skills">
    <h1>Skills</h1>

    <toast icon="fa-exclamation-triangle" type="warn">
        <template slot="header">
            Coming soon
        </template>
        Sorry! This feature is currently under development.
    </toast>

    <!-- <div class="test">
        <div>
            <skill-stub-link :skill-id="77213" />
        </div>
        <div>
            <skill-stub-link :skill-id="3602" />
        </div>
        <div>
            <skill-stub-link :skill-id="3210" />
        </div>
        <skill-stub-link :skill-id="3227" :fill="true" />
    </div> -->
    <!-- <div>
    <skill-stub :skill-id="503" />
    </div>
    <div>
    <skill-stub :skill-id="3218" />
    </div>
    <div>
    <skill-stub :skill-id="3305" />
    </div>
    <div>
    <skill-stub :skill-id="3311" />
    </div>
    <div>
    <skill-stub :skill-id="1013" />
    </div>
    <div>
    <skill-stub :skill-id="3420" />
    </div>
    <div>
    <skill-stub :skill-id="270051" />
    </div> -->
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
