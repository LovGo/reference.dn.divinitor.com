import ITableRow from '@/models/table/ITableRow';
import { int, double } from '@/models/util/DntTypes';

export default interface IStateEffectTableRow extends ITableRow {
    _StaticName: string;
    _StateEffectIndex: int;
    _ShowTimingType: ShowTimingType;
    _EffectOutputType: EffectOutputType;
    _EffectPlayType: EffectPlayType;
    _EffectSkinFileName: int;
    _EffectSkinFileName_file?: string;
    _EffectAniFileName: int;
    _EffectAniFileName_file?: string;
    _EffectActFileName: int;
    _EffectActFileName_file?: string;
    _ActorActionName: string;
    _UseDiffuseVariation: int;
    _DiffuseR1: double;
    _DiffuseG1: double;
    _DiffuseB1: double;
    _DiffuseR2: double;
    _DiffuseG2: double;
    _DiffuseB2: double;
    _DiffuseChangeSpeed: double;
    _LinkBoneIndex: string;
    _ContentsID: string;
    _SetParent: boolean;
}

export enum ShowTimingType {
    /**
     * Show for the duration of the state effect
     */
    ALL_TIME = 0,
    /**
     * @deprecated
     */
    OWNER_HANDLING,
}

export enum EffectOutputType {
    /**
     * Attach to the Bip01 bone (or the root bone? Bip01 happens to be the root of most)
     */
    ATTACH = 0,
    
    /**
     * Unknown/unused
     */
    DO_ACTION,
    
    /**
     * Attach to a FX dummy bone
     */
    DUMMY_BONE_ATTACH,
}

/**
 * Doesn't appear to be supported
 */
export enum EffectPlayType {
    REPEAT = 0,
    ONCE,
    PART_REPEAT,
}
