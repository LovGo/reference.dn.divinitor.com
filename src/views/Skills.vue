<template>
<div class="skills">
    <h1 class="divided">Skills</h1>
    <skill-search :initialQuery="initialQuery" @query="onSearchQuery"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Toast from "@/components/util/Toast.vue";
import SkillSearch from "@/components/skill/SkillSearch.vue";

export default Vue.extend({
    components: {
        SkillSearch,
    },
    computed: {
        initialQuery(): string {
            return this.$route.query.q || '';
        }
    },
    methods: {
        onSearchQuery(query: string) {
            const location = {
                ...this.$route,
                query: {
                    ...this.$route.query,
                    q: query,
                },
            };

            this.$router.push(location);
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../less/core.less";

.skills {
}

</style>
