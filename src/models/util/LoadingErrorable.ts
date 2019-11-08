import Vue from 'vue';

export default class LoadingErrorable<V, E> {
    public value: V|null;
    public error: E|null;
    public loading: boolean;
    public started: boolean;
    public customStatus: string;

    constructor() {
        this.loading = false;
        this.started = false;
        this.customStatus = "";
        this.value = null;
        this.error = null;
    }

    public startLoad() {
        this.loading = true;
        this.started = true;
        this.value = null;
        this.error = null;
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
        return !this.loading && this.error == null;
    }
};
