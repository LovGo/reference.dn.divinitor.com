import { GeneralHttpClient } from "@/globals";

import RequestCache from "@/models/util/RequestCache";
import ITypedMap from "@/models/util/ITypedMap";

import Store from "@/store";
import IRegion from '@/models/region/IRegion';
import Axios from 'axios';
import moment from 'moment';

export interface IRegionProvider {

    getRegionByShortName(shortName: string, type?: RegionInfoType): Promise<IRegion>;

    getRegionById(id: number, type?: RegionInfoType): Promise<IRegion>;

    listRegions(type?: RegionInfoType): Promise<IRegion[]>;
};

export enum SupportedRegions {
    NORTH_AMERICA = "na",
    KOREA = "ko",
    EUROPE = "eu",
    SOUTHEAST_ASIA = "sea",
    // JAPAN = "jp",
    // CHINA = "cn",
    BRAZIL = "br",
};

export const defaultRegion: SupportedRegions = SupportedRegions.NORTH_AMERICA;

export enum RegionInfoType {
    NONE = "",
    CONFIG = "config",
};

const RegionServiceBaseUrl = "https://regionservice-dn.arcsat.divinitor.com/regions";

class RegionProvider implements IRegionProvider {

    private _cache: ITypedMap<IRegion>;
    private _requestCache: RequestCache<IRegion>;

    constructor() {
        this._cache = {};
        this._requestCache = new RequestCache<IRegion>();
    }

    public getRegionByShortName(shortName: string, type?: RegionInfoType): Promise<IRegion> {
        shortName = this._normalizeShortName(shortName);
        const cacheKey = this._cacheKey(shortName, type);
        const cached = this._cache[cacheKey];
        if (cached) {
            return Promise.resolve(cached);
        }

        return this._requestCache.tryCache(cacheKey, async () => {
            const response = await GeneralHttpClient.get<IRegion>(`${RegionServiceBaseUrl}/shortname/${shortName}`);
            const region = response.data;
            this._cache[cacheKey] = region;
            this._cache[this._cacheKey(region.id, type)] = region;
            return region;
        });
    }

    public getRegionById(id: number, type?: RegionInfoType): Promise<IRegion> {
        const cacheKey = this._cacheKey(id, type);
        const cached = this._cache[cacheKey];
        if (cached) {
            return Promise.resolve(cached);
        }

        return this._requestCache.tryCache(cacheKey, async () => {
            const response = await GeneralHttpClient.get<IRegion>(`${RegionServiceBaseUrl}/${id}`);
            const region = response.data;
            this._cache[cacheKey] = region;
            this._cache[this._cacheKey(region.shortName, type)] = region;
            return region;
        });
    }

    public listRegions(type?: RegionInfoType): Promise<IRegion[]> {
        const regions: string[] = Object.values(SupportedRegions);
        let promises: Promise<IRegion>[] = [];
        for (let shortName of regions) {
            promises.push(this.getRegionByShortName(shortName, type));
        }

        return Promise.all(promises);
    }

    private _normalizeShortName(name: string) {
        let ret = name;

        ret = ret.toLowerCase();

        return ret;
    }

    private _cacheKey(idOrShortName: string|number, type: RegionInfoType = RegionInfoType.NONE) {
        return `${String(idOrShortName)}:${type}`;
    }
};

class StaticRegionProvider implements IRegionProvider {

    private cachedVersion: number;
    private cachedTime: string;

    constructor() {
        console.log("Using static region provider");
        this.cachedVersion = -1;
        this.cachedTime = '';
    }

    public async getRegionByShortName(shortName: string, type?: RegionInfoType | undefined): Promise<IRegion> {
        return await this._getStaticRegion();
    }

    public async getRegionById(id: number, type?: RegionInfoType | undefined): Promise<IRegion> {
        return await this._getStaticRegion();
    }

    public async listRegions(type?: RegionInfoType | undefined): Promise<IRegion[]> {
        return [ await this._getStaticRegion() ];
    }

    private async _getStaticRegion(): Promise<IRegion> {
        const ret = window.STATIC_REGION!;

        // Get version
        if (this.cachedVersion < 0 || !this.cachedTime) {
            const res = await Axios.get<string>(process.env.VUE_APP_STATIC_REGION_VERSION_CFG_URL);
            let rawVersion = res.data.split('\n')[0];
            if (rawVersion.startsWith('Version ')) {
                rawVersion = rawVersion.substring('Version '.length).trim();
                const parsed = parseInt(rawVersion);
                if (!isNaN(parsed)) {
                    this.cachedVersion = parsed;
                }
            }

            const patchDateStr = res.headers['last-modified'];
            const patchDate = moment(patchDateStr);
            this.cachedTime = patchDate.toISOString();
        }

        return {
            ...ret,
            version: this.cachedVersion,
            patchedTime: this.cachedTime,
        };
    }
}

export default (process.env.VUE_APP_USE_STATIC_SERVER ? new StaticRegionProvider() : new RegionProvider()) as IRegionProvider;

export function ensureRegion(region?: string): string {
    if (!region) {
        return Store.state.regionCode;
    }

    return region;
}
