export interface IJobScalingBase {
    jobId: number;
    vitToHp: number;
    strToPhys: number;
    agiToPhys: number;
    intToMagic: number;
    vitToDef: number;
    intToMdef: number;
    scalingVersion: undefined|0|1;
}

export interface IJobScalingV0 extends IJobScalingBase {
    scalingVersion: undefined|0;
    agiToCrit: number;
    strIntToCritDmg: number;
}

export interface IJobScalingV1 extends IJobScalingBase {
    scalingVersion: 1;
    strToCritDmg: number;
    agiToCritDmg: number;
    intToCritDmg: number;
}

export type IJobScaling = IJobScalingBase | IJobScalingV0 | IJobScalingV1;