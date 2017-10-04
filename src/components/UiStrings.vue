<template>
  <div class="uistrings">
      <h1>UI Strings</h1>
      <div class="button-bar">
        <router-link to="/uistring" tag="div" class="row-button">Browse</router-link>
        <router-link to="/uistring/midlup" tag="div" class="row-button">MID Lookup</router-link>
      </div>
      <router-view></router-view>
  </div>
</template>

<script>
import region from '@/api/region';
import uistring from '@/api/uistring';

export default {
  name: 'uistrings',
  data () {
    return {
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../less/core.less";

.uistrings {
    .button-bar {
        display: flex;
        width: 100%;
        .row-button {
            flex: 1 0 0;
            text-align: center;
            font-family: @dv-f-geomanist;
            color: @dv-c-foreground;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            font-size: 16px;
            border: @dv-c-foreground 1px solid;
            border-width: 1px 1px 1px 0;
            padding: 0.5em;
            cursor: pointer;
            transition: background-color 0.25s ease-in, color 0.25s ease-in;

            &:first-child {
                border-width: 1px;
            }

            &:hover,
            &.router-link-active {
                background-color: @dv-c-foreground;
                color: @dv-c-background;
            }
        }
    }
}

</style>
