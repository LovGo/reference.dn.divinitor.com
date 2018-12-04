<template>
<div class="standalone-auth">
    <p>
        You must log in to view this page.
    </p>

    <div class="login">
        <discord-hero-button :optional="false" v-on:done="next"/>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import DiscordHeroButton from "@/components/auth/DiscordHeroButton.vue";

export default Vue.extend({
    components: {
        DiscordHeroButton,
    },
    methods: {
        next() {
            const path = this.$route.query.path;
            if (path) {
                this.$router.push(path);
            }
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.standalone-auth {
    // max-width: 500px;
}

</style>
