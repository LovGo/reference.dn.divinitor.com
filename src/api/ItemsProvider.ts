import { GeneralHttpClient } from "@/globals";

import RequestCache from "@/models/util/RequestCache";
import ITypedMap from "@/models/util/ITypedMap";

import Store from "@/store";
import { ApiHttpClient } from "@/globals";
import ICharmItemKeyApiResponse from '@/models/items/raw/ICharmItemKeyApiResponse';

export interface IItemProvider {

    getItemCharmRequiredKeys(charmItemId: number, region?: string): Promise<[number, number][]>;
}

class ItemProvider implements IItemProvider {

    public async getItemCharmRequiredKeys(charmItemId: number, region?: string): Promise<[number, number][]> {
        region = this._ensureRegion(region);

        const { data: resp } = await ApiHttpClient.get<number[]>(`/server/na/tables/charmitemkeytable/columns/_CharmItemID/eq/${charmItemId}`);
        const rowId = resp.find(() => true);
        if (rowId) {
            const { data, status } = await ApiHttpClient.get<ICharmItemKeyApiResponse>(`/server/na/tables/charmitemkeytable/${rowId}`);

            const keyer = (n: number) => `_Key${n}`;
            const keyCoster = (n: number) => `_Key${n}cost`;

            const ret: [number, number][] = [];
            for (let i = 1; i <= 5; ++i) {
                const keyId = data[keyer(i)];
                const keyCost = data[keyCoster(i)];
                if (keyId && keyCost) {
                    ret.push([keyId, keyCost]);
                }
            }

            return ret;
        } else {
            return [];
        }
    }

    private _ensureRegion(region?: string): string {
        if (!region) {
            return Store.state.regionCode;
        }

        return region;
    }
}

export default new ItemProvider() as IItemProvider;
