
import ITypedMap from '@/models/util/ITypedMap';
import RequestCache from '@/models/util/RequestCache';
import { ApiHttpClient } from "@/globals";
import store from '@/store';
import ILegacyMonster from '@/models/monsters/ILegacyMonster';
import IMonsterSkillEntry from '@/models/monsters/IMonsterSkillEntry';

export interface ILegacyMonsterProvider {
    
    getMonster(monsterId: number, region?: string): Promise<ILegacyMonster>;
    getMonsterSkills(skillListId: number, region?: string): Promise<IMonsterSkillEntry[]>;
}

class LegacyMonsterProvider implements ILegacyMonsterProvider {
    private _monsterCache: ITypedMap<ILegacyMonster>;
    private _requestCache: RequestCache<ILegacyMonster>;
    
    constructor() {
        this._monsterCache = {};
        this._requestCache = new RequestCache();
    }
    
    public async getMonster(monsterId: number, region?: string): Promise<ILegacyMonster> {
        region = this._ensureRegion(region);
        let key = this._cacheKey(monsterId, region);
        let cached = this._monsterCache[key];
        if (cached) {
            return cached;
        }

        return this._requestCache.tryCache(key, async () => {
            const res = await ApiHttpClient.get<ILegacyMonster>(`server/${region}/monsters/${monsterId}`, {
                params: {
                },
            });
            const data = res.data;

            this._monsterCache[key] = data;

            return data;
        });
    }
    
    public async getMonsterSkills(skillListId: number, region?: string): Promise<IMonsterSkillEntry[]> {
        region = this._ensureRegion(region);
        const r = await ApiHttpClient.get<{[k: string]: number}>(`server/${region}/tables/virt.monsterskilltable/${skillListId}`);
        const data = r.data;
        const ret: IMonsterSkillEntry[] = [];
        for (let i = 1; i < 120; ++i) {
            const k1 = `_SkillIndex${i}`;
            const k2 = `_SkillLevel${i}`;
            const vI = data[k1];
            const vL = data[k2];
            if (vI && vI > 0 && vL && vL > 0) {
                ret.push({
                    id: vI,
                    level: vL,
                });
            }
        }
        
        return ret;
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
}

export default new LegacyMonsterProvider() as ILegacyMonsterProvider;
