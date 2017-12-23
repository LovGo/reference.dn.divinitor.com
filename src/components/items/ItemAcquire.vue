<template>
<div class="item-acquire">
    <transition name="fade">
        <div v-if="loading" class="loading">
            <div class="loader-box">
                <div class="loader"></div>
                <div class="label">Loading</div>
            </div>
        </div>
    </transition>
    <transition name="fade">
        <div class="result" v-if="!loading">
            This item can be acquired from the following:
        </div>
    </transition>
</div>
</template>

<script>
export default {
    props: ["itemId"],
    data: function() {
        return {
            loading: true,
            acqData: null,
            error: null,
       }
    },
    created() {

    },
    methods: {
        fetchData() {
            this.loading = true;
            this.error = null;
            this.tunerData = null;
            // Item.getAcquire(this.itemId, this.$store.state.regionCode,
            //     (res) => {
            //         this.acqData = res;
            //         this.loading = false;
            //         this.error = null;
            //     },
            //     (err) => {
            //         this.loading = false;
            //         this.error = err;
            //     });
        },
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-acquire {
    position: relative;


    .loading {
        .loader-box {
            position: absolute;
            // top: 0;
            // left: 0;
            // right: 0;
            // bottom: 0;
            // background: rgba(0, 0, 0, 0.5);
            padding: 16px 0 0 16px;
            
            .label {
                display: inline-block;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                padding-top: 10px;
                padding-left: 10px;
                vertical-align: top;
                color: @dv-c-foreground;
            }

            .loader,
            .loader:after {
                border-radius: 50%;
                width: 2em;
                height: 2em;
            }
            .loader {
                display: inline-block;
                line-height: 100%;
                font-size: 16px;
                text-indent: -9999em;
                border-top: 0.2em solid rgba(0, 0, 0, 0.75);
                border-right: 0.2em solid rgba(0, 0, 0, 0.75);
                border-bottom: 0.2em solid rgba(0, 0, 0, 0.75);
                border-left: 0.2em solid @dv-c-foreground;
                background: rgba(0, 0, 0, 0.5);
                //   -webkit-transform: translateZ(0);
                //   -ms-transform: translateZ(0);
                //   transform: translateZ(0);
                -webkit-animation: load8 1.1s infinite linear;
                animation: load8 1.1s infinite linear;
            }
        }
    }
}
</style>
