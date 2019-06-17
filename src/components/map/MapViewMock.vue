<template>
<div class="map-view">
    <template v-if="mapData">
    <div class="hero">
        <div class="hero-image" :style="`background-image: url(${heroImgUrl});`"/>
        <div class="hero-overlay">
            <div class="map-id">
                {{ mapData.id }}
            </div>
            <h1 class="title">
                <div class="welcome">
                    Welcome to
                </div>
                {{ mapData.name.message }}
                <span v-if="mapData.levelUi && mapData.levelUi.id">({{ mapData.levelUi.message }})</span>
            </h1>
            <div class="image-name">
                {{ mapData.loadingImage }}
            </div>
        </div>
    </div>

    <map-basic-info :mapData="mapData"/>

    <map-gates :mapData="mapData"/>

    <!-- {{ mapData }} -->
    </template>
    <template v-else-if="error">
        {{ error }}
    </template>
    <template v-else>
        <loader :loadText="`Loading map ${cleanId}`" />
    </template>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ApiHttpClient } from '@/globals';
import MapProvider from '@/api/MapProvider';
import IGameMap from '@/models/maps/IGameMap';

import Loader from '@/components/util/Loader.vue';
import MapBasicInfo from '@/components/map/MapBasicInfo.vue';
import MapGates from '@/components/map/MapGates.vue';
import { axiosErrorToString } from '../../helpers/AxiosErrorUtils';

interface IData {
    mapData: IGameMap|null;
    error: string;
}

export default Vue.extend({
    components: {
        MapBasicInfo,
        MapGates,
        Loader,
    },
    props: {
        id: {
            type: String as () => string,
        },
    },
    computed: {
        heroImgUrl(): string {
            if (this.mapData) {
                return ApiHttpClient.defaults.baseURL + "/server/na/files/" + this.mapData.loadingImage;
            }
            return '#';
        },
        cleanId(): number {
            const split = this.id.split('-', 2);
            const idPart = split[0];
            return Number(idPart);
        },
        slug(): string {
            if (this.mapData) {
                return `${this.cleanId}-${this.mapData.toolEntries[0].toolName}`;
            }
            return this.id;
        }
    },
    data(): IData {
        return {
            mapData: null,
            error: '',
        };
    },
    watch: {
        id() {
            this.load();
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            this.mapData = null;
            try {
                this.mapData = await MapProvider.getMap(this.cleanId);
                this.updateUrl();
            } catch (e) {
                this.error = axiosErrorToString(e);
            }
        },
        updateUrl() {
            if (this.slug != this.id) {
                this.$router.replace({
                    path: this.$route.path.replace(this.id, this.slug),
                    query: this.$route.query,
                });
            }
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.map-view {
    .hero {
        margin: 30px 0 10px;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 260px;

        .hero-image {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: 0 50%;
            background-attachment: fixed;

            width: 646px;
            height: (646 / 1280) * 768px;
            mask-image: linear-gradient(0deg, rgba(0, 0, 0, 0) 17%, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 83%);
        }

        .hero-overlay {
            position: absolute;
            bottom: 30px;
            left: 20px;

            border-left: 2px solid @dv-c-foreground;
            background: fade(@dv-c-background, 90%);
            padding: 16px;
            white-space: nowrap;

            transition: opacity 0.25s ease-out;
            box-shadow: 0 2px 10px fade(black, 90%);

            .title {
                margin: 0;
                padding: 0;
                font-size: 20px;

                .welcome {
                    font-size: 12px;
                    letter-spacing: 0.1em;
                    color: @dv-c-accent-2;
                }
            }
            
            .map-id {
                position: absolute;
                right: 6px;
                top: 4px;
                text-align: right;
                font-size: 12px;
                color: @dv-c-accent-3;

                &::before {
                    content: "#";
                    color: @dv-c-accent-1;
                }
            }
        }

        .image-name {
            color: @dv-c-body;
            font-size: 10px;
            text-transform: uppercase;
            mix-blend-mode: color-dodge;
        }
    }

    @media @wide-desktop {
        .hero {
            height: 380px;

            .hero-image {
                width: 945px;
                height: (945 / 1280) * 768px;
            }
        }
    }

    @media @tablet {
        .hero {
            height: 320px;

            .hero-image {
                width: 800px;
                height: (800 / 1280) * 768px;
            }

            .hero-overlay {
                padding: 14px;
                .title {
                    font-size: 18px;
                    letter-spacing: 0.25em;
                    .welcome {
                        font-size: 12px;
                    }
                }
            }
        }
    }

    @media @mobile {
        .hero {
            .hero-overlay {
                left: 0;
                right: 0;
                bottom: 0;
                border-left: none;
                white-space: initial;
                border-top: 1px solid @dv-c-foreground;
                // border-bottom: 1px solid @dv-c-foreground;

                .title {
                    font-size: 14px;

                    .welcome {
                        font-size: 10px;
                    }
                }
                // mask-image: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%);
            }
        }
    }
}
</style>

