<template>
<div class="general-index">
    <h1>General</h1>


    <div class="options-grid">
        <router-link to="/general/stat/" class="option">
            <h2 class="heading">
                Stat Calc
                <div class="icon fa fa-hashtag"></div>
            </h2>
        </router-link>
        <router-link to="/general/taxes/" class="option">
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
        </router-link>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.general-index {
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;

        li {
            border-left: 2px solid @dv-c-accent-1;
            padding-left: 8px;
            text-transform: uppercase;
            font-size: 18px;
            letter-spacing: 0.2em;
            margin-top: 0.4em;
        }
    }

}
</style>
