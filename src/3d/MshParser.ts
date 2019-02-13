import IMsh from '@/models/3d/msh/IMsh';
import LittleEndianDataView from '@/util/LittleEndianDataView';
import DataStream from '@/util/DataStream';
import { Vector3, Group } from 'three';
import ITypedMap from '@/models/util/ITypedMap';
import IMshEntry, { isUnknown3Mode, isAnimatedMode } from '@/models/3d/msh/IMshEntry';


export interface IMshParser {
    parse(buf: ArrayBuffer): Promise<IMsh>;
}

class MshParser implements IMshParser {

    public async parse(buf: ArrayBuffer): Promise<IMsh> {
        let dv = new LittleEndianDataView(new DataView(buf));
        let ds = new DataStream(dv);
        
        // Skip magic
        ds.offset = 256;

        let version = ds.readUint32();
        let numEntries = ds.readUint32();
        
        // Skip unknowns
        ds.offset += 8;
        
        let bbMin: Vector3 = new Vector3(ds.readFloat32(), ds.readFloat32(), ds.readFloat32());
        let bbMax: Vector3 = new Vector3(ds.readFloat32(), ds.readFloat32(), ds.readFloat32());
        let numBones = ds.readUint32();
        let numHitboxes = ds.readUint32();
        let numAttachments = ds.readUint32();
        
        // Skip unknowns
        ds.offset += 716;

        let bones = this._readBones(ds, numBones);

        let entries = [];
        for (let i = 0; i < numEntries; ++i) {
            entries.push(this._readEntry(ds));
        }

        let ret: IMsh = {
            magicNumber: "Msh",
            version,
            numEntries,
            bbMin,
            bbMax,
            numBones,
            numHitboxes,
            numAttachments,
            entries,
            bones,
        };

        return Promise.resolve(ret);
    }

    private _readBones(ds: DataStream, numBones: number): ITypedMap<Float32Array> {
        let ret: ITypedMap<Float32Array> = {};
        const dec = new TextDecoder("utf-8");
        for (let i = 0; i < numBones; ++i) {
            const arr = new Float32Array(16);
            const boneName = ds.readFixedLengthString(256);
            ds.readFloat32Array(arr);
            ret[boneName] = arr;
        }

        return ret;
    }

    private _readEntry(ds: DataStream): IMshEntry {
        let sceneName = ds.readFixedLengthString(256);
        let meshName = ds.readFixedLengthString(256);
        let numVert = ds.readUint32();
        let numInd = ds.readUint32();
        ds.offset += 4;
        let flags = ds.readUint32();
        ds.offset += 496;

        let faceIndices = new Uint16Array(numInd);
        ds.readUint16Array(faceIndices);

        let verts = new Float32Array(numVert * 3);
        ds.readFloat32Array(verts);

        let normals = new Float32Array(numVert * 3);
        ds.readFloat32Array(normals);

        let texCoords = new Float32Array(numVert * 2);
        ds.readFloat32Array(texCoords);

        if (isUnknown3Mode(flags)) {
            ds.offset += numVert * Uint32Array.BYTES_PER_ELEMENT * 4;
        }

        const ret: IMshEntry = {
            sceneName,
            meshName,
            numVert,
            numInd,
            flags,
            faceIndices,
            verts,
            normals,
            texCoords,
            boneNames: [],
        };

        if (isAnimatedMode(flags)) {
            let boneIndices = new Uint16Array(numVert * 4);
            ds.readUint16Array(boneIndices);
            ret.boneIndicies = boneIndices;

            let boneWeights = new Float32Array(numVert * 4);
            ds.readFloat32Array(boneWeights);
            ret.boneWeights = boneWeights;

            let numBoneNames = ds.readUint32();
            for (let i = 0; i < numBoneNames; ++i) {
                ret.boneNames.push(ds.readFixedLengthString(256));
            }
        }

        return ret;
    }
}

export default new MshParser() as IMshParser;
