<template>
<div class="title-info">
    
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ILoading } from '@/models/util/ILoading';
import * as Loading from '@/models/util/ILoading'; 

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
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            if (!Loading.isFinished(this.loading)) {
                // todo
                return;
            }

            Loading.startLoading(this.loading);
            
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.title-info {

}

</style>
