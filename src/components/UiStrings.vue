<template>
  <div class="uistrings">
      <div class="button-bar">
        <router-link to="/text/uistring/browse" tag="div" class="row-button">Browse</router-link>
        <router-link to="/text/uistring/midlup" tag="div" class="row-button">MID Lookup</router-link>
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
}

</style>
