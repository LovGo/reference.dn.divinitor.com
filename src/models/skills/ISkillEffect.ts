import { SkillEffectApplyType } from './SkillEnums';

export default interface ISkillEffect {
    index: number;
    effectClass: number;
    effectApplyType: SkillEffectApplyType;
    effectApplyTypeStr: string;
}
