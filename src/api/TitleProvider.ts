import { GeneralHttpClient } from "@/globals";

import RequestCache from "@/models/util/RequestCache";
import ITypedMap from "@/models/util/ITypedMap";

import Store from "@/store";
import { ApiHttpClient } from "@/globals";
import ICharmItemKeyApiResponse from '@/models/items/raw/ICharmItemKeyApiResponse';
import ITitle from '@/models/title/ITitle';
import ITitleApiResponse from '@/models/title/raw/ITitleApiResponse';
import UiStringProvider, { IBulkResponse } from './UiStringProvider';
import IItemState, { zip } from '@/models/items/IItemState';
import { ItemState } from '@/models/items/ItemEnums';
import { ensureRegion } from '@/util/Utils';

export interface ITitleProvider {
    getTitle(titleId: number, region?: string): Promise<ITitle>;
}

class TitleProvider implements ITitleProvider {
    
    public async getTitle(titleId: number, region?: string): Promise<ITitle> {
        region = ensureRegion(region);
        const { data: resp } = await ApiHttpClient.get<ITitleApiResponse>(`/server/${region}/tables/appellationtable/${titleId}`);

        const msgs: IBulkResponse = await UiStringProvider.getBulk([
            {
                id: resp._NameID,
            },
            {
                id: resp._DescriptionID,
            },
        ]);

        const ret: ITitle = {
            id: resp.id,
            name: msgs[resp._NameID],
            description: msgs[resp._DescriptionID],
            requiredLevel: resp._LevelLimit,
            type: resp._Type,
            skillLinkItemId: resp._SkillLinkItemID,
            colorCode: resp._Color,
            displayColor: resp._ColorValue,
            foregroundColor: resp._TextInColor,
            backgroundColor: resp._TextOutColor,
            states: [],
        };

        const stater = (n: number) => `_State${n}`;
        const stateValuer = (n: number) => `_StateValue${n}`;
        
        const respAny = resp as any;
        for (let i = 1; i <= 9; ++i) {
            const stateId = respAny[stater(i)] as number;
            const stateValue = respAny[stateValuer(i)] as string;

            if (stateId === -1 || !stateValue.trim()) {
                continue;
            }

            const state: IItemState = {
                id: stateId,
                state: stateId as ItemState,
                value: Number(stateValue),
            };

            ret.states.push(state);
        }

        ret.states = zip(ret.states);

        return ret;
    }
}

export default new TitleProvider() as ITitleProvider;
