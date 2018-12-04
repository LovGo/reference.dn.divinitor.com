import IUiStringMessage from '../uistring/IUiStringMessage';
import IIconInfo from '../util/IIconInfo';
import { ItemRank } from './ItemEnums';

export default interface IItemStub {
    id: number;
    name: IUiStringMessage;
    icon: IIconInfo;
    rank: ItemRank;
}