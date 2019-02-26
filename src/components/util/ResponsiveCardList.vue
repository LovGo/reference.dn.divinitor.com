<template>
<div class="card-list" :long="isLong">
    <slot />
    <slot name="empty" v-if="count === 0">
        <div class="empty">
            <span class="desc">No items in list</span>
        </div>
    </slot>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        "count": {
            type: Number as () => number,
        },
    },
    computed: {
        isLong(): boolean {
            return this.count > 6;
        },
    },
});
</script>

<style lang="less" scoped>
@import "../../less/core.less";


.card-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    margin: 10px 0;

    &[long] {
        max-height: 50vh;
        overflow-y: scroll;
        border-bottom: 1px solid @dv-c-foreground;
        border-top: 1px solid @dv-c-foreground;
    }

    .empty {
        flex: 1 1;
        // border: 1px solid @dv-c-foreground;
        padding: 20px;
        font-family: @dv-f-geomanist;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: @dv-c-accent-1;
        text-align: center;

        .desc {
            padding: 0.5em 1em;
            background: fade(@dv-c-background, 70%);
            border-left: 2px solid @dv-c-foreground;
        }
    }
}

</style>

