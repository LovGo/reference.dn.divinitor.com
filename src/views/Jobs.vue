<template>
<div class="jobs">
    <h1 class="divided">Classes</h1>
    
    <a href="#scalings">Jump to Class Scalings Table</a>

    <job-tree v-on:done="onTreeLoaded" />
    <h1 class="divided" id="scalings">Scalings</h1>
    <job-stat-grid v-if="treeLoaded" />
</div>
</template>

<script lang="ts">
import Vue from "vue";
import JobStatGrid from "@/components/job/JobStatGrid.vue";
import JobTree from "@/components/job/JobTree.vue";

interface IData {
    treeLoaded: boolean;
}

export default Vue.extend({
    components: {
        JobStatGrid,
        JobTree,
    },
    data(): IData {
        return {
            treeLoaded: false,
        };
    },
    methods: {
        onTreeLoaded() {
            this.treeLoaded = true;
        },
    },
});
</script>

<style lang="less" scoped>
@import "./../less/core.less";

.jobs {
}
</style>
