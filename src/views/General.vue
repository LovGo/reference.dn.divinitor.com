<template>
<div class="general">
    <h1 class="divided">General</h1>
    <div class="options-grid">
        <router-link to="/general/stat/" class="option">
            <h2 class="heading">
                Stat Calc
                <div class="icon fa fa-hashtag"></div>
            </h2>
        </router-link>
        <!-- <router-link to="/general/taxes/" class="option">
            <h2 class="heading">
                Taxes/Fees
                <div class="icon fa fa-dollar"></div>
            </h2>
        </router-link>
        <router-link to="/general/damage/" class="option">
            <h2 class="heading">
                Damage Calc
                <div class="icon fa fa-arrow-up"></div>
            </h2>
        </router-link>
        <router-link to="/general/guild/" class="option">
            <h2 class="heading">
                Guilds
                <div class="icon fa fa-users"></div>
            </h2>
        </router-link> -->
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    
});
</script>

<style lang="less" scoped>
@import "./../less/core.less";

.general {
}
</style>
