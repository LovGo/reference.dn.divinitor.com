<template>
<div class="item3dview">
    <div class="loading" v-if="loading && !error">
        Loading
    </div>
    <div class="error" v-if="error">
        {{ error }}
    </div>
    <div class="campos">
        {{ cam.x | thousandsFloor }} {{ cam.y | thousandsFloor }} {{ cam.z | thousandsFloor }}
        <br/>
        {{ camLook.x | thousandsFloor }} {{ camLook.y | thousandsFloor }} {{ camLook.z | thousandsFloor }}
        <br/>
        {{ parts }}
    </div>
    <three-component 
        :key="part.sknName"
        @setup="onCreated" 
        @frame="onFrame" 
        :width="width" 
        :height="height"
    />
    <div class="disclaim">Feature under development</div>
</div>
</template>


<script lang="ts">
import Vue from 'vue';
import * as THREE from 'three';

import ThreeComponent from "@/components/3d/ThreeComponent.vue";

import IThreeInstance from "@/3d/IThreeInstance";
import IItemPart from "@/old/items/IItemPart"

import SknLoader from "@/3d/SknLoader";
import FileProvider from "@/api/FileProvider";
import MshParser from '@/3d/MshParser';
import ThreeAdapter from '@/3d/ThreeAdapter';
import IGroupUserData from '@/models/3d/IGroupUserData';

interface IItemType {
    typeId: number;
    type: string;
}

interface IItemParts {
    id: number,
    type: string;
    pType: string;
    wType: string;
}

interface IData {
    loading: boolean;
    group: THREE.Object3D|null;
    dummy: THREE.Object3D;
    error: string;
    cam: THREE.Vector3,
    camLook: THREE.Vector3,
}

function rads(deg: number): number {
    return deg * Math.PI/180;
}

