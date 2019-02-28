<template>
<div class="card-list-entry" :narrow="narrow">
    <slot />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    props: {
        "narrow": {
            type: Boolean as () => boolean,
        },
    },
});
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.card-list-entry {
    border: 1px solid @dv-c-foreground;
    border-top-width: 0;
    box-sizing: border-box;
    flex: 0 1;

    // Desktop view (wide)
    @media @wide-desktop {
        &:not([narrow]) {
            flex-basis: 50%;
            &:first-child, &:nth-child(2) {
                border-top-width: 1px;
            }
            &:nth-child(2n) {
                border-left-width: 0;
            }
        }
    }

    // Narrow view (tablet and below)
    flex-basis: 100%;
    &:first-child {
        border-top-width: 1px;
    }
}
</style>
