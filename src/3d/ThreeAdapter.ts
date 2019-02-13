import ISkn from '@/models/3d/skn/ISkn';
import IMsh from '@/models/3d/msh/IMsh';
import * as THREE from 'three';
import IMshEntry, { isAnimatedMode, isTriangleStripMode } from '@/models/3d/msh/IMshEntry';
import ITypedMap from '@/models/util/ITypedMap';
import { SknParameterName, SknParameterType, IStringSknParameter, IFloatSknParameter } from '@/models/3d/skn/ISknParameter';
import ISknEntry from '@/models/3d/skn/ISknEntry';
import FileProvider from '@/api/FileProvider';
// @ts-ignore
import { DDSLoader } from 'three-addons';
import IGroupUserData from '@/models/3d/IGroupUserData';

export interface IThreeAdapter {
    asGroup(skn: ISkn, msh: IMsh): Promise<THREE.Group>;
}

class ThreeAdapter implements IThreeAdapter {
    public async asGroup(skn: ISkn, msh: IMsh): Promise<THREE.Group> {
        const group = new THREE.Group();
        group.name = skn.mshName;

        let bbox: THREE.Box3|null = null;

        for (const index in skn.entries) {
            const entry = skn.entries[index];
            // Find corrosponding msh entry
            const mshEntry = msh.entries[index];
            if (mshEntry) {
                const geometry = this._toGeometry(mshEntry, msh);

                const geoBox = geometry.boundingBox;
                if (bbox == null) {
                    bbox = new THREE.Box3(
                        new THREE.Vector3(geoBox.min.x, geoBox.min.y, geoBox.min.z),
                        new THREE.Vector3(geoBox.max.x, geoBox.max.y, geoBox.max.z)
                    );
                } else {
                    if (geoBox.min.x < bbox.min.x) {
                        bbox.min.x = geoBox.min.x;
                    }
                    if (geoBox.min.y < bbox.min.y) {
                        bbox.min.y = geoBox.min.y;
                    }
                    if (geoBox.min.z < bbox.min.z) {
                        bbox.min.z = geoBox.min.z;
                    }
                    if (geoBox.max.x < bbox.max.x) {
                        bbox.max.x = geoBox.max.x;
                    }
                    if (geoBox.max.y < bbox.max.y) {
                        bbox.max.y = geoBox.max.y;
                    }
                    if (geoBox.max.z < bbox.max.z) {
                        bbox.max.z = geoBox.max.z;
                    }
                }

                let material = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF,
                    wireframe: true,
                    roughness: 0.5,
                    transparent: true,
                });

                // Load textures asynchronously but don't block on it
                this._prepareMaterial(entry, material);

                let threeMsh = new THREE.Mesh(geometry, material);
                if (isTriangleStripMode(mshEntry.flags)) {
                    threeMsh.drawMode = THREE.TriangleStripDrawMode;
                }
                if (isAnimatedMode(mshEntry.flags)) {
                    material.skinning = true;
                }

                threeMsh.receiveShadow = true;
                threeMsh.castShadow = true;

                group.add(threeMsh);
            } else {
                console.warn("Missing msh for skn entry: " + entry.name);
            }
        }

        group.castShadow = true;
        group.receiveShadow = true;
        const userData: IGroupUserData = {
            bbox,
        };

        group.userData = userData;

        return Promise.resolve(group);
    }

    private _toGeometry(entry: IMshEntry, msh: IMsh): THREE.BufferGeometry {
        const ret = new THREE.BufferGeometry();

        ret.setIndex(new THREE.BufferAttribute(entry.faceIndices, 1));
        ret.addAttribute("position", new THREE.BufferAttribute(entry.verts, 3));
        ret.addAttribute("normal", new THREE.BufferAttribute(entry.normals, 3, true));
        ret.addAttribute("uv", new THREE.BufferAttribute(entry.texCoords, 2));

        if (isTriangleStripMode(entry.flags)) {
            
        }

        if (isAnimatedMode(entry.flags) && entry.boneIndicies && entry.boneWeights) {
            // Remap SknIndx
            let mapping: number[] = new Array(entry.boneNames.length);
            
            let nameToIndex: ITypedMap<number> = {};
            Object.keys(msh.bones).forEach((v, i) => nameToIndex[v] = i);
            
            for (let i = 0; i < entry.boneNames.length; ++i) {
                mapping[i] = nameToIndex[entry.boneNames[i]];
            }

            let sknIndxs = new Uint16Array(entry.boneIndicies.map((v) => mapping[v]));

            ret.addAttribute("skinIndex", new THREE.BufferAttribute(sknIndxs, 4));
            ret.addAttribute("skinWeight", new THREE.BufferAttribute(entry.boneWeights, 4));
        }

        ret.computeBoundingBox();
        ret.computeBoundingSphere();

        return ret;
    }

    private async _prepareMaterial(sknEntry: ISknEntry, material: THREE.MeshStandardMaterial): Promise<void> {
        const diffuse = sknEntry.parameters[SknParameterName.DIFFUSE_TEX];
        if (diffuse && diffuse.type === SknParameterType.STRING) {
            const diffuseParam = diffuse as IStringSknParameter;
            const textureName = diffuseParam.stringVal.toLowerCase();

            const txUrl = await FileProvider.getFileUrl(textureName, undefined, true) + "?ct=" + encodeURIComponent("image/vnd-ms.dds");
            const loader = new DDSLoader();
            loader.crossOrigin = "use-credentials";

            const promise = new Promise<THREE.CompressedTexture>(
                (resolve, reject) => loader.load(txUrl, resolve, undefined, reject)
            );
            try {
                const tx = await promise;
                tx.wrapS = THREE.RepeatWrapping;
                tx.wrapT = THREE.RepeatWrapping;

                material.map = tx;
                material.wireframe = false;
                material.needsUpdate = true;
            } catch (e) {
                console.error(e);
            }
        }

        const mask = sknEntry.parameters[SknParameterName.MASK_TEX];
        if (mask && mask.type === SknParameterType.STRING) {
            const maskParam = mask as IStringSknParameter;
            const textureName = maskParam.stringVal.toLowerCase();

            const txUrl = await FileProvider.getFileUrl(textureName, undefined, true) + "?ct=" + encodeURIComponent("image/vnd-ms.dds");
            const loader = new DDSLoader();
            loader.crossOrigin = "use-credentials";

            const promise = new Promise<THREE.CompressedTexture>(
                (resolve, reject) => loader.load(txUrl, resolve, undefined, reject)
            );
            try {
                const tx = await promise;
                tx.wrapS = THREE.RepeatWrapping;
                tx.wrapT = THREE.RepeatWrapping;

                material.metalness = 0.75;
                material.metalnessMap = tx;
                material.needsUpdate = true;
            } catch (e) {
                console.error(e);
            }
        }

        let emissivePowerVal = 0.5;
        const emissivePower = sknEntry.parameters[SknParameterName.EMISSIVE_POWER];
        if (emissivePower && emissivePower.type === SknParameterType.FLOAT) {
            emissivePowerVal = (emissivePower as IFloatSknParameter).floatVal;
        }

        const emissive = sknEntry.parameters[SknParameterName.DIFFUSE_TEX];
        if (emissive && emissive.type === SknParameterType.STRING) {
            const emissiveParam = emissive as IStringSknParameter;
            const textureName = emissiveParam.stringVal.toLowerCase();

            const txUrl = await FileProvider.getFileUrl(textureName, undefined, true) + "?ct=" + encodeURIComponent("image/vnd-ms.dds");
            const loader = new DDSLoader();
            loader.crossOrigin = "use-credentials";

            const promise = new Promise<THREE.CompressedTexture>(
                (resolve, reject) => loader.load(txUrl, resolve, undefined, reject)
            );
            try {
                const tx = await promise;
                tx.wrapS = THREE.RepeatWrapping;
                tx.wrapT = THREE.RepeatWrapping;

                material.emissive = new THREE.Color(0x7F7F7F);
                material.emissiveIntensity = emissivePowerVal;
                material.emissiveMap = tx;
                material.needsUpdate = true;
            } catch (e) {
                console.error(e);
            }
        }
    }
}

export default new ThreeAdapter() as IThreeAdapter;
