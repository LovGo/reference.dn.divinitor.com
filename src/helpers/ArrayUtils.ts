export function zeroRange(end: number, inclusive?: boolean): number[] {
    if (inclusive) {
        ++end;
    }

    let ret = [];
    for (let i = 0; i < end; ++i) {
        ret[i] = i;
    }

    return ret;
}

export function range(start: number, end: number, inclusive?: boolean): number[] {
    return zeroRange(end - start, inclusive).map(v => v + start);
}
