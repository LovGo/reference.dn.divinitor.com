<template>
<div class="title-info">
    <template v-if="loading.loading">
        Loading
    </template>
    <template v-else-if="loaded">
        Success {{ loading.result }}
    </template>
    <template v-else>
        Error {{ loading.error }}
    </template>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ILoading } from '@/models/util/ILoading';
import * as Loading from '@/models/util/ILoading'; 

import TitleProvider from '@/api/TitleProvider';

import ITitle from '@/models/title/ITitle';

interface IData {
    loading: ILoading<ITitle>;
}

export default Vue.extend({
    props: {
        titleId: {
            type: Number as () => number,
            required: true,
        },
    },
    data(): IData {
        return {
            loading: Loading.createLoading(),
        };
    },
    watch: {
        titleId() {
            this.load();
        },
    },
    computed: {
        loaded(): boolean {
            return Loading.isSuccess(this.loading);
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            Loading.startLoading(this.loading);
            try {
                const titleInfo = await TitleProvider.getTitle(this.titleId);
                Loading.finishedLoading(this.loading, titleInfo);
            } catch (error) {
                Loading.failed(this.loading, error);
            }
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.title-info {

}

</style>
