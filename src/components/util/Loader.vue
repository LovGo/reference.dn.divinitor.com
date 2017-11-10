<<template>
    <div class="wrapper">
        <transition name="fade">
            <div v-if="loading" class="loading">
                <div class="loader-box">
                    <div class="loader"></div>
                    <div class="label">Loading</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: ["loading"]
}
</script>

<style lang="less" scoped>
.loading {
    .loader-box {
        position: fixed;
        text-align: center;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        transform: translate(5%, 0);

        .label {
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: @dv-c-foreground;
            transform: translate(0, 10px);
        }

        .loader,
        .loader:after {
            border-radius: 50%;
            width: 10em;
            height: 10em;
        }
        .loader {
            position: absolute;
            left: 50%;
            top: 50%;
            line-height: 100%;
            font-size: 16px;
            margin: -5em -6em;
            text-indent: -9999em;
            border-top: 1.1em solid rgba(0, 0, 0, 0.75);
            border-right: 1.1em solid rgba(0, 0, 0, 0.75);
            border-bottom: 1.1em solid rgba(0, 0, 0, 0.75);
            border-left: 1.1em solid @dv-c-foreground;
            background: rgba(0, 0, 0, 0.5);
            //   -webkit-transform: translateZ(0);
            //   -ms-transform: translateZ(0);
            //   transform: translateZ(0);
            -webkit-animation: load8 1.1s infinite linear;
            animation: load8 1.1s infinite linear;
        }

        @-webkit-keyframes load8 {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }
        @keyframes load8 {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }
    }
}
</style>
