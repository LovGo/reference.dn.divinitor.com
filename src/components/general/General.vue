<template>
<div class="general">
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
@import "../../less/core.less";

.general {

}
</style>
