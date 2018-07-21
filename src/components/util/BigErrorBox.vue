<template>
<div class="error">
    <div class="icon">
        <i :class="`fa ${iconClass}`"></i>
    </div>
    <div class="head">
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
</template>

<script>
export default {
    props: ["errorTitle", "errorContent", "iconClass", "secondaryInfo", "canRetry"],
    methods: {
      retry() {
            appInsights.trackEvent(`interaction.errorbox.retry`, {
                title: this.errorTitle,
                content: this.errorContent,
                secondaryInfo: this.secondaryInfo,
                displayType: "big",
                region: this.$store.state.regionCode,
            });

          this.$emit('retry');
      }
  }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";
.error {
    margin-top: 2em;
    text-align: center;
    background: rgba(0, 0, 0, 0.75);
    padding: 1em;
    border: 1px solid @dv-c-red;
    .icon {
        font-size: 144px;
        color: @dv-c-red;
    }
    .head {
        font-family: @dv-f-lato;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 24px;
        color: @dv-c-red;
    }
    p {
        text-align: center;
        font-size: 18px;
        word-wrap: break-word;
        padding: 0;
        margin: 1em 0;
    }

    .secondary {
        color: #555;
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

