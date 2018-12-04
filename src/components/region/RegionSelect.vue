<template>
<div class="region-select">
    <div class="regions">
        <div class="region"
            v-for="r in regions"
            :key="r.id"
            v-on:click="select(r)"
            :active="r.shortName == selected">
            <div class="region-header">
                <div class="head">{{ getRegionLocalizedName(r) }}</div>
                <div class="subheader">{{r.displayNames.default}}</div>
            </div>

            <div class="version">
                v{{ r.version }}
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import IRegion from "@/models/region/IRegion";

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
            flex: 1 1 49.5%;
            min-width: 0;
            position: relative;
            border: 1px solid @dv-c-foreground;
            cursor: pointer;
            transition: background-color 0.125s ease-in;
            
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
                right: 8px;
                transform: translate(0%, -50%);
                font-size: 12px;
                font-family: @dv-f-geomanist;
                color: @dv-c-accent-1;
            }
        }
    }
}
</style>
