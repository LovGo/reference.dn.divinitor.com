<template>
<div class="maps">
    <h1>Maps</h1>

    <toast icon="fa-exclamation-triangle" type="warn">
        <template slot="header">
            Coming soon
        </template>
        Sorry! This feature is currently under development.
    </toast>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Toast from "@/components/util/Toast.vue";

export default Vue.extend({
    components: {
        Toast,
    }
    
});
</script>

<style lang="less" scoped>
@import "./../less/core.less";

</style>
