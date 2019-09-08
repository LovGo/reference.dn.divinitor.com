<template>
<div class="locale-select">
    <div class="selector" v-on:click="showSelector" :noclick="!canChangeServer">
        <i class="fa fa-globe"></i>{{ renderedName }} {{ renderedVersion}}
    </div>

    <div class="region-selector" v-if="showSelect">
        <div class="container">
            <div class="top accent-box"></div>
            <div class="toast-body" :disable="disable">
                <h1>Select a region</h1>
                <region-select :selection="selectedRegionCode" :regions="regions.value" v-on:select="selectRegion"/>
                <div class="button-row">
                    <button class="cancel" v-on:click="cancel">Cancel</button>
                </div>
            </div>
            <div class="bottom accent-box"></div>
        </div>
        <div class="reloading" v-if="reloading" :viz="reloading">
            <div class="reload">
                <div class="container">
                    <div class="sub">Divinitor</div>
                    <div class="title">Minerva</div>
                    <loader
                        loadText="Reloading" 
                        altText="Please wait" />  
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import RegionSelect from "@/components/region/RegionSelect.vue";
import LoadingErrorable from '@/models/util/LoadingErrorable';
import IRegion from '@/models/region/IRegion';
import RegionProvider from '@/api/RegionProvider';
import Loader from "@/components/util/Loader.vue";
import { Actions } from '@/storemutations';

interface IData {
    showSelect: boolean;
    regions: LoadingErrorable<IRegion[], any>;
    regionList: IRegion[];
    disable: boolean;
    reloading: boolean;
}

