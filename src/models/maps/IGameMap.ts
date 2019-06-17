import IUiStringMessage from '../uistring/IUiStringMessage';

export default interface IGameMap {
    id: number;
    allowFreePass: boolean;
    allowMapType: number;
    allowPet: boolean;
    allowVehicle: boolean;
    autoPickupGold: boolean;
    battleBGM: string;
    battleBGMAbyss: string;
    battlefield: boolean;
    bossBGM: string;
    bossBGMAbyss: string;
    enterConditionTableId: number;
    ftg: IFtgInfo;
    gates: IGateInfo[];
    hidePet: boolean;
    includeBuild: boolean;
    levelUi: IUiStringMessage;
    loadingImage: string;
    mapAreaIds: number[];
    mapInfo: IUiStringMessage;
    mapSubType: MapSubType;
    mapType: MapType;
    maxClearCount: number;
    minimapOverlayImage: string;
    name: IUiStringMessage;
    nestBGM: string;
    nestBGMAbyss: string;
    partyMatchingList: number;
    returnVillage: boolean;
    summary: IUiStringMessage;
    toolEntries: IToolEntry[];
    allowRejoin: boolean;
    vipClearCount: number;
    weatherId: number;
}

export enum MapType {
    UNKNOWN = 0,
    TOWN_FARM_ARENA_GUILDHOUSE = 1,
    FIELDS_TITLES_TUTORIALS = 2,
    DUNGEONS_NESTS = 3,
}

export enum MapSubType {
    GENERAL = 0,
    NESTS = 1,
    COLOSSEUM_TOWN,
    COLOSSEUM_LOBBY,
    EVENT_DUNGEON,
    FARM,
    DARK_BANQUET,
    ATRIUM_MEZZ_GAZEBO,
    PRACTICE_SOLO_NESTS,
    DARK_GATEWAY_VILLAGE,
    TREASURE_DUNGEON,
    DRAGON_EXPEDITION,
    SAINTS_HAVEN_DEFENSE,
    TRIAL_NEST,
    HEROS_BATTLEFIELD,
    CITADEL_OF_EROSION,
    CITADEL_OF_EROSION_FIELD,
    INFINITE_BATTLEFIELD,
    NIGHTMARE,
    PVE_TRAINING,
    GUILD_HOUSE = 20,
}

export interface IToolEntry {
    toolName: string;
    redirectMapId: number;
}

export const TOOL_COUNT: number = 15;

export interface IGateInfo {
    title: IUiStringMessage;
    options: IGateOption[];
    gatePropIds: number[];
}

export interface IGateOption {
    mapId: number;
    startGate: number;
}

export const GATE_COUNT = 15;

export const GATE_PROP_COUNT = 10;

export interface IFtgInfo {
    /**
     * Whether or not the map can consume FTG
     */
    ableFtg: boolean;
    easy: number;
    hard: number;
    master: number;
    abyss: number;
    chaos: number;
    hell: number;
}
