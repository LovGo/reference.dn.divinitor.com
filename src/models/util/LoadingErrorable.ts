export default class LoadingErrorable<V, E> {
    public value?: V;
    public error?: E;
    public loading: boolean;
    public started: boolean;
    public customStatus: string;

    constructor() {
        this.loading = false;
        this.started = false;
        this.customStatus = "";
    }

    public startLoad() {
        this.loading = true;
        this.started = true;
        this.value = undefined;
        this.error = undefined;
    }

    public done(value: V): LoadingErrorable<V, E> {
        this.value = value;
        this.loading = false;
        return this;
    }

    public failed(error: E): LoadingErrorable<V, E> {
        this.error = error;
        this.loading = false;
        return this;
    }

    public isSuccess(): boolean {
        return !this.loading && this.error == undefined;
    }
};
