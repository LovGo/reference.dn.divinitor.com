import IUiStringMessage from '../uistring/IUiStringMessage';
import IIconInfo from '../util/IIconInfo';
import IJobStub from '../jobs/IJobStub';
import { ElementalType } from '../common/ElementalType';
import { SkillType } from './SkillEnums';

export default interface ISkillStub {
    id: number;
    name: IUiStringMessage;
    internalName: string;
    skillIcon: IIconInfo;
    buffIcon?: IIconInfo;
    debuffIcon?: IIconInfo;
    requiredJobId: number;
    requiredJob?: IJobStub;
    element: ElementalType;
    elementStr: string;
    skillType: SkillType;
    skillTypeStr: string;
}