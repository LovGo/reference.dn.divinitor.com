import ITableColumnSchema from '@/models/tables/ITableColumnSchema';
import { ApiHttpClient } from "@/globals";
import store from '@/store';
import ITypedMap from '@/models/util/ITypedMap';

export interface ITableProvider {
    getSchema(tableName: string, region?: string): Promise<ITableColumnSchema[]>;
    getTableRow<T>(tableName: string, rowId: number, region?: string): Promise<T & {id: number}>;
    getTableRows<T>(tableName: string, rowIds: number[], region?: string): Promise<(T & {id: number})[]>;
    getTableRowIdsMatching(tableName: string, columnName: string, operand: string, columnValue: string, region?: string): Promise<number[]>;
    getTableRowsMatching<T>(tableName: string, columnName: string, operand: string, columnValue: string, region?: string): Promise<(T & {id: number})[]>;
}

class TableProvider implements ITableProvider {
    public async getSchema(tableName: string, region?: string): Promise<ITableColumnSchema[]> {
        region = this._ensureRegion(region);
        
        const res = await ApiHttpClient.get<ITableColumnSchema[]>(`/server/${region}/tables/${tableName}`);
        return res.data;
    }    
    
    public async getTableRow<T>(tableName: string, rowId: number, region?: string): Promise<T & { id: number; }> {
        region = this._ensureRegion(region);
        
        const res = await ApiHttpClient.get<T & { id: number; }>(`/server/${region}/tables/${tableName}/${rowId}`);
        return res.data;
    }

    public async getTableRows<T>(tableName: string, rowIds: number[], region?: string): Promise<(T & { id: number; })[]> {
        region = this._ensureRegion(region);
        
        const ids = rowIds.join(',');
        const res = await ApiHttpClient.get<ITypedMap<T & { id: number; }>>(`/server/${region}/tables/${tableName}/${ids}`);
        return Object.values(res.data);
    }

    public async getTableRowIdsMatching(tableName: string, columnName: string, operand: string, columnValue: string, region?: string): Promise<number[]> {
        region = this._ensureRegion(region);
        
        const res = await ApiHttpClient.get<number[]>(`/server/${region}/tables/${tableName}/columns/${columnName}/${operand}/${columnValue}`);
        return res.data;
    }

    public async getTableRowsMatching<T>(tableName: string, columnName: string, operand: string, columnValue: string, region?: string): Promise<(T & { id: number; })[]> {
        const rowIds = await this.getTableRowIdsMatching(tableName, columnName, operand, columnValue, region);
        return await this.getTableRows(tableName, rowIds, region);
    }

    private _ensureRegion(region?: string): string {
        if (!region) {
            return store.state.regionCode;
        }

        return region;
    }
}

export default new TableProvider() as ITableProvider;