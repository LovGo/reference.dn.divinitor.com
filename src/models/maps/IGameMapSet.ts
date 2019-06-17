import IUiStringMessage from '../uistring/IUiStringMessage';
import { IGateOption } from './IGameMap';

export default interface IGameMapSet {
    id: number;
    title: IUiStringMessage;
    options: IGateOption[];
    slayerOption: IGateOption|null;
    stageSetType: StageSetType;
}

export enum StageSetType {

}
