<template>
  <div class="uistrings">
    <h1>Text</h1>
      <div class="button-bar">
        <router-link to="/text/uistring/browse" tag="div" class="row-button">Browse</router-link>
        <router-link to="/text/uistring/midlup" tag="div" class="row-button">MID Lookup</router-link>
      </div>
      <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';
// import region from '@/old/api/region';
import uistring from '@/old/api/uistring';
import UiStringMidResult from '@/old/uistrings/UiStringMidResult';

Vue.component('uistring-midresult', UiStringMidResult);

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
@import "../../less/core.less";

.uistrings {
}

</style>
