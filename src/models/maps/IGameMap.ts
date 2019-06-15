import IUiStringMessage from '../uistring/IUiStringMessage';

export default interface IGameMap {
    id: string;
    name: IUiStringMessage;
    mapType: MapType;
    mapSubType: MapSubType;
    enterConditionTableId: string;
    toolEntries: IToolEntry[];
    battleBGM: string;
    bossBGM: string;
    nestBGM: string;
    battleBGMAbyss: string;
    bossBGMAbyss: string;
    nestBGMAbyss: string;
    loadingImage: string;
    battlefield: boolean;
    includeBuild: boolean;
    weatherId: string;
    mapAreaIds: string[];
    allowMapType: number;
    allowVehicle: boolean;
    allowPet: boolean;
    hidePet: boolean;
    levelUi: IUiStringMessage;
    mapInfo: IUiStringMessage;
    minimapOverlayImage: string;
    autoPickupGold: boolean;
    partyMatchingList: number;
    maxClearCount: number;
    vipExtraClearCount: number;
    summary: IUiStringMessage;
    ftg: IFtgInfo;
    returnVillage: boolean;
    userReturnSystem: boolean;
    allowFreePass: boolean;
}

export enum MapType {

}

export enum MapSubType {

}

export interface IToolEntry {
    name: string;
    index: number;
}

export const TOOL_COUNT: number = 15;

export interface IGateInfo {
    title: IUiStringMessage;
    options: IGateOption[];
    gatePropIds: number[];
}

export interface IGateOption {
    mapId: string;
    startGate: number;
}

export const GATE_COUNT = 15;

export const GATE_PROP_COUNT = 10;

export interface IFtgInfo {
    decFtg: number;
    easy: number;
    hard: number;
    master: number;
    abyss: number;
    chaos: number;
    hell: number;
}