export default Vue.extend({
    components: {
        RegionSelect,
        Loader,
    },
    data(): IData {
        return {
            showSelect: false,
            regions: new LoadingErrorable(),
            regionList: [],
            disable: false,
            reloading: false,
        };
    },
    computed: {
        selectedRegionCode(): string {
            return this.$store.state.regionCode;
        },
        selectedRegion(): IRegion|null {
            const ret = this.regionList.find(r => r.shortName == this.selectedRegionCode);
            if (!ret) {
                return null;
            }

            return ret;
        },
        renderedName(): string {
            if (this.selectedRegion) {
                const localizedName = this.selectedRegion.displayNames[this.selectedRegion.defaultLocale];
                const defaultName = this.selectedRegion.displayNames.default;
                if (localizedName && localizedName !== defaultName) {
                    return `${localizedName} (${defaultName})`;
                }

                return defaultName;
            }

            return 'Unknown region';
        },
        renderedVersion(): string {
            if (this.selectedRegion) {
                return `v${this.selectedRegion.version || '?'}`;
            }

            return '';
        },
        canChangeServer(): boolean {
            return this.regionList.length > 1;
        }
    },
    mounted() {
        this.loadRegions();
    },
    methods: {
        async showSelector() {
            if (!this.canChangeServer) {
                return;
            }

            this.showSelect = true;
            await Vue.nextTick();
            this.$anime({
                targets: ".region-selector",
                opacity: {
                    value: [0.0, 1.0],
                    elasticity: 0,
                },
                duration: 2000,
            });
            this.$anime({
                targets: ".region-selector .container",
                translateY: [-200, "-50%"],
                translateX: ["-50%", "-50%"],
                elasticity: 5,
                duration: 1000,
            });
        },
        loadRegions() {
            this.regions.startLoad();
            RegionProvider.listRegions().then((regions) => {
                this.regions.done(regions);
                this.regionList = regions;
            });
        },
        selectRegion(region: IRegion) {
            this.disable = true;
            this.reloading = true;
            this.$store.dispatch(Actions.SetRegion, region.shortName);
            const ani = this.$anime({
                targets: ".region-selector .container",
                opacity: {
                    value: [1.0, 0.0],
                    elasticity: 0,
                },
                translateY: [0, -10],
                translateX: ["-50%", "-50%"],
                duration: 1000,
            });
            ani.finished.then(() => {
                window.location.reload();
            });
        },
        cancel() {
            this.disable = true;
            const ani = this.$anime({
                targets: ".region-selector",
                opacity: {
                    value: [1.0, 0.0],
                    elasticity: 0,
                },
                translateY: [0, 10],
                duration: 1000,
            });
            ani.finished.then(() => {
                this.showSelect = false;
                this.disable = false;
            });
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.locale-select {
    user-select: none;

    .selector {
        .text-align(right);
        color: @dv-c-accent-2;
        font-family: @dv-f-lato;
        letter-spacing: 0.2em;
        font-size: 12px;
        text-transform: uppercase;
        font-weight: normal;
        transition: color ease-in 0.125s;
        cursor: pointer;
        white-space: nowrap;
        // pointer-events: none;

        &:hover {
            color: @dv-c-foreground;
        }

        &[noclick] {
            cursor: default;
            &:hover {
                color: @dv-c-accent-2;
            }
        }
    }

    .region-selector {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100;
        background: fade(@dv-c-background, 80%);
        @supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
            background: fade(@dv-c-background, 40%);
            backdrop-filter: blur(8px);
        }

        &[disable] {
            pointer-events: none;
        }

        .container {
            position: absolute;
            top: 50%;
            left: 50%;

            .accent-box {
                background-color: @dv-c-background;
                border: 1px solid @dv-c-foreground;
                width: 86%;
                height: 4px;
                margin: 0 auto;
                padding: 0;
                &.top {
                    border-bottom: none;
                }
                &.bottom {
                    border-top: none;
                }
            }
    
            .toast-body {
                position: relative;
                background-color: @dv-c-background;
                border: 1px solid @dv-c-foreground;
                padding: 10px 20px 40px 20px;
                min-width: 500px;

                h2 {
                    margin-top: 0;
                }

                h1 {
                    font-size: 20px;
                    margin-bottom: 8px;
                }

                .button-row {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -24px;
                    text-align: center;

                    button {
                        width: 120px;

                        &.primary:hover {
                            background-color: lighten(@dv-c-green, -20%);
                            border-color: @dv-c-green;
                            color: lighten(@dv-c-green, 40%);
                        }
                        
                        &.cancel:hover {
                            background-color: lighten(@dv-c-red, -20%);
                            border-color: @dv-c-red;
                            color: lighten(@dv-c-red, 40%);
                        }
                    }
                }
            }
        }
        
        @media @mobile {
            .container {
                width: 100%;

                .toast-body {
                    margin: 0 4px;
                    padding: 20px 10px 30px 10px;
                    min-width: 0;

                    h1 {
                        text-align: center;
                    }
                }
            }
        }

        .reloading {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            transform: none;
            z-index: 200;
            text-align: center;
            background-color: transparent;
            transition: background-color ease-in 1s;

            &[viz] {
                background-color: @dv-c-background;
            }

            .reload {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                padding-left: 180px;

                .container {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    font-weight: normal;
                    padding: 0;
                    margin: 0;

                    text-transform: uppercase;

                    .border-left(4px solid #98BCD4);
                    padding: 8px 16px;
                    animation: 0.25s ease-in 0s 1 startup-fade-in;
                    .text-align(left);

                    .title {
                        font-weight: normal;
                        padding: 0;
                        margin: 0;
                        letter-spacing: 0.3em;
                        color: #98BCD4;
                        font-size: 48px;
                    }

                    .sub {
                        letter-spacing: 0.3em;
                        padding-left: 3px;
                        color: #3B6E96;
                    }
                }

                @media @mobile {
                    .container {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 230px;
                        white-space: nowrap;

                        .title {
                            font-size: 36px;
                        }
                        .sub {
                            font-size: 16px;
                        }
                    }
                }
            }
        }
    }
}


@media only screen and (max-width: 650px) {
    
    .selector {
        top: 64px;
        left: 0;
        right: 0;
        text-align: center;
    }
}
</style>
