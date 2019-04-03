<template>
<div class="title-info">
    <template v-if="loading.loading">
        <loader loadText="Title Info" />
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
        <toast type="warn">
            <template slot="header">
                Oops
            </template>
            We were unable to load this title's data. Please try again later.
        </toast>
    </template>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ILoading } from '@/models/util/ILoading';
import * as Loading from '@/models/util/ILoading'; 
import Loader from '@/components/util/Loader.vue';
import Toast from '@/components/util/Toast.vue';

import ITitle from '@/models/title/ITitle';
import TitleProvider from '@/api/TitleProvider';

import StatGrid from '@/components/general/StatGrid.vue';

interface IData {
    loading: ILoading<ITitle>;
}

function hexToColor(hexy: string): string {
    if (hexy.startsWith('0x')) {
        const colorNum = parseInt(hexy.substring(2), 16);
        const alpha = (((colorNum >> 24) & 0xFF) / 255);
        const r = ((colorNum >> 16) & 0xFF);
        const g = ((colorNum >> 8) & 0xFF);
        const b = (colorNum & 0xFF);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return hexy;
}

export default Vue.extend({
    components: {
        StatGrid,
        Loader,
        Toast,
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
                const bg = `text-shadow: 0px 0px 2px ${hexToColor(title.backgroundColor)}`;
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
        letter-spacing: 0.05em;
        font-size: 18px;
        padding: 4px 8px;
        margin: 4px 0;
    }

    .title-desc {
        font-style: italic;
        margin: 4px 0;
    }
}

</style>
