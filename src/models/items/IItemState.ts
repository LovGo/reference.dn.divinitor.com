import { ItemState } from './ItemEnums';

export default interface IItemState {
    id: number;
    state: ItemState;
    value: number;
}
