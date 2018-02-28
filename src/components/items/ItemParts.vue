<template>
    <div class="item-parts" :expand="expanded">
        <div class="content">
            <div class="render" ref="render">
                <canvas class="render-surface"></canvas>
            </div>
            <div class="overlay">
                <div class="active-skn-name">
                    {{ selectedSknName }}
                </div>
                <div class="weapon" v-if="parts.type == 'WEAPON'">

                </div>
                <div class="parts" v-else>

                </div>
                <button class="expand" v-on:click="expand">
                    {{ expanded ? 'X' : 'E' }}
                </button>
            </div>
        </div>
        <!-- <div class="debug">
            {{ parts }}
        </div> -->
    </div>
</template>

<script>
import * as THREE from "three";

export default {
    props: ["itemId", "parts"],
    data: function() {
        return {
            selectedSknName: null,
            expanded: false,
            renderer: {}
        };
    },
    created() {
        this.init();
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
                this.selectedSknName = this.parts.parts[0].sknName;
            } else {
                this.selectedSknName = null;
            }

            this.three();
        },
        expand() {
            this.expanded = !this.expanded;
        },
        canvas() {
            return this.$refs["render"];
        },
        three() {
            // let canvas = Vue.$("canvas");
            // console.log(canvas);
            this.renderer = {
                // camera: new THREE.PerspectiveCamera(70, canvas().wi)
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
 