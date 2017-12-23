<template>
<div class="guild">
    <h1>Guilds</h1>
    <div class="go-back"
        v-on:click="goBack">
        <i class="fa fa-angle-double-left"></i>Back
    </div>
    <div class="toast warn">
      Coming soon
    </div>
    <!-- <h2>Guild EXP</h2>

    <h2>Guild Rewards</h2> -->
    
</div>
</template>

<script>
export default {
  name: 'genstats',
  data () {
    return {
        
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
    },
    goBack() {
        this.$router.back();
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../less/core.less";

.general {

}
</style>
