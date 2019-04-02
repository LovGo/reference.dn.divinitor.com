<template>
<div class="title-info">
    <template v-if="loading.loading">
        Loading
    </template>
    <template v-else-if="loaded">
        <div class="title-name" :style="titleStyle">
            {{ title.name.message }}
        </div>
        <div class="title-desc" v-if="title.description.id">
            {{ title.description.message }}
        </div>
        <stat-grid
            v-if="title.states.length"
            :statSet="title.states"
        />
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

import ITitle from '@/models/title/ITitle';
import TitleProvider from '@/api/TitleProvider';

import StatGrid from '@/components/general/StatGrid.vue';

interface IData {
    loading: ILoading<ITitle>;
}

function hexToColor(hexy: string): string {
    if (hexy.startsWith('0x')) {
        hexy = hexy.substring(4);

        return '#' + hexy;
    }

    return hexy;
}

export default Vue.extend({
    components: {
        StatGrid,
    },
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
        },
        title(): ITitle|null {
            return this.loading.result;
        },
        titleStyle(): string {
            if (this.loaded) {
                const title = this.loading.result!;
                const fg = `color: ${hexToColor(title.foregroundColor)}`;
                const bg = `text-shadow: 2px 2px 2px ${hexToColor(title.backgroundColor)}`;
                return `${fg};${bg};`;
            }

            return '';
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
    .title-name {
        letter-spacing: 0.01em;
    }

    .title-desc {
        font-style: italic;
    }
}

</style>
