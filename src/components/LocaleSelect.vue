<template>
  <div class="locale-select">
    <div class="selector">
        <i class="fa fa-globe"></i> {{ region }} ({{ language }})
    </div>
  </div>
</template>

<script>
export default {
  name: 'locale-select',
  data () {
    return {
        region: "North America",
        language: "English"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../less/core.less";

.locale-select {
    position: absolute;
    top: 14px;
    right: 20px;
    text-align: right;

    .selector {
        color: @dv-c-accent-2;
        font-family: @dv-f-lato;
        letter-spacing: 0.2em;
        font-size: 12px;
        text-transform: uppercase;
        font-weight: normal;
        transition: color ease-in 0.125s;
        cursor: pointer;

        &:hover {
            color: @dv-c-foreground;
        }
    }
}

</style>
