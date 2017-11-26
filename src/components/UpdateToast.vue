<template>
<div class="update-toast">
    <transition name="fade-item">
        <div class="container-wrapper" v-if="show">
            <div class="top accent-box"></div>
            <div class="toast-body">
                <div class="entry" v-for="(e, k) in newUpdates" :key="k">
                    <div class="content">
                        <h2>{{ e.title }}</h2>
                        <div class="tag">{{e.timestamp}}</div>
                        <p v-html="e.body">
                        </p>
                    </div>
                </div>
                <button class="close-button"
                    v-on:click="markAsRead">
                    <i class="fa fa-close"></i>
                </button>
                <div class="title">Changelog</div>
            </div>
            <div class="bottom accent-box"></div>
        </div>
    </transition>
</div>
</template>

<script>
import UpdateToast from '@/api/updatetoast';

export default {
    data: function() {
        return {
            show: false
        }
    },
    created() {
        this.show = UpdateToast.hasNewUpdate()
    },
    computed: {
        latest() {
            return UpdateToast.getLatestUpdate();
        },
        newUpdates() {
            return UpdateToast.getNewUpdates(4);
        }
    },
    methods: {
        markAsRead() {
            UpdateToast.markAsRead();
            this.show = false;
        }
    }
}
</script>

<style lang="less" scoped>
@import "../less/core.less";

.update-toast {

    .container-wrapper {
        position: fixed;
        top: 40px;
        right: 40px;
        z-index: 50;
        width: 400px;

        .accent-box {
            background-color: @dv-c-background;
            border: 1px solid @dv-c-foreground;
            width: 86%;
            height: 4px;
            margin: 0 auto;
            padding: 0;
            &.top {
                border-bottom: none;
            }
            &.bottom {
                border-top: none;
            }
        }

        .toast-body {
            position: relative;
            background-color: @dv-c-background;
            border: 1px solid @dv-c-foreground;
            padding: 4px 20px 20px 20px;

            animation: toast-pulse 5s infinite linear;

            @keyframes toast-pulse {
                0% {
                    box-shadow: 0 0 40px fade(@dv-c-foreground, 30%);
                }
                20% {
                    box-shadow: 0 0 40px fade(@dv-c-foreground, 70%);
                }
                40% {
                    box-shadow: 0 0 40px fade(@dv-c-foreground, 100%);
                }
                60% {
                    box-shadow: 0 0 40px fade(@dv-c-foreground, 70%);
                }
                80% {
                    box-shadow: 0 0 40px fade(@dv-c-foreground, 30%);
                }
                100% {
                    box-shadow: 0 0 40px fade(@dv-c-foreground, 30%);
                }
            }

            .title {
                position: absolute;
                top: 8px;
                font-family: @dv-f-geomanist;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                font-size: 12px;
                color: @dv-c-idle;
            }

            .close-button {
                position: absolute;
                top: 4px;
                right: 4px;
                border: none;
                background: none;
                padding: 4px;
                line-height: 1em;
                height: auto;

                &:hover {
                    color: white;
                }
            }

            .entry {
                position: relative;
                padding: 18px 0 0 0;
                margin: 8px 0;

                border-top: 1px solid @dv-c-accent-3;

                &:first-child {
                    border-top: none;
                }

                .tag {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: @dv-c-accent-1;
                }

                .content {
                    h2 {
                        font-size: 16px;
                        margin: 0;
                        padding: 0;
                    }

                    p {
                        margin: 4px 0;
                    }
                }
            }
        }
    }
}

</style>
