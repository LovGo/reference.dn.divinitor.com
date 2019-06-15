import { ApiHttpClient } from "@/globals";
import store from '@/store';
import TableProvider from './TableProvider';

export interface IFileProvider {
    getFile(path: string, region?: string): Promise<ArrayBuffer>;
    getFileUrl(path: string, region?: string, absolute?: boolean): string;
    getFileNameById(id: number, region?: string): Promise<string>;
    getFileNamesById(ids: number[], region?: string): Promise<{id: number, name: string}[]>;
}

interface IFileTableRow {
    id: number;
    _FileName: string;
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

    public async getFileNameById(id: number, region?: string): Promise<string> {
        region = this._ensureRegion(region);

        const result = await TableProvider.getTableRow<IFileTableRow>('filetable', id, region);
        if (result) {
            return result._FileName;
        }

        throw `No file found for ID ${id}`;
    }

    public async getFileNamesById(ids: number[], region?: string): Promise<{id: number, name: string}[]> {
        region = this._ensureRegion(region);

        const result = await TableProvider.getTableRows<IFileTableRow>('filetable', ids, region);
        return result.map(v => ({
            id: v.id,
            name: v._FileName,
        }));
    }

    private _ensureRegion(region?: string): string {
        if (!region) {
            return store.state.regionCode;
        }

        return region;
    }
}

export default new FileProvider() as IFileProvider;
