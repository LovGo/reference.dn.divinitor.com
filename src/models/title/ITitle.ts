import IUiStringMessage from '../uistring/IUiStringMessage';
import IItemState from '../items/IItemState';

export default interface ITitle {
    name: IUiStringMessage;
    description: IUiStringMessage;
    requiredLevel: number;
    colorType: number;
    titleType: number;
    color: string;
    skillLinkItemId: number;
    textForegroundColor: string;
    textBackgroundColor: string;
    stats: IItemState[];
}