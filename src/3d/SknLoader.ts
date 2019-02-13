import ISkn from '@/models/3d/skn/ISkn';

import { ApiHttpClient } from "@/globals";
import store from '@/store';

export class SknLoader {
    public async loadSkn(name: string, region?: string): Promise<ISkn> {
        region = this._ensureRegion(region);

        const lastIdx = name.lastIndexOf('\\');
        if (lastIdx !== -1) {
            name = name.substr(lastIdx + 1);
        }

        const res = await ApiHttpClient.get<ISkn>(`server/${region}/files/${encodeURIComponent(name)}?f=skn`);

        return res.data;
    }

    private _ensureRegion(region?: string): string {
        if (!region) {
            return store.state.regionCode;
        }

        return region;
    }
}

export default new SknLoader();
