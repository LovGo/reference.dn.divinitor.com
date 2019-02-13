import { Vector3 } from 'three';
import IMshEntry from '@/models/3d/msh/IMshEntry';
import ITypedMap from '@/models/util/ITypedMap';

export default interface IMsh {
    magicNumber: string;
    version: number;
    numEntries: number;
    bbMin: Vector3;
    bbMax: Vector3;
    numBones: number;
    numHitboxes: number;
    numAttachments: number;
    entries: IMshEntry[];
    bones: ITypedMap<Float32Array>
}
