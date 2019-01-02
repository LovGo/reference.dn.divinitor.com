import { AxiosError } from 'axios';

export function axiosErrorToString(err: any) {
    // is axios error?
    if (typeof err !== 'object') {
        return String(err);
    }

    if (err.response) {
        const axiosError = err as AxiosError;
        const resp = axiosError.response!;
        let errStr = `HTTP ${resp.status} ${resp.statusText}`;
        // is the content JSON?
        // todo
        errStr += `: ${resp.data}`;

        return errStr;
    } else {
        return "Request failed without a response";
    }
}
