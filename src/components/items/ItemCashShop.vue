<template>
<div class="item-cash-shop">
    <h1>Cash Shop</h1>
    <div class="go-back"
        v-on:click="goBack">
        <i class="fa fa-angle-double-left"></i>Back
    </div>
    <div class="warn toast">
      <div class="heading">Coming Soon</div>
      This feature is currently under development
    </div>
</div>
</template>

<script>
export default {

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
@import "../../less/core.less";

.item-cash-shop {
    position: relative;
}
</style>
