<template>
<div class="go-back"
    v-on:click="goBack">
    <i class="fa fa-angle-double-left"></i> Back
</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    methods: {
        goBack() {
            this.$router.back();
        },
    },
})
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.go-back {
    margin: 10px 0;
    font-size: 18px;
    border: 1px solid @dv-c-foreground;
    cursor: pointer;
    width: 70px;
    padding: 8px;
    .padding-left(10px);
    .padding-right(6px);
    text-align: center;
    background: fade(@dv-c-background, 50%);
    transition: background-color ease-in 0.125s, color ease-in 0.125s;
    text-transform: uppercase;
    font-size: 14px;

    .fa {
        .margin-right(0.5em);
        color: @dv-c-accent-2;
    }

    &:hover {
        background: fade(@dv-c-foreground, 50%);
        color: white;
    }
}
</style>

