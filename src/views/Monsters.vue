<template>
<div class="monsters">
    <h1>Monsters</h1>

    <toast icon="fa-exclamation-triangle" type="warn">
        <template slot="header">
            Closed for construction
        </template>
        Sorry! This feature is currently unavailable and will return in a future update.
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
