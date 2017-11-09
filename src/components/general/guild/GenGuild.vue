<template>
<div class="guild">
    <h2>Guild EXP</h2>

    <h2>Guild Rewards</h2>
    
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
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../less/core.less";

.general {

}
</style>
