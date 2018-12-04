import IJob from '@/models/jobs/IJob';
import IJobApiResponse from '@/models/jobs/raw/IJobApiResponse';
import IIconCoordinates from '@/models/util/IIconCoordinates';1
import ITypedMap from '@/models/util/ITypedMap';
import RequestCache from '@/models/util/RequestCache';
import Vue from 'vue';
import IJobTableRow from '@/models/jobs/raw/IJobTableRow';

import { ApiHttpClient } from "@/globals";
import UiStringProvider, { IBulkRequestEntry, IBulkResponse } from './UiStringProvider';
import store from '@/store';
import { range } from '@/helpers/ArrayUtils';
import IIconInfo from '@/models/util/IIconInfo';
import IJobScaling from '@/models/jobs/IJobScaling';
import IJobScalingTableRow from '@/models/jobs/raw/IJobScalingTableRow';

export interface IJobProvider {
    
    getJob(id: number, getParents?: boolean, region?: string): Promise<IJob>;

    getJobs(ids: number[], region?: string): Promise<IJob[]>;

    getAllJobs(region?: string): Promise<IJob[]>;

    getIconInfo(iconIndex: number, region?: string): IIconInfo;

    getJobScaling(id: number, region?: string): Promise<IJobScaling>;

    getJobsScaling(ids: number[], region?: string): Promise<IJobScaling[]>;
}

class JobProvider implements IJobProvider {
    private _jobsCache: ITypedMap<IJob>;
    private _requestCache: RequestCache<IJob>;
    private _jobStatCache: ITypedMap<IJobScaling>;
    private _statRequestCache: RequestCache<IJobScaling>;

    constructor() {
        this._jobsCache = {};
        this._requestCache = new RequestCache();

        this._jobStatCache = {};
        this._statRequestCache = new RequestCache();
    }

    public async getJob(id: number, getParents: boolean = false, region?: string): Promise<IJob> {
        region = this._ensureRegion(region);
        let key = this._cacheKey(id, region);
        let cached = this._jobsCache[key];
        if (cached) {
            const copy = Object.assign({}, cached);

            if (getParents && copy.parentJobId != 0) {
                copy.parentJob = await this.getJob(copy.parentJobId, true, region);
            }

            return Promise.resolve(copy);
        }

        return this._requestCache.tryCache(key, async () => {
            const res = await ApiHttpClient.get<IJobApiResponse>(`server/${region}/jobs/${id}`, {
                params: {
                    parent: getParents ? true : undefined,
                },
            });
            const data = res.data;

            const ret = this._rawApiResultToData(data, region)!;

            this._jobsCache[key] = ret;

            return ret;
        });
    }

    public async getJobs(ids: number[], region?: string): Promise<IJob[]> {
        region = this._ensureRegion(region);
        let promises: Promise<IJob|null>[] = [];
        let alreadyCached: IJob[] = [];
        let needsRequest: number[] = [];

        for (let id of ids) {
            let key = this._cacheKey(id, region);
            let cached = this._jobsCache[key];
            if (cached) {
                alreadyCached.push(cached);
            } else {
                needsRequest.push(id);
            }
        }

        promises = promises.concat(...alreadyCached.map((j) => Promise.resolve(j)));

        if (needsRequest.length == 1) {
            promises.push(this.getJob(needsRequest[0], false, region));
        } else if (needsRequest.length > 1) {
            const idList = needsRequest.join(",");
            const res = await ApiHttpClient.get<IJobApiResponse[]>(`server/${region}/jobs/${idList}`, {})
                .then((r) => r.data);
            
            const converted = res.map((r) => this._rawApiResultToData(r, region)!).filter((j) => j != null);

            converted.forEach((j) => {
                const key = this._cacheKey(j.id, region!);
                this._jobsCache[key] = j;
            });

            promises = promises.concat(converted.map((r) => Promise.resolve(r)));
        }

        return Promise.all(promises).then((p) => p.filter((v) => v != null)) as Promise<IJob[]>;
    }

    public async getAllJobs(region: string): Promise<IJob[]> {
        region = this._ensureRegion(region);
        const res = await ApiHttpClient.get<IJobApiResponse[]>(`server/${region}/jobs`, {});
        const data = res.data;

        const ret = data.map((d) => this._rawApiResultToData(d, region)!).filter((j) => j != null);
        ret.forEach((j) => {
            const key = this._cacheKey(j.id, region!);
            this._jobsCache[key] = j;
        });

        return ret;
    }

