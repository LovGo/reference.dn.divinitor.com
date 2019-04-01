<<template>
    <div class="loading-indicator">
        <div class="loader">
            <div class="title"><span v-if="altText">{{altText}}</span><span v-else>Now Loading</span></div>
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
@import "../../less/core.less";
.loading-indicator {

    @c-color: @dv-c-foreground;
    @c-shadow-color: fade(@dv-c-accent-2, 100%);
    @c-block-color: @dv-c-foreground;
    @c-block-shadow-color: fade(@dv-c-foreground, 80%);


    &[inline] {
        height: 20px;
    }

    position: relative;
    .loader {
        position: relative;
        .text-align(left);
        text-shadow: 0 0 14px @c-shadow-color;
        color: @c-color;
        font: @dv-f-geomanist;
        text-transform: uppercase;
        letter-spacing: 0.1em;

        .padding-left(10px);

        &:before {
            content: "";
            display: block;
            position: absolute;
            top: -4px;
            .left(0px);
            width: 20px;
            height: 20px;
            background: @c-block-color;
            box-shadow: 0 0 20px 3px @c-block-shadow-color;
            animation: blinker 7s infinite linear;
        }

        & > div {
            display: block;
            position: absolute;
            .padding-left(30px);
            .left(0);
            height: 20px;
            line-height: 20px;
        }

        .title {
            animation: title 4s 2s infinite linear;
            opacity: 0.0;
        }

        .text {
            animation: text 4s infinite linear;
            opacity: 0.0;
        }

        @keyframes title {
            0% {opacity: 0.0;.left(-10px);}
            5% {.left(0px);}
            10% {opacity: 1.0;.left(0px);}
            50% {opacity: 1.0;.left(0px);}
            53% {opacity: 0.0;.left(200px);}
            99% {opacity: 0.0;.left(0px);}
            100% {opacity: 0.0;}
        }

        @keyframes text {
            0% {opacity: 0.0;.left(-10px);}
            5% {.left(0px);}
            10% {opacity: 1.0;.left(0px);}
            50% {opacity: 1.0;.left(0px);}
            53% {opacity: 0.0;.left(200px);}
            99% {opacity: 0.0;.left(0px);}
            100% {opacity: 0.0;}
        }

        @keyframes blinker {
            0% {opacity: 0.0;}
            5% {opacity: 0.6;}
            10% {opacity: 0.2;}
            15% {opacity: 0.4;}
            20% {opacity: 0.3;}
            25% {opacity: 0.9;background-color:saturate(@c-block-color, 50%);}
            30% {opacity: 0.1;}
            35% {opacity: 0.6;}
            40% {opacity: 0.3;}
            45% {opacity: 0.8;}
            50% {opacity: 0.5;background-color:saturate(@c-block-color, 100%);}
            55% {opacity: 1.0;}
            60% {opacity: 0.2;}
            65% {opacity: 1.0;}
            70% {opacity: 0.4;background-color:saturate(@c-block-color, 0%);}
            75% {opacity: 0.8;}
            80% {opacity: 0.3;}
            85% {opacity: 0.5;}
            90% {opacity: 0.2;}
            95% {opacity: 1.0;}
            100% {opacity: 0.0;}
        }
    }
}
</style>
