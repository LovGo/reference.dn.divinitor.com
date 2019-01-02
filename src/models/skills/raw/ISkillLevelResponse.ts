import ISkillLevel from '../ISkillLevel';

export interface ISkillLevelResponse {
    pve: ISkillLevel[];
    pvp: ISkillLevel[];
}
