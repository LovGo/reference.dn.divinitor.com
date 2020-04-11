import ITypedMap from '@/models/util/ITypedMap';
import RequestCache from '@/models/util/RequestCache';
import Store from "@/store";

import { ApiHttpClient } from "@/globals";
import { getFeatureState, netFeatures } from './FeaturesProvider';

export interface IStatCalcResult {
    capped: boolean;
    value: number;
    percent: number;
}

export interface IStatCalcProvider {
    getStatCap(level: number, stat: string, region?: string): Promise<IStatCalcResult>;

    calculatePercent(level: number, stat: string, value: number, region?: string): Promise<IStatCalcResult>;

    calculateValue(level: number, stat: string, percent: number, region?: string): Promise<IStatCalcResult>;
}

export interface IStatCaps {
    level: number;
    defense: number;
    critical: number;
    finalDamage: number;
    criticalDamage: number;
}

const capPercents: ITypedMap<number> = {
    defense: 0.85,
    critical: 0.89,
    finalDamage: getFeatureState(netFeatures.FdOverCap) ? 1.2 : 1.0,
    criticalDamage: 1.0,
};

class StatCalcProvider implements IStatCalcProvider {

    private _cache: ITypedMap<IStatCaps>;
    private _requestCache: RequestCache<IStatCaps>;

    constructor() {
        this._cache = {}
        this._requestCache = new RequestCache();
    }

    public getStatCap(level: number, stat: string, region?: string): Promise<IStatCalcResult> {
        return this.calculateValue(level, stat, capPercents[stat], region);
    }

    public async calculatePercent(level: number, stat: string, value: number, region?: string): Promise<IStatCalcResult> {
        region = this._ensureRegion(region);
        let caps = await this._getStatCaps(level, region);
        let cap = (<ITypedMap<number>><unknown>caps)[stat];
        let maxPercent = capPercents[stat];

        let percent = Math.max(0, Math.min(maxPercent, value / cap));
        return {
            capped: percent == maxPercent,
            percent: percent,
            value: value,
        };
    }

    public async calculateValue(level: number, stat: string, percent: number, region?: string): Promise<IStatCalcResult> {
        region = this._ensureRegion(region);
        let caps = await this._getStatCaps(level, region);
        let cap = (<ITypedMap<number>><unknown>caps)[stat];
        
        let maxPercent = capPercents[stat];
        let adjustedPercent = Math.max(0, Math.min(maxPercent, percent));
        let value = cap * adjustedPercent;

        return {
            capped: percent == maxPercent,
            percent: percent,
            value: value,
        };
    }

    private _getStatCaps(level: number, region: string): Promise<IStatCaps> {
        let key = this._cacheKey(level, region);
        let cached = this._cache[key];
        if (cached) {
            return Promise.resolve(cached);
        }
        
        return this._requestCache.tryCache(key, async () => {
            let result = await ApiHttpClient.get<ITypedMap<any>>(`/server/${region}/tables/playercommonleveltable/${level}`);
            let data = result.data;

            const ret: IStatCaps = {
                level: data.id,
                defense: data._Cdefense,
                critical: data._Ccritical,
                finalDamage: data._Cfinaldamage,
                criticalDamage: data._CcriticalDamage,
            };

            this._cache[key] = ret;

            return ret;
        });
    }

    private _ensureRegion(region?: string): string {
        if (!region) {
            return Store.state.regionCode;
        }

        return region;
    }

    private _cacheKey(level: number, region: string) {
        return `${level}:${region}`;
    }
}

export default new StatCalcProvider() as IStatCalcProvider;
