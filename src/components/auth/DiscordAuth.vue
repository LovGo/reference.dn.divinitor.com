<template>
<div class="discord-auth">
    <div class="warn toast" v-if="error">
        <div class="content">
            <div class="heading">
                Unable to authenticate
            </div>
            <p>
                {{ friendlyError }}
            </p>
        </div>
    </div>

    <button class="close button" v-on:click="close">Close this window</button>
</div>
</template>

<script lang="ts">
import Vue from "vue"
import DiscordLoginProvider from '@/api/DiscordLoginProvider';

interface IData {
    error: any;
}

export default Vue.extend({
    
    data(): IData {
        return {
            error: null,
        };
    },
    mounted() {
        DiscordLoginProvider.redemptionWindowFlow(this.$route).then((suceeded) => {
            if (suceeded) {
                window.close();
            } else {
                this.error = new Error("Code redemption failed");
            }
        }).catch((err: Error) => {
            this.error = err;
            console.error(err);
        });
    },
    computed: {
        friendlyError(): string {
            if (!this.error) {
                return "";
            }

            const msg = this.error.message || this.error;

            if (msg == "access_denied") {
                return "Authentication was cancelled";
            }

            return msg;
        }
    },
    methods: {
        close() {
            window.close();
        }
    }
})
</script>

<style lang="less" scoped>

.discord-auth {
    width: 100%;
    .close.button {
        margin-top: 100px;
        width: 100%;
    }
}
</style>
