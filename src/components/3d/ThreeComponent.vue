<template>
<div ref="target" class="three-component" :aaa-style="`width: ${width}px; height: ${height}px;`">
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as THREE from 'three';

import IThreeInstance from '@/3d/IThreeInstance';

interface IData {
    threeInstance: IThreeInstance<THREE.PerspectiveCamera, THREE.WebGLRenderer>|null;
    run: boolean;
    renderHandle: number;
}

export default Vue.extend({
    props: {
        "width": {
            type: Number as () => number,
            default: 640,
        },
        "height": {
            type: Number as () => number,
            default: 480,
        },
    },
    data(): IData {
        return {
            threeInstance: null,
            run: false,
            renderHandle: -1,
        };
    },
    watch: {
        width(v1, v2) {
            if (v1 !== v2) {
                this.resize();
            }
        },
        height(v1, v2) {
            if (v1 !== v2) {
                this.resize();
            }
        }
    },
    mounted() {
        this.threeInstance = {
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera(90, this.width / this.height, 0.1, 1000),
            renderer: new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
            }),
        };
        this.threeInstance.renderer.setSize(this.width, this.height);
        const element = this.$refs.target as HTMLElement;
        element.appendChild(this.threeInstance.renderer.domElement);

        this.$emit("setup", this.threeInstance);

        this.run = true;
        this.renderFrame();
    },
    beforeDestroy() {
        window.cancelAnimationFrame(this.renderHandle);
    },
    methods: {
        resize() {
            if (this.threeInstance) {
                const { camera, renderer } = this.threeInstance;
                camera.aspect = this.width / this.height;
                camera.updateProjectionMatrix();
                renderer.setSize(this.width, this.height);
            }
        },
        renderFrame() {
            if (!this.run) {
                return;
            }

            if (this.threeInstance) {
                this.$emit("frame", this.threeInstance);

                this.threeInstance.renderer.render(this.threeInstance.scene, this.threeInstance.camera);
            }

            this.renderHandle = window.requestAnimationFrame(() => this.renderFrame());
        },
    }
});
</script>

<style lang="less" scoped>
.three-component {
    position: relative;
}
</style>
