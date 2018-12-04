<template>
  <div class="httperror">
        <h1>Error</h1>
        
        <div class="warn toast">
            <div class="content">
                <div class="heading">404 Page Not Found</div>
                The page you have requested does not exist.
            </div>
        </div>
        <p>
            Sorrymasen! We couldn't find this page. You can 
            <a v-on:click.prevent="goBack" href="#">go back</a> or 
            <router-link to="/">go home.</router-link>
        </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    }
});
</script>

<style lang="less" scoped>
// @import "../less/core.less";

</style>