    public getIconInfo(iconIndex: number, region?: string): IIconInfo {
        let row = Math.floor(iconIndex / 9);
        let column = iconIndex % 9;
        const UNIT_SIZE = 55;

        return {
            x: Math.max(UNIT_SIZE * column, 0),
            y: UNIT_SIZE * row,
            size: UNIT_SIZE,
            url: this._getIconUrl(region),
            index: iconIndex,
        };
    }

    public getJobScaling(id: number, region?: string): Promise<IJobScaling> {
        region = this._ensureRegion(region);
        let key = this._cacheKey(id, region);
        let cached = this._jobStatCache[key];
        if (cached) {
            return Promise.resolve(cached);
        }
        
        return this._statRequestCache.tryCache(key, async () => {
            const res = await ApiHttpClient.get<IJobScalingTableRow>(`server/${region}/tables/rebootplayerweighttable/${id}`, {});
            const data = res.data;

            let ret = this._scalingDataToObject(data);

            this._jobStatCache[key] = ret;

            return ret;
        });
    }

    public async getJobsScaling(ids: number[], region?: string): Promise<IJobScaling[]> {
        region = this._ensureRegion(region);

        let promises: Promise<IJobScaling|null>[] = [];
        let alreadyCached: IJobScaling[] = [];
        let needsRequest: number[] = [];

        for (let id of ids) {
            let key = this._cacheKey(id, region);
            let cached = this._jobStatCache[key];
            if (cached) {
                alreadyCached.push(cached);
            } else {
                needsRequest.push(id);
            }
        }

        promises = promises.concat(...alreadyCached.map((j) => Promise.resolve(j)));

        if (needsRequest.length == 1) {
            promises.push(this.getJobScaling(needsRequest[0], region));
        } else if (needsRequest.length > 1) {
            const idList = needsRequest.join(",");
            const res = await ApiHttpClient.get<ITypedMap<IJobScalingTableRow>>(`server/${region}/tables/rebootplayerweighttable/${idList}`, {})
                .then((r) => r.data, (e) => null)
                .then((data) => data ? Object.keys(data).map((k) => data[k]) : [])
                .then((r) => r.map((v) => this._scalingDataToObject(v)));

            res.forEach((r) => {
                const key = this._cacheKey(r.jobId, region!);
                this._jobStatCache[key] = r;
            });

            promises = promises.concat(res.map((r) => Promise.resolve(r)));
        }

        return Promise.all(promises).then((p) => p.filter((v) => v != null)) as Promise<IJobScaling[]>;
    }

    private _getIconUrl(region?: string): string {
        region = this._ensureRegion(region);
        return `${ApiHttpClient.defaults.baseURL}/server/${region}/dds/jobicon_main/png`;
    }

    private _ensureRegion(region?: string): string {
        if (!region) {
            return store.state.regionCode;
        }

        return region;
    }

    private _cacheKey(id: number, region: string) {
        return `${region}:${id}`;
    }

    private _rawToData(data: IJobTableRow, strResp: IBulkResponse, region?: string): IJob {
        const ret: IJob = {
            id: data.id,
            name: strResp[data._JobName],
            icon: this.getIconInfo(data._JobIcon, region),
            jobDescription: strResp[data._JobDescriptionID],
            mainStatString: strResp[data._CoreStatusNameID],
            baseClass: data._Class,
            classType: data._DarkJob,
            hasAwakening: data._AwakeningIcon != 0,
            jobNumber: data._JobNumber,
            parentJobId: data._ParentJob,
            parentJob: null,
            // movieUrl: data._JobMv ? `${ApiHttpClient.defaults.baseURL}/server/${region}/files/${data._JobMv}` : null,
        };

        return ret;
    }

    private _rawApiResultToData(data: IJobApiResponse|null, region?: string): IJob|null {
        if (!data) {
            return null;
        }

        return {
            icon: this.getIconInfo(data.iconIndex, region),
            ...data,
            parentJob: this._rawApiResultToData(data.parentJob, region),
        };
    }

    private _createBulkRequest(data: IJobTableRow): IBulkRequestEntry[] {
        return [
            {
                id: data._JobName,
            },
            {
                id: data._CoreStatusNameID,
                params: data._CoreStatusNameIDParam,
            },
            {
                id: data._JobDescriptionID,
            }
        ];
    }

    private _scalingDataToObject(data: IJobScalingTableRow): IJobScaling {
        return {
            jobId: data.id,
            vitToHp: data._HP,
            vitToDef: data._PhysicalDefense,
            agiToCrit: data._Critical,
            agiToPhys: data._AgilityAttack,
            intToMagic: data._IntelligenceAttack,
            intToMdef: data._MagicDefense,
            strIntToCritDmg: data._StrengthIntelligenceToCriticalDamage,
            strToPhys: data._StrengthAttack,
        };
    }
};

export default new JobProvider() as IJobProvider;

