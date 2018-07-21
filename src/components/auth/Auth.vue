<template>
<div class="auth">
    <p v-if="expired">
        Your session has expired. Please log in again.
    </p>
    <p v-else>
        This resource requires a Divinitor Test Account to access.
    </p>
    <button v-on:click="logIn">Log in with Discord</button>
</div>
</template>

<script>
export default {
    computed: {
        expired() {
            return this.$store.getters.isExpired;
        }
    },
    methods: {
        logIn() {
            let redirectUrl = "https://reference.dn.divinitor.com/auth/discordcb";
            if (window.location.host.indexOf("localhost") == 0) {
                redirectUrl = "http://localhost:8082/auth/discordcb";
            }

            let url = "https://discordapp.com/api/oauth2/authorize";
            url += "?response_type=code";
            url += "&client_id=383108341196390401";
            url += "&scope=identify%20email%20guilds";
            url += "&redirect_uri=" + encodeURIComponent(redirectUrl);

            window.location.href = url;
        }
    }
}
</script>

<style lang="less" scoped>

</style>
