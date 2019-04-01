export interface ILoading<V> {
    loading: boolean;
    finished: boolean;
    failed: boolean;
    result: V|null;
    error: any|null;
}

export function createLoading<V>(): ILoading<V> {
    return {
        loading: false,
        finished: false,
        failed: false,
        result: null,
        error: null,
    };
}

export function startLoading<V>(loading: ILoading<V>): ILoading<V> {
    loading.loading = true;
    return loading;
}

export function finishedLoading<V>(loading: ILoading<V>, value: V): ILoading<V> {
    loading.loading = false;
    loading.finished = true;
    loading.failed = false;
    loading.result = value;
    return loading;
}

export function failed<V>(loading: ILoading<V>, error: any): ILoading<V> {
    loading.loading = false;
    loading.finished = true;
    loading.failed = true;
    loading.error = error;
    return loading;
}

export function isSuccess<V>(loading: ILoading<V>): boolean {
    return loading.finished && !loading.failed;
}

export function isFailed<V>(loading: ILoading<V>): boolean {
    return loading.finished && loading.failed;
}

export function getOrThrow<V>(loading: ILoading<V>): V {
    if (isSuccess(loading)) {
        return loading.result as V;
    }

    if (isFailed(loading)) {
        throw loading.error;
    }

    throw new Error('Loading is not complete');
}

export function throwIfError<V>(loading: ILoading<V>): void {
    if (isFailed(loading)) {
        throw loading.error;
    }
}

export function isFinished<V>(loading: ILoading<V>): boolean {
    return loading.finished;
}
