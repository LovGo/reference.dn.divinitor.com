<template>
<div class="skill-state-effect">
    <div class="effect-id">#{{ stateEffectId }}</div>
    <div class="loading" v-if="loading">
        Loading...
    </div>
    <div class="error" v-if="error">
        {{ error }}
    </div>
    <template v-else-if="effect">
        <div class="entry" v-if="effect._StaticName">
            <div class="key">Static name:</div>
            <div class="value">{{ effect._StaticName }}</div>
        </div>
        <div class="entry">
            <div class="key">Bound State Effect ID:</div>
            <div class="value">{{ effect._StateEffectIndex }}</div>
        </div>
        <div class="entry">
            <div class="key">Effect Output Type:</div>
            <div class="value">{{ effectOutputType }}</div>
        </div>
        <div class="entry" v-if="effect._EffectOutputType === 2">
            <div class="key">Linked FX bones:</div>
            <div class="value">{{ effect._LinkBoneIndex }}</div>
        </div>
        <div class="entry" v-if="effect._EffectSknFileName">
            <div class="key">FX SKN file:</div>
            <div class="value">{{ effect._EffectSknFileName }} ( {{ effect._EffectSknFileName_file || 'unknown'}} )</div>
        </div>
        <div class="entry" v-if="effect._EffectAniFileName">
            <div class="key">FX ANI file:</div>
            <div class="value">{{ effect._EffectAniFileName }} ( {{ effect._EffectAniFileName_file || 'unknown'}} )</div>
        </div>
        <div class="entry" v-if="effect._EffectActFileName">
            <div class="key">FX ACT file:</div>
            <div class="value">{{ effect._EffectActFileName }} ( {{ effect._EffectActFileName_file || 'unknown'}} )</div>
        </div>
        <div class="entry" v-if="effect._ActorActionName">
            <div class="key">Actor forced action:</div>
            <div class="value">{{ effect._ActorActionName }}</div>
        </div>
    </template>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import TableProvider from '@/api/TableProvider';
import IStateEffectTableRow, { EffectOutputType } from '@/models/skills/raw/IStateEffectTableRow';

interface IData {
    loading: boolean;
    effect: IStateEffectTableRow|null;
    error: string;
}

export default Vue.extend({
    props: {
        stateEffectId: {
            type: Number as () => number,
        },
    },
    watch: {
        stateEffectId() {
            this.load();
        }
    },
    data(): IData {
        return {
            loading: false,
            effect: null,
            error: '',
        };
    },
    computed: {
        effectOutputType(): string {
            if (this.effect) {
                return EffectOutputType[this.effect._EffectOutputType];
            }
            
            return '';
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            try {
                this.loading = true;
                this.error = '';
                this.effect = await TableProvider.getTableRow<IStateEffectTableRow>('stateeffecttable', this.stateEffectId, undefined, {
                    fileresolve: ['_EffectSkinFileName', '_EffectAniFileName', '_EffectActFileName'],
                });
                this.loading = false;
            } catch (error) {
                this.loading = false;
                this.error = String(error);
            }
        }
    }
})
</script>

<style lang="less" scoped>
@import "~@/less/core.less";

.skill-state-effect {
    position: relative;
    padding: 8px 12px 4px;
    padding-top: 12px;
    border-left: 1px solid @dv-c-accent-2;
    margin-bottom: 10px;
    
    .effect-id {
        font-size: 12px;
        position: absolute;
        top: 2px;
        left: 12px;
    }
    
    .entry {
        line-height: 20px;

        .key {
            display: inline-block;
            .margin-right(0.3em);
            text-transform: uppercase;
            font-family: @dv-f-geomanist;
            font-size: 12px;
            line-height: 20px;
            color: @dv-c-foreground;
            vertical-align: middle;
        }

        .value {
            display: inline-block;
            vertical-align: middle;
        }
    }
}
</style>