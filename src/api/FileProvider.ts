import { ApiHttpClient } from "@/globals";
import store from '@/store';

export interface IFileProvider {
    getFile(path: string, region?: string): Promise<ArrayBuffer>;
    getFileUrl(path: string, region?: string, absolute?: boolean): string;
}

class FileProvider implements IFileProvider {
    public async getFile(path: string, region?: string): Promise<ArrayBuffer> {
        region = this._ensureRegion(region);

        const resp = await ApiHttpClient.get<ArrayBuffer>(this.getFileUrl(path, region, false), {
            responseType: "arraybuffer",
        });

        return resp.data;
    }

    public getFileUrl(path: string, region?: string, absolute?: boolean): string {
        region = this._ensureRegion(region);
        let res = `/server/${region}/files/${path}`;

        if (absolute) {
            res = ApiHttpClient.defaults.baseURL + res;
            if (!res.startsWith("http")) {
                res = window.location.origin + res;
            }
        }

        return res;
    }

    private _ensureRegion(region?: string): string {
        if (!region) {
            return store.state.regionCode;
        }

        return region;
    }
}

export default new FileProvider() as IFileProvider;
