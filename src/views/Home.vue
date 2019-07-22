<template>
<div class="home">
    <h1>Welcome</h1>

    <div class="warn toast">
        <div class="content">
            <div class="heading">Under construction!</div>
            <p>
                Pardon our dust, bugs, and broken features. We're in beta.
            </p>
        </div>
    </div>

    <p>
        This site provides information on various aspects of Dragon Nest. Information on monsters, 
        bosses, nests, items, skills, and more are or will be available here.
    </p>
    <p>
        Begin by selecting a category in the navigation pane. 
        <template v-if="!staticServer">
            Change regions using the region selector in the top right.
        </template>
    </p>
    <p v-if="pserverHome || pserverDiscord || pserverDonate">
        <a :href="pserverHome" target="_blank" v-if="pserverHome">{{ pserverName }} Homepage<br/></a>
        <a :href="pserverDiscord" target="_blank" v-if="pserverDiscord">Join the {{ pserverName }} Discord server!<br/></a>
        <a :href="pserverDonate" target="_blank" v-if="pserverDonate">Support {{ pserverName }} by donating!</a>
    </p>
    <p v-else>
        <a href="https://discord.gg/BeqJcCq" target="_blank">Join Vahr's Discord server!</a><br/>
        <a href="https://www.patreon.com/divinitor" target="_blank">Support Vahr on Patreon!</a>
    </p>

    <h2>Region Information</h2>
    <div class="loading" v-if="regionInfo.loading">
        <loader loadText="Region Information" />
    </div>
    <div class="warn toast" v-if="regionInfo.error">
        <div class="content">
            <div class="heading">
                Error
            </div>
            <p>{{ regionInfo.error }}</p>
        </div>
    </div>
    <div class="tag-table" v-if="regionInfo.value">
        <div class="row">
            <div class="rowhead">Region</div>
            <div class="data">{{ regionInfo.value.displayNames.default }}</div>
        </div>
        <div class="row">
            <div class="rowhead">Version</div>
            <div class="data">{{ regionInfo.value.version }}</div>
        </div>
        <div class="row">
            <div class="rowhead">Patched</div>
            <div class="data">{{ regionInfo.value.patchedTime | moment("MMM DD YYYY") }}</div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import Loader from "@/components/util/Loader.vue";
import UiString from "@/components/uistring/UiString.vue";

import LoadingErrorable from "@/models/util/LoadingErrorable";
import IRegion from "@/models/region/IRegion";

import RegionProvider from "@/api/RegionProvider";

interface IData {
    regionInfo: LoadingErrorable<IRegion, any>;
}

export default Vue.extend({
    components: {
        Loader,
        UiString,
    },
    data(): IData {
        return {
            regionInfo: new LoadingErrorable(), 
        };
    },
    created() {
        this.fetchData();
    },
    computed: {
        pserverHome(): string {
            return process.env.VUE_APP_STATIC_REGION_HOMEPAGE!;
        },
        pserverDiscord(): string {
            return process.env.VUE_APP_STATIC_REGION_DISCORD!;
        },
        pserverDonate(): string {
            return process.env.VUE_APP_STATIC_REGION_DONATE!;
        },
        pserverName(): string {
            return (this.regionInfo.value && this.regionInfo.value.displayNames.default) || '';
        },
        staticServer(): string {
            return process.env.VUE_APP_USE_STATIC_SERVER!;
        },
    },
    methods: {
        fetchData() {
            this.regionInfo.startLoad();
            RegionProvider.getRegionByShortName(this.$store.state.regionCode).then((region) => {
                this.regionInfo.done(region);
            }).catch((error) => {
                this.regionInfo.error(error);
            });
        }
    }
})
</script>

<style lang="less" scoped>
@import "./../less/core.less";

.tag-table {
    .row {
        position: relative;
        vertical-align: center;
        .rowhead {
            width: 70px;
            font-family: @dv-f-lato;
            color: @dv-c-foreground;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            display: inline-block;
        }
        .data {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            display: inline-block;
        }
    }
}
</style>
