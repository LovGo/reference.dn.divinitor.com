<template>
<div class="page-section map-gates">
    <div class="title">Gates</div>

    <div class="gate" v-for="(gate, i) in gates" :key="i">
        <div class="gate-name">
            <template v-if="gate.title.id">
                {{ gate.title.message }}
            </template>
            <template v-else>
                (No Name)
            </template>
        </div>
        <div class="options">
            <map-stub v-for="(o, j) in gate.options" :key="j" :id="o.mapId" :gate="o.startGate" />
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import IGameMap, { IGateInfo } from '../../models/maps/IGameMap';
import MapStub from '@/components/map/MapStub.vue';
export default Vue.extend({
    components: {
        MapStub,
    },
    props: {
        mapData: {
            type: Object as () => IGameMap,
        }
    },
    computed: {
        gates(): IGateInfo[] {
            return this.mapData.gates.filter((g) => g.options.length && g.options.findIndex(o => o.mapId != 0) !== -1);
        }
    }
})
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.map-gates {
    .gate {
        margin: 10px 0 16px;
        .gate-name {
            font-size: 18px;
            text-transform: uppercase;
            font-family: @dv-f-geomanist;
            letter-spacing: 0.1em;
            margin-bottom: 4px;
            color: @dv-c-accent-2;
        }

        .options {
            display: grid;
            grid-template: 1fr;
            grid-auto-rows: max-content;

            @media @min-tablet {
                grid-template-columns: repeat(2, 50%);
            }
        }
    }
}
</style>
