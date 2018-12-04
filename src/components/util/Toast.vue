<template>
<div :class="`${type} toast`">
    <div class="icon" v-if="icon">
        <i :class="`fa ${icon}`"></i>
    </div>
    <div class="content">
        <div class="heading">
            <slot name="header"></slot>
        </div>
        <slot></slot>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    props: {
        "type": {
            type: String as () => string,
        },
        "icon": {
            type: String as () => string,
        },
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

</style>


