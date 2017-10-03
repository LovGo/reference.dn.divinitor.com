<template>
  <div class="httperror">
        <h1>Error</h1>
        
        <div class="warn toast">
            <div class="heading">404 Page Not Found</div>
            The page you have requested does not exist.
        </div>
        <p>
            Sorrymasen! We couldn't find this page. You can 
            <a v-on:click.prevent="goBack" href="#">go back</a> or 
            <router-link to="/">go home.</router-link>
        </p>
  </div>
</template>

<script>
export default {
  name: 'not-found',
  data () {
    return {
    }
  },
  methods: {
      goBack: function() {
          this.$router.go(-1);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
// @import "../less/core.less";

</style>
