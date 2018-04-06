<template>
<div class="small-error warn toast">
    <div class="icon">
        <i :class="`fa ${iconClass}`"></i>
    </div>
    <div class="content">
        <div class="heading">
            {{ errorTitle }}
        </div>
        <p>
            {{ errorContent }}
        </p>
        <p class="secondary" v-if="secondaryInfo">
            {{ secondaryInfo }}
        </p>
        <button class="retry" v-if="canRetry" v-on:click="retry">Retry</button>
    </div>
</div>
</template>

<script>
export default {
  props: ["errorTitle", "errorContent", "iconClass", "secondaryInfo", "canRetry"],
  methods: {
      retry() {
          this.$emit('retry');
      }
  }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";
.small-error {
    .content {
        .secondary {
            color: #555;
            font-size: 14px;
        }
    }

    button {
        padding: 0.25em 2em;
        border-color: @dv-c-red;
        color: @dv-c-red;

        &:hover {
            color: white;
            background-color: fade(@dv-c-red, 30%);
        }
    }
}
</style>

