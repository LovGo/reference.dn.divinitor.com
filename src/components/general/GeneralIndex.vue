<template>
<div class="general-index">
    <h1>General</h1>
    <ul>
        <li><router-link to="/general/stat/">Stat Calc</router-link></li>
        <li><router-link to="/general/taxes/">Taxes/Fees</router-link></li>
        <li><router-link to="/general/damage/" class="disabled">Damage Calc</router-link></li>
        <li><router-link to="/general/guild/" class="disabled">Guilds</router-link></li>
    </ul>
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
