import IUiStringMessage from '../uistring/IUiStringMessage';
import IItemStub from './IItemStub';

export default interface IItemSet {
    id: number;
    description: IUiStringMessage;
    items: IItemStub[];
}
