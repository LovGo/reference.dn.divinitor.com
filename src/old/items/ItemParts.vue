<template>
    <div class="item-parts" :expand="expanded">
        <div class="content">
            <div class="render" ref="renderbox">
                <canvas class="render-surface" ref="render" :width=size.width :height=size.height></canvas>
            </div>
            <div class="overlay">
                <div class="active-skn-name">
                    <span v-if="selectedPart.sknName">
                        {{ selectedPart.sknName.toLowerCase() }}
                    </span>
                    <span v-else-if="selectedPart.decalName">
                        {{ selectedPart.decalName }}
                    </span>
                </div>
                <div class="weapon" v-if="parts.type == 'WEAPON'">

                </div>
                <div class="parts" v-else>

                </div>
                <button class="expand" v-on:click="expand" v-if="!this.selectedPart.decalName">
                    <i v-if="expanded" class="fa fa-close"></i>
                    <i v-else class="fa fa-expand"></i>
                </button>
            </div>
        </div>
        <!-- <div class="debug">
            {{ parts }}
        </div> -->
    </div>
</template>

<script>
import Vue from 'vue';
import * as THREE from "three";
import Store from '@/store';

export default {
    props: ["itemId", "parts"],
    data: function() {
        return {
            selectedPart: null,
            expanded: false,
            renderer: {},
            size: {
                width: 256,
                height: 256,
            }
        };
    },
    created() {
        this.init();
    },
    mounted() {
        this.setup();
    },
    computed: {
        weaponPart() {
            if (this.parts.type == 'WEAPON') {
                return this.parts.parts[0];
            } else {
                return null;
            }
        }
    },
    watch: {
        itemId(to, from) {
            if (to != from) {
                this.init();
            }
        },
    },
    methods: {
        init() {
            if (this.parts.parts.length != 0) {
                this.selectedPart = this.parts.parts[0];
            } else {
                this.selectedPart = null;
            }
        },
        expand() {
            this.expanded = !this.expanded;
            if (this.expanded) {
                console.log(this.$refs["renderbox"].getClientRects());
                this.size.width = this.$refs["renderbox"].getClientRects().width;
                this.size.height = this.$refs["renderbox"].getClientRects().height;
            } else {
                this.size.width = 256;
                this.size.height = 256;
            }

            this.drawDecal();
        },
        canvas() {
            return this.$refs["render"];
        },
        setup() {
            if (this.selectedPart.sknName) {

            } else if (this.selectedPart.decalName) {
                //  TEMPORARY
                this.drawDecal();
            }
        },
        drawDecal() {
            if (this.selectedPart.decalName) {
                let canvas = this.canvas();
                let region = Store.state.regionCode;
                let url = `${ApiHttpClient.defaults.baseURL}/server/${region}/dds/${this.selectedPart.decalName}/png`;
                let img = new Image();
                img.addEventListener('load', () => {
                    let ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, -128, 0, 512, 256);
                }, false);
                img.src = url;
            }
        }
    },
}
</script>
 
<style lang="less" scoped>
@import "../../less/core.less";

.item-parts {
    position: relative;
    width: 100%;
    height: 100%;
    background: transparent;

    transition: background-color 0.125s ease-in;

    &::after {
        content: none;
    }

    &[expand] {
        position: fixed;
        width: auto;
        height: auto;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: fade(@dv-c-background, 95%);
        margin: 100px;
        border: 1px solid @dv-c-foreground;
        z-index: 10;

        &::after {
            position: fixed;
            content: "";
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
        }

        .overlay {

            .active-skn-name {
                padding-top: 12px;
                font-size: 20px;
            }

            .expand {
                top: 0;
                background-color: fade(@dv-c-red, 20%);
                color: fade(white, 50%);

                &:hover {
                    background-color: fade(@dv-c-red, 80%);
                }
            }
        }
    }

    .overlay {
        z-index: 100;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        .active-skn-name {
            padding-top: 4px;
            word-wrap: break-word;
            text-align: center;
            font-family: @dv-f-geomanist;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: @dv-c-foreground;
        }

        .weapon {
        }

        .expand {
            position: absolute;
            right: 0;
            bottom: 0;
            border: none;
            background: none;
            width: 30px;
            height: 30px;
            transition: color 0.125s ease-in, background-color 0.125s ease-in;

            &:hover {
                background: fade(@dv-c-foreground, 20%);
                color: white;
            }
        }
    }

    .render {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        .render-surface {
            width: 100%;
            height: 100%;
        }
    }

    .debug {
        position: absolute;
        bottom: 0;
        word-wrap: break-word;
        opacity: 0.0;
        transition: opacity 0.125s ease-in;
    }

    &:hover {
        .debug {
            opacity: 1.0;
        }
    }
}
</style>
 