export default interface IMshEntry {
    sceneName: string;
    meshName: string;
    numVert: number;
    numInd: number;
    flags: number;
    boneNames: string[];
    faceIndices: Uint16Array;
    verts: Float32Array;
    normals: Float32Array;
    texCoords: Float32Array;
    boneIndicies?: Uint16Array;
    boneWeights?: Float32Array;
}

export function isUnknown3Mode(mode: number): boolean {
    return (mode & 0x10000) != 0;
}

export function isAnimatedMode(mode: number): boolean {
    return (mode & 0x100) != 0;
}

export function isTriangleStripMode(mode: number): boolean {
    return (mode & 0x1) != 0;
}
