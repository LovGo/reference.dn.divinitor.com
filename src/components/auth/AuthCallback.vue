<template>
    <div class="auth-cb">
        <div class="verifying" v-if="!result">
            <div class="error" v-if="error">
                <big-error-box 
                    errorTitle="Discord Authentication Error" 
                    :errorContent="error.statusText + ': ' + error.bodyText" 
                    secondaryInfo=""
                    canRetry="true"
                    v-on:retry="retry"
                    iconClass="fa-exclamation-triangle"></big-error-box>
            </div>
            <div v-else>
                <load-indicator
                loadText="Verifying" altText="Please wait"></load-indicator>
            </div>
        </div>
        <div class="result" v-else>
            <h2>
               Welcome, {{ authInfo.username }}! 
            </h2>
            <p>
                You now have full access to implemented features. 
                Please send Vahr any bug reports, usability feedback, or any other 
                good or bad things.
            </p>
        </div>
    </div>
</template>

<script>
import Auth from "@/api/auth";
import * as MT from '@/store/mutation-types';

export default {
    data: function() {
        return {
            result: null,
            error: null
        }
    },
    created() {
        this.redeem();
    },
    computed: {
        authInfo() {
            return this.$store.getters.authInfo;
        }
    },
    methods: {
        redeem() {
            this.result = null;
            this.error = null;
            Auth.redeem(this.$route.query.code,
            (r) => {
                this.result = r;
                this.$store.commit(MT.AUTH_SET, r);
                console.log(r);
            },
            (e) => {
                this.error = e;
                console.error(e);
            });
        },
        retry() {
            this.$router.push({path: '/auth'});
        }
    }
}
</script>

<style lang="less" scoped>

</style>
