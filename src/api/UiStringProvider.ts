import IUiStringMessage from '@/models/uistring/IUiStringMessage';
import RequestCache from '@/models/util/RequestCache';
import ITypedMap from '@/models/util/ITypedMap';
import Store from "@/store";
import Vue from 'vue';

import { ApiHttpClient } from "@/globals";
import IUiStringVariants from '@/models/uistring/IUiStringVariants';

export enum UiStringFormat {
    RAW = "raw",
    STRIPPED = "strip",
    HTML = "html",
};

export interface IBulkRequestEntry {
    id: number;
    params?: string;
    format?: UiStringFormat;
};

export interface IBulkResponse {
    [key: number]: IUiStringMessage;
};

export interface IUiStringProvider {
    get(mid: number, region?: string, params?: string, format?: UiStringFormat): Promise<IUiStringMessage>;
    
    getBulk(requests: IBulkRequestEntry[], region?: string): Promise<IBulkResponse>;
};

class UiStringProvider implements IUiStringProvider {
    private _cache: ITypedMap<IUiStringMessage>;
    private _requestCache: RequestCache<IUiStringMessage>;
    private _variantRequestCache: RequestCache<IUiStringVariants>;

    constructor() {
        this._cache = {};
        this._requestCache = new RequestCache();
        this._variantRequestCache = new RequestCache();
    }

    public get(mid: number, 
        region?: string, 
        params?: string, 
        format: UiStringFormat = UiStringFormat.RAW): Promise<IUiStringMessage> {
        region = this._ensureRegion(region);
        if (params) {
            params = encodeURIComponent(params);
        }

        let key = this._cacheKey(mid, region, params, format);
        let cached = this._cache[key];
        if (cached) {
            return Promise.resolve(cached);
        }

        return this._requestCache.tryCache(key, async () => {
            let result = await ApiHttpClient.get<string>(`server/${region}/uistring/${mid}`, {
                params: {
                    fmt: format,
                    param: params ? params : undefined,
                },
            });
            const ret = {
                id: mid,
                message: result.data,
            };

            this._cache[key] = ret;

            return ret;
        });
    }

    public async getBulk(requests: IBulkRequestEntry[], region?: string): Promise<IBulkResponse> {
        let promises: Promise<IUiStringMessage>[] = [];
        for (let req of requests) {
            promises.push(this.get(req.id, region, req.params, req.format));
        }

        let results = await Promise.all(promises);
        let ret: IBulkResponse = {};
        for (let result of results) {
            ret[result.id] = result;
        }

        return ret;
    }

    public async getVariants(mid: number,
        region?: string,
        params?: string): Promise<IUiStringVariants> {
        region = this._ensureRegion(region);
        let rawKey = this._cacheKey(mid, region, params, UiStringFormat.RAW);
        let htmlKey = this._cacheKey(mid, region, params, UiStringFormat.HTML);
        let stripKey = this._cacheKey(mid, region, params, UiStringFormat.STRIPPED);

        let rawCached = this._cache[rawKey];
        let htmlCached = this._cache[htmlKey];
        let stripCached = this._cache[stripKey];
        if (rawCached && htmlCached && stripCached) {
            return Promise.resolve({
                id: mid,
                raw: rawCached.message,
                strip: stripCached.message,
                html: htmlCached.message
            });
        }

        let tripleKey = rawKey + ":" + htmlKey + ":" + stripKey;
        
        return this._variantRequestCache.tryCache(tripleKey, async () => {
            let result = await ApiHttpClient.get<IUiStringVariants>(`server/${region}/uistring/${mid}/variant`, {
                params: {
                    param: params ? params : undefined,
                },
            });

            let ret = result.data;
            ret.id = mid;
            return ret;
        });
    }

    private _ensureRegion(region?: string): string {
        if (!region) {
            return Store.state.regionCode;
        }

        return region;
    }
    
    private _cacheKey(id: number, region: string, params?: string, format?: UiStringFormat) {
        if (!params) {
            params = "";
        }
        if (format === undefined) {
            format = UiStringFormat.RAW;
        }

        return `${region}:${id}:${btoa(params)}:${format}`;
    }
};

export default new UiStringProvider() as IUiStringProvider;
