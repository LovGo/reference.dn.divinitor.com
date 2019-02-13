<template>
    <div class="item-parts" :expand="expanded">
        <div class="content">
            <div class="render" ref="renderbox">
                <template v-if="!this.selectedPart.decalName">
                    <item3-d-view
                        v-if="active"
                        :parts="this.parts"
                        :part="this.selectedPart"
                        :type="this.type"
                        :width="this.size.width"
                        :height="this.size.height"
                    />
                </template>
                <canvas class="render-surface" ref="render" :width=size.width :height=size.height></canvas>
            </div>
            <div class="overlay">
                <template v-if="!active && !this.selectedPart.decalName && $fOn($f.Three)">
                    <button class="activate" @click="activate">Load Model</button>
                </template>
                <div class="active-skn-name" :always="!$fOn($f.Three) || expanded">
                    <span v-if="selectedPart.sknName">
                        {{ selectedPart.sknName.toLowerCase() }}
                    </span>
                    <span v-else-if="selectedPart.decalName">
                        {{ selectedPart.decalName }}
                    </span>
                    <div v-if="selectedPart.actName">
                        {{ selectedPart.actName.toLowerCase() }}
                    </div>
                    <div v-if="selectedPart.aniName">
                        {{ selectedPart.aniName.toLowerCase() }}
                    </div>
                    <div v-if="parts.parts.length > 1 && hasJobs">
                        <select v-model="selectedPartIndex">
                            <option v-for="(part, i) in sortedParts" 
                                :key="i"
                                :value="i">{{ part.job.name.message }}</option>
                        </select>
                    </div>
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
import Store from '@/store';
import { ApiHttpClient } from "@/globals";

import Item3DView from "@/components/item/Item3DView.vue";

export default {
    props: ["itemId", "parts", "type"],
    components: {
        Item3DView,
    },
    data: function() {
        return {
            expanded: false,
            renderer: {},
            size: {
                width: 256,
                height: 256,
            },
            active: false,
            selectedPartIndex: 0,
        };
    },
    created() {
        this.init();
    },
    mounted() {
        this.setup();
    },
    computed: {
        sortedParts() {
            if (this.parts) {
                return this.parts.parts.sort((a, b) => a.clsid - b.clsid);
            } else {
                return [];
            }
        },
        weaponPart() {
            if (this.parts.type == 'WEAPON') {
                return this.parts.parts[0];
            } else {
                return null;
            }
        },
        selectedPart() {
            if (this.parts.parts.length != 0) {
                return this.parts.parts[this.selectedPartIndex];
            } else {
                return null;
            }
        },
        hasJobs() {
            if (this.parts.parts.length > 0) {
                return !!this.parts.parts[0].job;
            }
            return false;
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
        },
        activate() {
            this.active = true;
        },
        expand() {
            this.expanded = !this.expanded;
            Vue.nextTick().then(() => {
                if (this.expanded) {
                    const rect = this.$refs["renderbox"].getClientRects()[0];
                    this.size.width = Number(rect.width);
                    this.size.height = Number(rect.height);
                } else {
                    this.size.width = 256;
                    this.size.height = 256;
                }

                this.drawDecal();
            });
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
                font-size: 16px;
                background-color: transparent;
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
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        &:hover {
            .active-skn-name{
                opacity: 1.0;
            }
        }

        .activate {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .active-skn-name {
            &[always] {
                opacity: 1.0;
            }

            opacity: 0.0;
            padding-top: 4px;
            word-wrap: break-word;
            text-align: center;
            font-family: @dv-f-geomanist;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: @dv-c-foreground;
            transition: opacity 0.125s ease-in;
            padding-bottom: 6px;
            background: fade(@dv-c-background, 80%);
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
            position: absolute;
            top: 0;
            left: 0;
            
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
 