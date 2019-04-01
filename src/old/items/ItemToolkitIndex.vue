<template>
    <div class="item-toolkit-index">
        <div class="kit-list">
            <router-link to="drop" class="kit-item">Item Drop</router-link>
            <router-link to="dropgroup" class="kit-item">Item Drop Group</router-link>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-toolkit-index {
    .kit-list {
        .kit-item {
            display: block;
            text-transform: uppercase;
            font-family: @dv-f-lato;
            font-size: 14px;

            .margin-left(0.25em);
            margin-top: 0.6em;
            
            .padding-left(0.5em);
            padding-top: 0.2em;
            padding-bottom: 0.2em;
            .border-left(@dv-c-accent-1 solid 2px);
            transition: border ease-in 0.125s, color ease-in 0.125s, background-color ease-in 0.125s;
            font-weight: normal;
            letter-spacing: 0.1em;
            color: @dv-c-accent-1;
            cursor: pointer;

            &:hover {
                color: @dv-c-foreground;
                background: fade(@dv-c-foreground, 20%);
            }
        }
    }
}


</style>
