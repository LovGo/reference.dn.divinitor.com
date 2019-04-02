import store from '@/store';

export function ensureRegion(region?: string): string {
    if (!region) {
        return store.state.regionCode;
    }

    return region;
}