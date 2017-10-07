<template>
  <div class="gametext">
      <h1>Text</h1>
      <!-- <div class="button-bar">
        <router-link to="/text/uistring/" tag="div" class="row-button">UIString</router-link>
        <router-link to="/text/server" tag="div" class="row-button disabled">Server Strings</router-link>
        <router-link to="/text/prohibit" tag="div" class="row-button disabled">Prohibited Words</router-link>
      </div> -->
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

.gametext {
}

</style>
