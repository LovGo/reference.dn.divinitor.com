<template>
<div class="damage">
    <h1>Calculating Damage</h1>
    <div class="go-back"
        v-on:click="goBack">
        <i class="fa fa-angle-double-left"></i>Back
    </div>
    <div class="toast warn">
      Coming soon
    </div>
</div>
</template>

<script>
export default {
  name: 'gendamage',
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

.damage {

}
</style>
