import ITypedMap from "./ITypedMap";

export default class RequestCache<T> {
    private _cache: ITypedMap<Promise<T>>;

    constructor() {
        this._cache = {};
    }

    public tryCache(key: string, populator: () => Promise<T>): Promise<T> {
        let cached = this._cache[key];
        if (cached) {
            return cached;
        } else {
            let v = populator().then((t) => {
                delete this._cache[key];
                return t;
            }, (err: Error) => {
                delete this._cache[key];
                return Promise.reject(err);
            });
            this._cache[key] = v;
            return v;
        }
    }
};
