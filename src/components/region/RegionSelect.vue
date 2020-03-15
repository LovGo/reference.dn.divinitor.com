<template>
<div class="region-select">
    <div class="regions">
        <div class="region"
            v-for="r in displayRegions"
            :key="r.id"
            v-on:click="select(r)"
            :active="r.shortName == selected">
            <div class="region-header">
                <div class="head">{{ getRegionLocalizedName(r) }}</div>
                <div class="subheader">{{ subscript(r) }}</div>
            </div>

            <div class="version" v-if="r.version">
                v{{ r.version }}
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import IRegion from "@/models/region/IRegion";
import { localRegion } from '../../api/RegionProvider';

interface IData {
    selected: string;
}

export default Vue.extend({
    props: {
        "regions": {
            type: Array as () => IRegion[], 
        },
        "selection": {
            type: String as () => string,
        },
    },
    watch: {
        selection() {
            this.selected = this.selection;
        },
    },
    data(): IData {
        return {
            selected: "",
        }
    },
    computed: {
        displayRegions(): IRegion[] {
            return this.regions.filter((v) => v.id > 0 || this.selected === localRegion);
        }
    },
    mounted() {
        this.selected = this.selection;  
    },
    methods: {
        select(region: IRegion) {
            this.$emit("select", region);
            this.selected = region.shortName;
        },
        getRegionLocalizedName(region: IRegion): string {
            let loc = region.displayNames[region.defaultLocale];
            if (!loc) {
                return region.displayNames.default;
            }

            return loc;
        },
        getRegionCurrentLocalizedName(region: IRegion): string {
            let loc = region.displayNames[region.defaultLocale];
            const selectedRegion = this.regions.find((r) => r.shortName == this.selected);
            if (!selectedRegion) {
                return loc || region.displayNames.default;
            }

            return region.displayNames[selectedRegion.defaultLocale] || region.displayNames.default;
        },
        subscript(region: IRegion): string {
            const defaultName = region.displayNames.default;
            const regionLocalized = this.getRegionLocalizedName(region);
            const currentLocalized = this.getRegionCurrentLocalizedName(region);

            if (defaultName !== currentLocalized &&
                regionLocalized !== defaultName &&
                regionLocalized !== currentLocalized) {
                return `${currentLocalized} | ${defaultName}`;
            }

            if (regionLocalized === currentLocalized) {
                return defaultName;
            }

            return currentLocalized;
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.region-select {
    width: 100%;
    .regions {
        display: flex;
        position: relative;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        min-width: 0;

        .region {
            flex: 0 1;
            position: relative;
            border: 1px solid @dv-c-foreground;
            border-top-width: 0;
            box-sizing: border-box;
            cursor: pointer;
            transition: background-color 0.125s ease-in;
    
            // Desktop view (wide)
            @media @min-mobile {
                flex-basis: 50%;
                &:first-child, &:nth-child(2) {
                    border-top-width: 1px;
                }
                &:nth-child(2n) {
                    .border-left-width(0);
                }
            }

            // Narrow view (tablet and below)
            flex-basis: 100%;
            &:first-child {
                border-top-width: 1px;
            }

            &:hover {
                background: fade(@dv-c-foreground, 20%);
            }

            &[active] {
                background: fade(@dv-c-accent-3, 20%);
            }

            .region-header {
                text-transform: uppercase;  
                padding: 12px;
                .head {
                    font-family: @dv-f-geomanist;
                    font-size: 16px;
                    color: @dv-c-foreground;
                    letter-spacing: 0.1em;
                }

                .subheader {
                    font-family: @dv-f-lato;
                    font-size: 12px;
                    color: @dv-c-accent-2;
                    letter-spacing: 0.2em;
                }
            }

            .version {
                position: absolute;
                top: 50%;
                .right(8px);
                transform: translate(0%, -50%);
                font-size: 12px;
                font-family: @dv-f-geomanist;
                color: @dv-c-accent-1;
            }
        }
    }
}
</style>
