<template>
<router-link :to="`/maps/${linkTarget}`" class="map-stub">
    <div class="id">{{ id }}</div>
    <template v-if="mapData">
        <div class="name">
            {{ mapData.name.message }}
        </div>
        <div class="gate">
            Gate {{ gate }}
        </div>
    </template>
    <div class="loading" v-else>
        <loader :loadText="id"/>
    </div>
</router-link>
</template>

<script lang="ts">
import Vue from 'vue'
import MapProvider from '../../api/MapProvider';
import IGameMap from '../../models/maps/IGameMap';
import Loader from '@/components/util/Loader.vue';

interface IData {
    mapData: IGameMap|null;
    stageSet: boolean;
}

export default Vue.extend({
    components: {
        Loader,
    },
    props: {
        id: {
            type: Number as () => number,
        },
        gate: {
            type: Number as () => number,
        }
    },
    data(): IData {
        return {
            mapData: null,
            stageSet: false,
        };
    },
    computed: {
        linkTarget(): string {
            if (this.mapData) {
                return `${this.id}-${this.mapData.toolEntries[0].toolName}`;
            }

            return String(this.id);
        }
    },
    watch: {
        id() {
            this.load();
        },
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            this.mapData = null;
            try {
            this.mapData = await MapProvider.getMap(this.id);
            } catch (e) {
                // Try stageset
                try {

                    this.stageSet = true;
                } catch (e2) {
                    
                }
            }
        }
    }
})
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.map-stub {
    border: 1px solid;
    border-color: @dv-c-foreground;
    padding: 10px;
    .padding-left(12px);
    padding-top: 4px;
    margin: 0 -1px -1px 0;
    background: fade(@dv-c-background, 75%);
    transition: background-color 0.125s ease-in;
    cursor: pointer;
    min-height: 45px;

    &:hover {
        background: fade(@dv-c-foreground, 10%);
    }

    .id {
        font-size: 10px;
        color: @dv-c-disabled;
        padding: 0;
        margin: 0;
        line-height: 0.875em;

        &::before {
            content: "#";
        }
    }

    .name {
        font-family: @dv-f-geomanist;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: @dv-c-foreground;
    }

    .gate {
        font-size: 12px;
        font-family: @dv-f-geomanist;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: @dv-c-accent-2;

    }

    .loading {
        padding-top: 4px;
    }

}
</style>
