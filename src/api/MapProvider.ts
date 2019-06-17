import IGameMap, { IGateInfo, GATE_COUNT, GATE_PROP_COUNT, IGateOption, TOOL_COUNT, IToolEntry } from '@/models/maps/IGameMap';
import { ensureRegion } from './RegionProvider';
import TableProvider from './TableProvider';
import IMapTableResponse from '@/models/maps/raw/IMapTableResponse';
import FileProvider from './FileProvider';
import ITypedMap from '@/models/util/ITypedMap';
import UiStringProvider from './UiStringProvider';
import IUiStringMessage from '@/models/uistring/IUiStringMessage';
import RequestCache from '@/models/util/RequestCache';

export interface IMapProvider {
    getMap(id: number, region?: string): Promise<IGameMap>;
}

class MapProvider implements IMapProvider {
    private _mapCache: ITypedMap<IGameMap>;
    private _mapRequestCache: RequestCache<IGameMap>;

    constructor() {
        this._mapCache = {};
        this._mapRequestCache = new RequestCache();
    }

    public async getMap(id: number, region?: string): Promise<IGameMap> {
        region = ensureRegion(region);
        const cacheKey = this._cacheKey(id, region);
        const cached = this._mapCache[cacheKey];
        if (cached) {
            return cached;
        }

        return this._mapRequestCache.tryCache(cacheKey, async () => {
            const ret = await this._getMap(id, region!);
            this._mapCache[cacheKey] = ret;
            return ret;
        });
    }

    private async _getMap(id: number, region: string): Promise<IGameMap> {
        const rawMap = await TableProvider.getTableRow<IMapTableResponse>('maptable', id, region);
        const files = await FileProvider.getFileNamesById([
            rawMap._BattleBGM,
            rawMap._BossBGM,
            rawMap._NestBGM,
            rawMap._BattleBGMAbyss,
            rawMap._BossBGMAbyss,
            rawMap._NestBGMAbyss,
            rawMap._LoadingImage,
            rawMap._MapOverImage,
        ]);

        const extract = (id: number) => this._extractOrDefault(id, files, (v) => v.name);

        const uistring = async (mid: number) => {
            try {
                return await UiStringProvider.get(mid, region);
            } catch {
                return {
                    id: mid,
                    message: `[MID:${mid}]`,
                };
            }
        };

        let gates: IGateInfo[] = await this._extractGateInfo(rawMap, uistring);

        const toolEntries: IToolEntry[] = this._extractToolInfo(rawMap);

        const ret: IGameMap = {
            id: rawMap.id,
            allowFreePass: rawMap._AllowFreePass,
            allowMapType: rawMap._AllowMapType,
            allowPet: rawMap._PetMode,
            allowVehicle: rawMap._VehicleMode,
            autoPickupGold: rawMap._AutoGetGold,
            battleBGM: extract(rawMap._BattleBGM),
            battleBGMAbyss: extract(rawMap._BattleBGMAbyss),
            battlefield: rawMap._IsBattleField,
            bossBGM: extract(rawMap._BossBGM),
            bossBGMAbyss: extract(rawMap._BossBGMAbyss),
            enterConditionTableId: rawMap._EnterConditionTableID,
            ftg: {
                ableFtg: rawMap._AbleFatigue,
                easy: rawMap._FatigueEasy,
                hard: rawMap._FatigueHard,
                master: rawMap._FatigueMaster,
                abyss: rawMap._FatigueAbyss,
                hell: rawMap._FatigueHell,
                chaos: rawMap._FatigueChaos,
            },
            gates: gates,
            hidePet: rawMap._PetStealth,
            includeBuild: rawMap._IncludeBuild,
            levelUi: await uistring(rawMap._LevelUIString),
            loadingImage: extract(rawMap._LoadingImage),
            mapAreaIds: (rawMap._MapArea || '').split(';').map(Number),
            mapInfo: await uistring(rawMap._MapInfoString),
            mapSubType: rawMap._MapSubType,
            mapType: rawMap._MapType,
            maxClearCount: rawMap._MaxClearCount,
            minimapOverlayImage: extract(rawMap._MapOverImage),
            name: await uistring(rawMap._MapNameID),
            nestBGM: extract(rawMap._NestBGM),
            nestBGMAbyss: extract(rawMap._NestBGMAbyss),
            partyMatchingList: rawMap._PartyMatchingList,
            returnVillage: rawMap._ReturnVillage,
            summary: await uistring(rawMap._SummaryStringID),
            allowRejoin: rawMap._UserReturnSystem,
            vipClearCount: rawMap._VipClear,
            weatherId: rawMap._WeatherID,
            toolEntries: toolEntries,
        };

        return ret;
    }

    private async _extractGateInfo(map: IMapTableResponse, uistring: (mid: number) => Promise<IUiStringMessage>): Promise<IGateInfo[]> {
        let gates: IGateInfo[] = [];
        const anyMap = map as any;
        for (let i = 1; i <= GATE_COUNT; ++i) {
            const mapIndexKey = `_Gate${i}_MapIndex`;
            const mapIndexTxtKey = mapIndexKey + '_txt';
            const startGateKey = `_Gate${i}_StartGate`;
            const startGateTxtKey = startGateKey + '_txt';
            const titleKey = `_Gate${i}_Title`;

            const mapIndex = (anyMap[mapIndexTxtKey] || anyMap[mapIndexKey]) || '';
            if (mapIndex) {
                const startGates = ((anyMap[startGateTxtKey] || anyMap[startGateKey]) || '').split(';').map((v: string) => Number(v));
                const mapIndices = mapIndex.split(';').map((v: string) => Number(v));
                let options: IGateOption[] = [];
                for (let k = 0; k < startGates.length && k < mapIndices.length; ++k) {

                    options.push({
                        mapId: Number(mapIndices[k]),
                        startGate: startGates[k],
                    });
                }

                const title = (anyMap[titleKey] || 0) as number;
                const titleMsg = await uistring(title);
                const props: number[] = [];

                for (let p = 1; p <= GATE_PROP_COUNT; ++p) {
                    const propKey = `_Gate${i}_PropIndex${p}`;
                    const prop = anyMap[propKey];
                    if (prop) {
                        props.push(Number(prop));
                    }
                }

                if (props.length) {
                    gates.push({
                        title: titleMsg,
                        gatePropIds: props,
                        options: options,
                    });
                }
            }
        }

        return gates;
    }

    private _extractToolInfo(map: IMapTableResponse): IToolEntry[] {
        const toolEntries: IToolEntry[] = [];
        const anyMap = map as any;
        for (let i = 1; i <= TOOL_COUNT; ++i) {
            const nameKey = `_ToolName${i}`;
            const indexKey = `_ToolNameIndex${i}`;
            const name = anyMap[nameKey] as string;
            if (name || i === 1) {
                const index = anyMap[indexKey] as number;
                toolEntries.push({
                    toolName: name,
                    redirectMapId: index,
                });
            }
        }

        return toolEntries;
    }

    private _extractOrDefault<T extends {id: number}>(id: number, t: T[], tt: (t: T) => string, def: string = '') {
        for (let v of t) {
            if (v.id === id) {
                return tt(v);
            }
        }

        return def;
    }

    private _cacheKey(id: number, region: string) {
        return `${id}-${region}`;
    }
}

export default new MapProvider() as IMapProvider;