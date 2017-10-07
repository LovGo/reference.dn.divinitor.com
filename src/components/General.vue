<template>
<div class="general">
    <h1>General</h1>
    <div class="button-bar">
        <router-link to="/general/stat/" tag="div" class="row-button">Stat Calc</router-link>
        <router-link to="/general/damage/" tag="div" class="row-button">Damage Calc</router-link>
        <router-link to="/general/guild/" tag="div" class="row-button">Guilds</router-link>
    </div>
    <router-view></router-view>
</div>
</template>

<script>
export default {
  name: 'general',
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
}
</script>

<style lang="less" scoped>
@import "../less/core.less";

.general {

}
</style>
