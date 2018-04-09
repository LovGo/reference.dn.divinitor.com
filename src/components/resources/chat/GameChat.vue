<template>
<div class="game-chat">
    <h1>Game World Chat</h1>
    <div class="go-back"
        v-on:click="goBack">
        <i class="fa fa-angle-double-left"></i>Back
    </div>
    <div class="warn toast">
        <div class="content">
            <div class="heading">Coming Soon</div>
            <p>This feature is currently under development</p>
        </div>
    </div>

    <div class="info toast">
        <div class="icon">
            <i class="fa fa-question-circle"></i>
        </div>
        <div class="content">
            <div class="heading">
                :eyes: emoji
            </div>
            <p>
                This page displays in real-time DN's world chat (blue birds and poverty birds)
            </p>
        </div>
    </div>
    
    <transition name="fade">
        <div v-if="connecting" class="loading">
            <load-indicator
            loadText="Connecting to server" altText="Please wait" />
        </div>
    </transition>
</div>
</template>

<script>
export default {

    data() {
        return {
            connecting: true
        };
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

.game-chat {
    position: relative;
}

</style>
