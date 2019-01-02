import { ItemType } from './ItemEnums';

export default interface IItemType {
    id: number;
    type: ItemType;
    param1: number;
    param2: number;
    param3: number;
    [propName: string]: number;
}
