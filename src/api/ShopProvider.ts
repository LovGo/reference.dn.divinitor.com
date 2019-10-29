import ITypedMap from '@/models/util/ITypedMap';
import RequestCache from '@/models/util/RequestCache';

import { ApiHttpClient } from "@/globals";
import store from '@/store';
import IItemShop, { IItemShopTab, IItemShopTabEntry } from '@/models/items/IItemShop';
import ICombinedShopTableRow from '@/models/items/raw/ICombinedShopTableRow';
import UiStringProvider from './UiStringProvider';

export interface IShopProvider {
    
    getShop(id: number, region?: string): Promise<IItemShop>;
}

class ShopProvider implements IShopProvider {
    private _shopCache: ITypedMap<IItemShop>;
    private _shopReqCache: RequestCache<IItemShop>;

    constructor() {
        this._shopCache = {};
        this._shopReqCache = new RequestCache();
    }

    public async getShop(id: number, region?: string): Promise<IItemShop> {
        region = this._ensureRegion(region);
        let key = this._cacheKey(id, region);
        let cached = this._shopCache[key];
        if (cached) {
            return Promise.resolve(cached);
        }
        
        return this._shopReqCache.tryCache(key, async () => {
            const res = (await ApiHttpClient.get<ICombinedShopTableRow[]>(`server/${region}/tables/virt.combinedshoptable/columns/_ShopID/eq/${id}/data?limit=2000`, {})).data;
            const ret: IItemShop = {
                id,
                tabs: [],
            };

            const tabIds = Object.values(res.reduce((pv, cv) => {
                pv[cv._TabID] = cv._TabID;
                return pv;
            }, {} as {[k:number]: number}));
            for (const tabId of tabIds) {
                const first = res.find((r) => r._TabID === tabId);
                if (first) {
                    const tabNameId = first._TabNameID;
                    const tab: IItemShopTab = {
                        id: tabId,
                        name: await UiStringProvider.get(tabNameId, region),
                        entries: [],
                    };

                    const entries = res.filter((r) => r._TabID === tabId);
                    for (let e of entries) {
                        const entry: IItemShopTabEntry = {
                            id: e.rowId,
                            index: e._ListID,
                            itemId: e._itemindex,
                            quantity: e._Quantity,
                            cost: [
                                {
                                    costType: e._PurchaseType1,
                                    costItemId: e._PurchaseItem1,
                                    costParam: e._PurchaseItemValue1,
                                },
                                {
                                    costType: e._PurchaseType2,
                                    costItemId: e._PurchaseItem2,
                                    costParam: e._PurchaseItemValue2,
                                },
                            ].filter((c) => c.costType),
                            limitType: e._PurchaseLimitType,
                            limitParam: e._PurchaseLimitValue,
                            limitCount: e._buyLimitCount,
                            limitReset: e._ShopLimitReset,
                            itemOption: e._ItemOptionID,
                            seals: e._ShopSealCount,
                            rollPotentialOnPurchase: e._PotentialList,
                        };

                        tab.entries.push(entry);
                    }

                    ret.tabs.push(tab);
                }
            }

            return ret;
        });

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

export default new ShopProvider() as IShopProvider;
