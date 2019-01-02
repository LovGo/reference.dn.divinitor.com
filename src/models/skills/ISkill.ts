import ISkillStub from './ISkillStub';
import ISkillEffect from './ISkillEffect';
import { SkillDurationType, SkillTargetType } from './SkillEnums';

export default interface ISkill extends ISkillStub {
    requiredWeapons: number[]; //temp type
    effects: ISkillEffect[];
    duplicateSkillId: number;
    dupliciateSkill?: ISkillStub;
    usableCheckers: number[];
    processors: number[];
    locked: boolean; // ?
    price: number;
    duplicatedSkillType: number; // ?
    baseSkillId: number;
    baseSkill?: ISkillStub;
    groupId: number;
    skillGroupId: number;
    globalSkillGroupId: number;
    globalCooldownPvE: number;
    globalCooldownPvP: number;
    iconPriorityLevel: number;
    spLevels: number;
    techLevels: number;
    durationType: SkillDurationType;
    durationTypeStr: string;
    targetType: SkillTargetType;
    targetTypeStr: string;
}