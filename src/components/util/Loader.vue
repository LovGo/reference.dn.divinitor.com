<<template>
    <div class="loading-indicator">
        <div class="loading-blinker" />
        <div class="loader">
            <div class="text title"><span v-if="altText">{{altText}}</span><span v-else>Now Loading</span></div>
            <div v-if="loadText" class="text">{{loadText}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["loading", "loadText", "altText"]
}
</script>

<style lang="less" scoped>
@import "./../../less/core.less";
.loading-indicator {

    @c-color: @dv-c-foreground;
    @c-shadow-color: fade(@dv-c-accent-2, 100%);
    @c-block-color: @dv-c-foreground;
    @c-block-shadow-color: fade(@dv-c-foreground, 80%);

    position: relative;
    display: flex;
    flex-direction: row;

    &[inline] {
        height: 20px;
    }

    .loading-blinker {
        flex: 0 0;
        transform: translate(0, -1px);
    }

    .loader {
        flex: 1 0;
        position: relative;

        .text {
            position: absolute;
            padding-left: 20px;
            bottom: -2px;
            left: 0;
            text-align: left;
            text-shadow: 0 0 14px @c-shadow-color;
            color: @c-color;
            font: @dv-f-geomanist;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            animation: text 4s infinite linear;
            opacity: 0.0;

            &.title {
                animation: title 4s 2s infinite linear;
            }
        }

        @keyframes title {
            0% {opacity: 0.0;left: -10px;}
            5% {left: 0px;}
            10% {opacity: 1.0;left: 0px;}
            50% {opacity: 1.0;left: 0px}
            53% {opacity: 0.0;left: 200px;}
            99% {opacity: 0.0;left: 0px;}
            100% {opacity: 0.0;}
        }

        @keyframes text {
            0% {opacity: 0.0;left: -10px;}
            5% {left: 0px;}
            10% {opacity: 1.0;left: 0px;}
            50% {opacity: 1.0;left: 0px}
            53% {opacity: 0.0;left: 200px;}
            99% {opacity: 0.0;left: 0px;}
            100% {opacity: 0.0;}
        }
    }
}
</style>