export default Vue.extend({
    components: {
        ThreeComponent,
    },
    data(): IData {
        return {
            loading: true,
            group: null,
            dummy: new THREE.Object3D(),
            error: "",
            cam: new THREE.Vector3(),
            camLook: new THREE.Vector3(),
        };
    },
    props: {
        "width": {
            type: Number as () => number,
        },
        "height": {
            type: Number as () => number,
        },
        "parts": {
            type: Object as () => IItemParts,
        },
        "part": {
            type: Object as () => IItemPart,
        },
        "type": {
            type: Object as () => IItemType,
        },
    },
    methods: {
        async onCreated(instance: IThreeInstance<THREE.PerspectiveCamera, THREE.WebGLRenderer>) {
            try {
                const { camera, scene, renderer } = instance;
                renderer.setClearColor(new THREE.Color(0x00000000), 0);

                const axesHelper = new THREE.AxesHelper(50);
                axesHelper.name = "globalaxis";
                // scene.add(axesHelper);
                
                const skn = await SknLoader.loadSkn(this.part.sknName);
                const rawMsh = await FileProvider.getFile(skn.mshName);

                const msh = await MshParser.parse(rawMsh);

                this.group = await ThreeAdapter.asGroup(skn, msh);

                const axesHelper2 = new THREE.AxesHelper(10);
                // this.group.add(axesHelper2);

                let userData = this.group.userData as IGroupUserData|null;
                let bbMax = msh.bbMax;
                let bbMin = msh.bbMin;

                if (userData && userData.bbox) {
                    bbMax = userData.bbox.max;
                    bbMin = userData.bbox.min;
                }

                // Dimensions
                const w = bbMax.x - bbMin.x;
                const h = bbMax.y - bbMin.y;
                const d = bbMax.z - bbMin.z;

                // Midpoint
                const xh = bbMin.x + w / 2;
                const yh = bbMin.y + h / 2;
                const zh = bbMin.z + d / 2;

                // Center the model
                this.group.position.x = -xh;
                this.group.position.y = -yh;
                this.group.position.z = -zh;

                // Max dimension
                const fov = camera.fov * (Math.PI / 180);
                let dist = Math.abs(Math.max(w, h) / Math.sin(fov / 2)) * 0.5;

                let xx = xh;
                let yy = yh;
                let zz = dist;

                let xc = xh;
                let yc = yh;
                let zc = zh;

                if (this.parts.type === "ACTOR") {
                    this.group.position.x = 0;
                    this.group.position.z = 0;
                    dist *= 2;
                }

                // Transform if needed
                switch(this.parts.pType) {
                    case "WINGS": {
                        this.group.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), rads(90));
                        this.group.position.x = 0;
                        this.group.position.z = 0;
                        break;
                    }
                    case "TAIL": {
                        this.group.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), rads(-90));
                        dist *= 2;
                        this.group.position.x = 0;
                        this.group.position.y = h / 2;
                        this.group.position.z = 0;
                        break;
                    }
                    case "SPIRIT": {
                        this.group.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), rads(180));
                        this.group.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), rads(90));
                        dist = 25;
                        this.group.position.x = 33;
                        this.group.position.y = -105;
                        this.group.position.z = 10;
                        break;
                    }
                    case "HAIR_BODY":
                    case "HEAD": {
                        this.group.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rads(180));
                        dist *= 1.5;
                        break;
                    }
                }
                
                switch (this.parts.wType) {
                    case "SPEAR":
                    case "LENCEA_26": {
                        this.group.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), rads(180));
                        this.group.position.y *= -1;
                        break;
                    }
                    case "FAN":
                    case "CHAKRAM": {
                        this.group.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), rads(-90));
                        this.group.position.x = 0;
                        this.group.position.y = -zh;
                        this.group.position.z = 0;
                        break;
                    }
                    case "SHIELD": {
                        this.group.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), rads(90));
                        this.group.position.x = 0;
                        this.group.position.y = -zh;
                        this.group.position.z = 0;
                        break;
                    }
                    case "CANNON":
                    case "BUBBLEBLASTER": {
                        this.group.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), rads(-90));
                        this.group.position.x = 0;
                        this.group.position.y = zh;
                        this.group.position.z = yh;
                        break;
                    }
                    case "PUPPET":
                    case "ORB": {
                        this.group.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), rads(90));
                        this.group.position.x = 0;
                        this.group.position.y = -xh;
                        this.group.position.z = 0;
                        break;
                    }
                    case "SHORTBOW":
                    case "LONGBOW":
                    case "GAUNTLET": {
                        dist *= 2;
                        break;
                    }

                }

                camera.position.x = 0;
                camera.position.y = dist / 4;
                camera.position.z = dist * 1.5;

                camera.lookAt(0, 0, 0);
                this.cam = camera.position;
                this.camLook.x = 0;
                this.camLook.y = 0;
                this.camLook.z = dist / 4;

                const light = new THREE.DirectionalLight(0xFFFFFF, 0.675);
                light.position.x = camera.position.x;
                light.position.y = camera.position.y;
                light.position.z = camera.position.z;
                light.lookAt(xc, yc, zc);
                light.castShadow = true;
                light.shadow.mapSize.width = 512;
                light.shadow.mapSize.height = 512;
                light.shadow.camera.near = 1;
                light.shadow.camera.far = 400;
                light.shadow.camera.left = light.shadow.camera.bottom = -300;
                light.shadow.camera.right = light.shadow.camera.top = 300;
                scene.add(light);

                const ambient = new THREE.AmbientLight(0xFFFFFF, 0.45);
                scene.add(ambient);

                this.dummy.add(this.group);
                scene.add(this.dummy);

                this.loading = false;
            } catch (e) {
                console.error(e);
                this.error = "Error loading model";
            }
        },
        onFrame(instance: IThreeInstance<THREE.PerspectiveCamera, THREE.WebGLRenderer>) {
            const { camera, scene, renderer } = instance;

            if (this.group) {
                this.dummy.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.01);
            }
        },
    }
});
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item3dview {
    position: relative;
    .loading {
        position: absolute;
        top: 49%;
        left: 0;
        right: 0;
        width: 100%;
        text-align: center;

        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.1em;
    }

    .error {
        position: absolute;
        top: 49%;
        left: 0;
        right: 0;
        width: 100%;
        text-align: center;

        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.1em;
        color: @dv-c-red;
    }

    .campos {
        position: absolute;
        top: 10px;
        left: 0;
        right: 0;
        width: 100%;
        text-align: center;
        font-size: 10px;
        letter-spacing: 0.05em;
        opacity: 0;
    }

    .disclaim {
        position: absolute;
        bottom: 10px;
        left: 0;
        right: 0;
        width: 100%;
        text-align: center;

        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.1em;
        color: @dv-c-red;
    }
}
</style>

