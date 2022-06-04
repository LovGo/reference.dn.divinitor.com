import ITableRow from '@/models/table/ITableRow';
import ITypedMap from '@/models/util/ITypedMap';
import { ApiHttpClient } from "@/globals";
import store from '@/store';
import { IDntSchema } from '@/models/dnt/schema/IDntSchema';

export type ColumnOp = '='|'=='|'eq'|'equal'|'equals'|'!='|'neq'|'notequal'
    |'<'|'lt'|'less'|'<='|'le'|'leq'|'atmost'|'>'|'gt'|'greater'|'>='|'geq'
    |'atleast'|'<=>'|'minmax'|'closed'|'<>'|'open'|'between'|'=ic'|'==ic'
    |'eqic'|'equalic'|'equalsic'|'!=ic'|'neqic'|'notequalic'|'in'|'contains'
    |'~'|'nin'|'notcontains'|'ninic'|'notcontainsic'|'!~ic';

export interface IOptions {
    uiresolve?: string[];
    fileresolve?: string[];
    select?: string[];
}

export interface ITableProvider {
    getTableSchema(tableName: string, region?: string): Promise<IDntSchema>;

    getTableRow<T extends ITableRow>(tableName: string, rowId: number, region?: string, opt?: IOptions): Promise<T>;

    getTableRows<T extends ITableRow>(tableName: string, rowIds: number[], region?: string, opt?: IOptions): Promise<ITypedMap<T>>;

    getTableRowIdsMatching(tableName: string, columnName: string, op: ColumnOp, value: string|number, region?: string): Promise<number[]>;

    getTableRowsMatching<T extends ITableRow>(tableName: string, columnName: string, op: ColumnOp, value: string|number, region?: string, opt?: IOptions): Promise<T[]>;
    
    getTable<T extends ITableRow>(tableName: string, region?: string): Promise<T[]>;
}

class TableProvider implements ITableProvider {
    constructor() {
    }

    public async getTableSchema(tableName: string, region?: string): Promise<IDntSchema> {
        region = this._ensureRegion(region);

        const resp = await ApiHttpClient.get<IDntSchema>(`/server/${region}/tables/${tableName}`);
        return resp.data;
    }

    public async getTableRow<T extends ITableRow>(tableName: string, rowId: number, region?: string, opt?: IOptions): Promise<T> {
        region = this._ensureRegion(region);

        const resp = await ApiHttpClient.get<T>(`/server/${region}/tables/${tableName}/${rowId}`, {
            params: {
                uiresolve: (opt && opt.uiresolve) ? opt.uiresolve.join(',') : undefined,
                fileresolve: (opt && opt.fileresolve) ? opt.fileresolve.join(',') : undefined,
                select: (opt && opt.select) ? opt.select.join(',') : undefined,
            }
        });

        return resp.data;
    }

    public async getTableRows<T extends ITableRow>(tableName: string, rowIds: number[], region?: string, opt?: IOptions): Promise<ITypedMap<T>> {
        region = this._ensureRegion(region);

        const resp = await ApiHttpClient.get<ITypedMap<T>>(`/server/${region}/tables/${tableName}/${rowIds.join(',')}`, {
            params: {
                uiresolve: (opt && opt.uiresolve) ? opt.uiresolve.join(',') : undefined,
                fileresolve: (opt && opt.fileresolve) ? opt.fileresolve.join(',') : undefined,
                select: (opt && opt.select) ? opt.select.join(',') : undefined,
            }
        });

        return resp.data;
    }

    public async getTableRowIdsMatching(tableName: string, columnName: string, op: ColumnOp, value: string|number, region?: string): Promise<number[]> {
        region = this._ensureRegion(region);

        const resp = await ApiHttpClient.get<number[]>(`/server/${region}/tables/${tableName}/columns/${columnName}/${op}/${value}`);

        return resp.data;
    }

    public async getTableRowsMatching<T extends ITableRow>(tableName: string, columnName: string, op: ColumnOp, value: string|number, region?: string, opt?: IOptions): Promise<T[]> {
        region = this._ensureRegion(region);

        const resp = await ApiHttpClient.get<T[]>(`/server/${region}/tables/${tableName}/columns/${columnName}/${op}/${value}/data`, {
            params: {
                uiresolve: (opt && opt.uiresolve) ? opt.uiresolve.join(',') : undefined,
                fileresolve: (opt && opt.fileresolve) ? opt.fileresolve.join(',') : undefined,
                select: (opt && opt.select) ? opt.select.join(',') : undefined,
            }
        });

        return resp.data;
    }
    
    public async getTable<T extends ITableRow>(tableName: string, region?: string): Promise<T[]> {
        region = this._ensureRegion(region);

        const resp = await ApiHttpClient.get<T[]>(`/server/${region}/tables/${tableName}`, {
            params: {
                limit: 9000,
            }
        });

        return resp.data;
    }

    private _ensureRegion(region?: string): string {
        if (!region) {
            return store.state.regionCode;
        }

        return region;
    }
}

export default new TableProvider();
