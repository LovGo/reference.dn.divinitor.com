import ISkillEffectValue from './ISkillEffectValue';
import IUiStringMessage from '../uistring/IUiStringMessage';

export default interface ISkillLevel {
    id: number;
    skillId: number;
    level: number;
    effectValues: ISkillEffectValue[];
    requiredLevel: number;
    cooldown: number;
    addRange: number; // ?
    requiredItemId: number;
    // requiredItem?: IItemStub;
    requiredItemCount: number;
    hpCost: number;
    skillDesc: IUiStringMessage;
    skillDescParam: string;
    stateEffectIds: number[];
    stateEffectOtherIds: number[];
    canUseParams: string[];
    processParams: string[];
    applyTargetType: number;
    hpConsumeType: number;
    spConsumeType: number;
    needSp: number;
    applyType: number;
    addThreat: number;
    pdmgBoardDamage: number;
    mdmgBoardDamage: number;
}