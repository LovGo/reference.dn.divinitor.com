import IUiStringMessage from '../uistring/IUiStringMessage';
import { ElementalType, ElementalTypeString } from '../common/ElementalType';
import { InterpolationEndingModes } from 'three';

export default interface ILegacyMonster {
    id: number;
    baseStats: ILegacyMonsterBaseStats;
    difficulties: ILegacyMonsterDifficulty[];
    name: IUiStringMessage;
    level: number;
    elementalType: ElementalTypeString;
    actor: ILegacyMonsterActor;
    weaponMainhandId: number;
    weaponOffhandId: number;
    skillTableId: number;
    immunities: ILegacyMonsterImmunity[];
    itemDropGroupId: number;
    monsterRaceId: number;
}

export interface ILegacyMonsterBaseStats {
    hp: number;
    pdmg: {
        min: number;
        max: number;
    };
    mdmg: {
        min: number;
        max: number;
    };
    pdef: number;
    mdef: number;
    para: number;
    crit: number;
    stun: number;
    paraResist: number;
    critResist: number;
    stunResist: number;
    eleAtk: number;
    fireDef: number;
    iceDef: number;
    lightDef: number;
    darkDef: number;
}

export type ILegacyMonsterDifficultyMultipliers = ILegacyMonsterBaseStats;

export interface ILegacyMonsterDifficulty {
    id: number;
    difficulty: number;
    aiScript: string;
    statWeights: ILegacyMonsterDifficultyMultipliers;
}

export interface IActorFile {
    id: number;
    name: string;
}

export interface ILegacyMonsterActor {
    id: number;
    staticName: string;
    classId: number;
    skn: IActorFile;
    ani: IActorFile;
    act: IActorFile;
    cam: IActorFile;
}

export interface ILegacyMonsterImmunity {
    stateEffectId: number;
    immuneRateInt: number;
}
