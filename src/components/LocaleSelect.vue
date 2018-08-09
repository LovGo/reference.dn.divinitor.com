<template>
  <div class="locale-select">
    <div class="selector" v-on:click="showSelector" :noclick="noclick">
        <i class="fa fa-globe"></i> <span v-if="selectedRegion">{{ selectedRegion.displayNames.default }} v{{selectedRegion.version}}</span>
    </div>

    <div class="region-selector" v-if="showSelect">
        <div class="container" v-if="!reloading">
            <div class="top accent-box"></div>
            <div class="toast-body">
                <h2>Select Region</h2>
                <div class="regions">
                    <div class="region" v-for="r in availableRegions" :key="r.id" v-on:click="select(r)" :active="r.id == selectedRegion.id">
                        <div class="region-header">
                            <div class="head">{{ getRegionLocalizedName(r) }}</div>
                            <div class="subheader">{{r.displayNames.default}}</div>
                        </div>

                        <div class="version">
                            v{{ r.version }}
                        </div>
                    </div>
                </div>
                <div class="button-row">
                    <button class="primary" v-on:click="handleOk">OK</button>
                    <button class="cancel" v-on:click="handleCancel">Cancel</button>
                </div>
            </div>
            <div class="bottom accent-box"></div>
        </div>
        <div class="container reloading" v-else :viz="reloading">
            <div class="reload">
                <load-indicator
                    loadText="Reloading Minerva" 
                    altText="Please wait" />  
            </div>
        </div>
    </div>
  </div>
</template>

<script>
const METRIC_PREFIX = "interaction.localeSelect"

import Region from "@/api/region";
export default {
    name: 'locale-select',
    props: ["noclick"],
    data () {
        return {
            initialRegion: null,
            selectedRegion: null,
            showSelect: false,
            availableRegions: null,
            reloading: false,
            loading: {
                available: true,
            }
        }
    },
    created() {
        let rc = this.$store.state.regionCode;
        Region.getRegionByShortName(rc).then((r) => {
            this.selectedRegion = r;
            this.initialRegion = r;
        });
    },
    methods: {
        showSelector() {
            if (this.noclick) {
                return;
            }

            this.showSelect = true;
            appInsights.trackEvent(`${METRIC_PREFIX}.region.ui.enter`);
            if (!this.availableRegions) {
                this.loadRegions();
            }
        },
        loadRegions() {
            this.loading.available = true;
            Promise.all(Region.SUPPORTED_REGIONS.map((s) => Region.getRegionByShortName(s))).then((regions) => {
                this.availableRegions = regions;
                this.loading.available = false;
            });
        },
        select(region) {
            this.selectedRegion = region;
        },
        getRegionLocalizedName(region) {
            let loc = region.displayNames[region.defaultLocale];
            if (!loc) {
                return region.displayNames.default;
            }

            return loc;
        },
        handleOk() {
            appInsights.trackEvent(`${METRIC_PREFIX}.region.select`, {
                from: this.initialRegion.shortName,
                to: this.selectedRegion.shortName,
            });
            appInsights.trackEvent(`${METRIC_PREFIX}.region.ui.exit.ok`);
            this.$store.dispatch("updateRegion", this.selectedRegion.shortName);
            this.reloading = true;

            // Remove any lingering region overrides
            delete this.$route.query.region;
            this.$router.replace({ path: this.$route.path, query: this.$route.query, params: this.$route.params });

            this.initialRegion = this.selectedRegion;
            window.setTimeout(() => window.location.reload(), 1000);
        },
        handleCancel() {
            appInsights.trackEvent(`${METRIC_PREFIX}.region.ui.exit.cancel`);
            this.selectedRegion = this.initialRegion;
            this.showSelect = false;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../less/core.less";

.locale-select {
    position: absolute;
    top: 14px;
    right: 20px;
    // cursor: not-allowed;

    .selector {
        text-align: right;
        color: @dv-c-accent-2;
        font-family: @dv-f-lato;
        letter-spacing: 0.2em;
        font-size: 12px;
        text-transform: uppercase;
        font-weight: normal;
        transition: color ease-in 0.125s;
        cursor: pointer;
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

        .container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

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
                min-height: 200px;

                h2 {
                    margin-top: 0;
                }

                .regions {
                    margin-top: 20px;
                    display: flex;
                    position: relative;
                    flex-direction: row;
                    flex-wrap: wrap;

                    .region {
                        flex: 0 0 240px;
                        position: relative;
                        border: 1px solid @dv-c-foreground;
                        cursor: pointer;
                        
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

            &.reloading {
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                transform: none;
                z-index: 200;
                text-align: center;
                background-color: transparent;
                transition: background-color ease-in 0.75s;

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
                }
            }
        }

    }
}


@media only screen and (max-width: 650px) {
    .locale-select {
        top: 64px;
        left: 0;
        right: 0;
        text-align: center;
    }
}

</style>
