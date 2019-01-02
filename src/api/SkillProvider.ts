
import ITypedMap from '@/models/util/ITypedMap';
import RequestCache from '@/models/util/RequestCache';
import { ApiHttpClient } from "@/globals";
import store from '@/store';
import ISkill from '@/models/skills/ISkill';
import ISkillTableRow from '@/models/skills/raw/ISkillTableRow';
import UiStringProvider, { UiStringFormat } from './UiStringProvider';
import IIconInfo from '@/models/util/IIconInfo';
import ISkillEffect from '@/models/skills/ISkillEffect';
import { SkillEffectApplyType, SkillType, SkillDurationType, SkillTargetType } from '@/models/skills/SkillEnums';
import JobProvider from './JobProvider';
import { ElementalType } from '@/models/common/ElementalType';
import ISkillStub from '@/models/skills/ISkillStub';
import ISkillLevel from '@/models/skills/ISkillLevel';
import ISkillLevelTableRow from '@/models/skills/raw/ISkillLevelTableRow';
import ISkillTreeEntry from '@/models/skills/ISkillTreeEntry';
import ISkillEffectValue from '@/models/skills/ISkillEffectValue';
import { ISkillLevelResponse } from '@/models/skills/raw/ISkillLevelResponse';

export interface ISkillProvider {
    getSkill(id: number, region?: string): Promise<ISkill>;

    skillSlug(skill: ISkillStub): string;

    getSkillLevels(skillId: number, pvp?: boolean, region?: string): Promise<ISkillLevel[]>;

    getSkillTreeInfo(skillId: number): Promise<ISkillTreeEntry|null>;
}

class SkillProvider {

    private _skillCache: ITypedMap<ISkill>;
    private _skillReqCache: RequestCache<ISkill>;

    private _skillLevelCache: ITypedMap<ISkillLevel[]>;
    private _skillLevelReqCache: RequestCache<ISkillLevel[]>;

    constructor() {
        this._skillCache = {};
        this._skillReqCache = new RequestCache();
        this._skillLevelCache = {};
        this._skillLevelReqCache = new RequestCache();
    }

    public async getSkill(id: number, region?: string): Promise<ISkill> {
        region = this._ensureRegion(region);

        const cacheKey = this._cacheKey(id, region);
        const cached = this._skillCache[cacheKey];
        if (cached) {
            return cached;
        }

        return this._skillReqCache.tryCache(cacheKey, async () => {
            const resp = await ApiHttpClient.get<ISkill>(`/server/${region}/skills/${id}`);
            const ret = resp.data;
            const retBag = ret as any;
            // Some fixing is required
            ret.skillIcon = this._icon(retBag.skillIconIndex);
            ret.buffIcon = this._buffIcon(retBag.buffIconIndex);
            ret.debuffIcon = this._buffIcon(retBag.debuffIconIndex);
            ret.elementStr = ElementalType[ret.element];
            ret.skillTypeStr = SkillType[ret.skillType];
            for (let effect of ret.effects) {
                effect.effectApplyTypeStr = SkillEffectApplyType[effect.effectApplyType];
            }

            if (ret.requiredJob) {
                let jobBag = ret.requiredJob as any;
                ret.requiredJob.icon = JobProvider.getIconInfo(jobBag.iconIndex);
            }

            ret.durationTypeStr = SkillDurationType[ret.durationType];
            ret.targetTypeStr = SkillTargetType[ret.targetType];

            return ret;
        });
    }

    skillSlug(skill: ISkillStub): string {
        let ret = `${skill.id}`;
        if (skill.name.id === 0) {
            if (skill.internalName) {
                ret += `-${skill.internalName}`;
            }
        } else {
            ret += `-${skill.name.message.substr(0, 60).trim().replace(/\s|\.|\/|\?/g, "-").replace(/[%]/g, "").replace(/-+/g, "-")}`;
        }
        
        return ret;
    }

    private _icon(iconIndex: number, region?: string): IIconInfo {
        if (iconIndex == -1) {
            iconIndex = 615; // Question mark icon
        }

        const PAGE_SIZE = 200;
        const row = Math.floor((iconIndex % PAGE_SIZE) / 10);
        const column = iconIndex % 10;
        const page = Math.floor(iconIndex / PAGE_SIZE);
        const UNIT_SIZE = 50;

        
        region = this._ensureRegion(region);
        const pageNum = (page + 1).toString().padStart(2, "0");
        const url = `${ApiHttpClient.defaults.baseURL}/server/${region}/dds/skillicon${pageNum}/png`;

        return {
            x: Math.max(UNIT_SIZE * column, 0),
            y: UNIT_SIZE * row,
            size: UNIT_SIZE,
            url,
            index: iconIndex,
        };

    }

    private _buffIcon(iconIndex: number, region?: string): IIconInfo|undefined {
        if (iconIndex == -1) {
            return undefined;
        }

        const PAGE_SIZE = 100;
        const page = Math.floor(iconIndex / PAGE_SIZE);
        let row = Math.floor((iconIndex % PAGE_SIZE) / 10);
        let column = iconIndex % 10;
        const UNIT_SIZE = 25;

        region = this._ensureRegion(region);
        const pageNum = (page + 1).toString().padStart(2, "0");
        const url = `${ApiHttpClient.defaults.baseURL}/server/${region}/dds/bufficon${pageNum}/png`;

        return {
            x: Math.max(UNIT_SIZE * column, 0),
            y: UNIT_SIZE * row,
            size: UNIT_SIZE,
            url,
            index: iconIndex,
        };

    }

    public async getSkillLevels(skillId: number, pvp?: boolean, region?: string): Promise<ISkillLevel[]> {
        const r = this._ensureRegion(region);

        pvp = !!pvp;

        const cacheKey = this._levelCacheKey(skillId, pvp, r);
        const cached = this._skillLevelCache[cacheKey];
        if (cached) {
            return cached;
        }

        return this._skillLevelReqCache.tryCache(cacheKey, async () => {
            const resp = await ApiHttpClient.get<ISkillLevelResponse>(`/server/${region}/skills/${skillId}/levels`);
            const ret = pvp ? resp.data.pvp : resp.data.pve;
            const other = pvp ? resp.data.pve : resp.data.pvp;
            this._skillLevelCache[cacheKey] = ret;
            const otherCacheKey = this._levelCacheKey(skillId, !pvp, r);
            this._skillLevelCache[otherCacheKey] = ret;

            return ret;
        });
    }

    public async getSkillTreeInfo(): Promise<ISkillTreeEntry|null> {
        return null;
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

    private _levelCacheKey(skillId: number, pvp: boolean, region: string) {
        return `${region}:${skillId}:${pvp ? 1 : 0}`;
    }
}

export default new SkillProvider() as ISkillProvider;
