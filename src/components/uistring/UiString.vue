<template>
<div class="ui-string" :inline="inline">
    <div class="display" @click="onClick" :title="title">
        <div v-if="message.isSuccess() && format == 'html' && message.value" >
            <span v-html="message.value.message" />
        </div>
        <span v-else-if="message.isSuccess() && message.value">{{ message.value.message }}</span>
        <span v-else>
            <template v-if="format == 'html'"><span v-html="alt"/></template>
            <template v-else>{{ alt ? alt : "M:" + id }}</template>
        </span>
    </div>
    <template v-if="showModal">
        <div class="ui-string-modal" 
            :show="delayShowModal" 
            :loaded="altRegionMessages && altRegionMessages.length > 0">
            <div class="modal-title">Other Translations</div>
            <div class="modal-mid">M:{{ id }}</div>
            <div class="loading" v-if="altRegionMessages.length == 0">
                Loading other locales...
            </div>

            <div class="alt-list">
                <div class="alt-list-entry" 
                    v-for="alt in altRegionMessages"
                    :key="alt.region.id">
                    <div class="dv-section">
                        <div class="dividing title">{{ alt.region.displayNames.default }}</div>
                        <ui-string :message-data="alt.message" :format="format" :prevent-recursive="true" />
                    </div>
                </div>

            </div>
            
            <div class="button-container">
                <button class="dv-button primary" @click="dismissModal">
                    Close
                </button>
            </div>
        </div>
    </template>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import LoadingErrorable from "@/models/util/LoadingErrorable";
import UiStringProvider, { UiStringFormat } from '@/api/UiStringProvider';
import IUiStringMessage from '@/models/uistring/IUiStringMessage';
import RegionProvider,{ defaultRegion } from '@/api/RegionProvider';
import IRegion from '@/models/region/IRegion';
import store from '@/store';

interface IAltRegionMessage {
    region: IRegion;
    message: IUiStringMessage;
}

interface IData {
    message: LoadingErrorable<IUiStringMessage, any>;
    altRegionMessages: IAltRegionMessage[]|null;
    showModal: boolean;
    delayShowModal: boolean;
}

export default Vue.extend({
    name: "ui-string",
    props: {
        "mid": {
            type: String as () => string,
        },
        "params": {
            type: String as () => string,
        },
        "format": {
            type: String as () => UiStringFormat,
        },
        "region": {
            type: String as () => string,
        },
        "inline": {
            type: Boolean as () => boolean,
        },
        "alt": {
            type: String as () => string,
        },
        "messageData": {
            type: Object as () => IUiStringMessage,
        },
        "preventRecursive": {
            type: Boolean as () => boolean,
            default: false,
        },
    },
    data(): IData {
        return {
            message: new LoadingErrorable(),
            altRegionMessages: null,
            showModal: false,
            delayShowModal: false,
        };
    },
    watch: {
        mid(newMid, oldMid) {
            if (newMid != oldMid) {
                this.fetchData();
            }
        },
        params(newParams, oldParams) {
            if (newParams != oldParams) {
                this.fetchData();
            }
        },
        format(newFormat, oldFormat) {
            if (newFormat != oldFormat) {
                this.fetchData();
            }
        },
        region(newRegion, oldRegion) {
            if (newRegion != oldRegion) {
                this.fetchData();
            }
        },
        messageData(newProv, oldProv) {
            if (newProv != oldProv) {
                this.fetchData();
            }
        }
    },
    created() {
        this.fetchData();
    },
    computed: {
        id(): number {
            return Number(this.mid) || (this.messageData && this.messageData.id);
        },
        resolvedRegion(): string {
            return this.region || store.state.regionCode || defaultRegion;
        },
        title() {
            if (!this.preventRecursive) {
                return "Click to view other translations";
            }

            return null;
        }
    },
    methods: {
        fetchData() {
            if (this.messageData) {
                this.message.done(this.messageData);
                return;
            }

            if (this.message.loading) {
                return;
            }
            
            this.message.startLoad();
            UiStringProvider.get(this.id, this.region, this.params, this.format).then((msg) => {
                this.message.done(msg);
            }).catch((err) => {
                this.message.failed(err);
            });
        },
        async loadOtherRegionData() {
            this.altRegionMessages = [];
            const regions = (await RegionProvider.listRegions()).filter((r) => r.shortName != this.resolvedRegion);
            let promises: Promise<IAltRegionMessage>[] = regions.map(async (region) => {
                const message = await UiStringProvider.get(this.id, region.shortName, this.params, this.format);
                return {
                    message,
                    region,
                };
            });
            this.altRegionMessages = await Promise.all(promises);
        },
        onClick() {
            if (this.preventRecursive) {
                return;
            }

            this.showModal = true;
            Vue.nextTick().then(() => {
                this.delayShowModal = true;
            });
            if (this.altRegionMessages == null) {
                this.loadOtherRegionData();
            }
        },
        dismissModal() {
            this.showModal = false;
            this.delayShowModal = false;
        },
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.ui-string {
    margin: 0;
    padding: 0;
    position: relative;
    &[inline] {
        display: inline-block;
    }

    .ui-string-modal {
        position: absolute;
        top: calc(100% + 10px);
        padding: 10px 20px;
        border: 1px solid @dv-c-foreground;
        background: fade(@dv-c-background, 95%);
        z-index: 100;
        min-width: 250px;
        max-width: 50vw;
        min-height: 50px;
        max-height: 10px;
        padding-bottom: 70px;
        font-family: @dv-f-lato;
        font-style: normal;
        font-size: 14px;
        color: @dv-c-body;
        text-transform: none;
        letter-spacing: 0;
        overflow: hidden;
        opacity: 0.0;
        margin-bottom: 20px;

        transition: max-height ease-in 0.25s, opacity ease-in 0.125s;

        .dv-section {
            animation: expand-in 0.25s;
        }

        @keyframes expand-in {
            0% {
                transform: translateX(50px);
                opacity: 0.0;
            }
            50% {
                transform: translateX(0px);
            }
            100% {
                opacity: 1.0;
            }
        }

        &[loaded] {
            max-height: 999px;
        }

        &[show] {
            opacity: 1.0;
        }

        .modal-title {
            font-family: @dv-f-geomanist;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 18px;
            color: @dv-c-foreground;
            white-space: nowrap;
        }

        .modal-mid {
            font-family: @dv-f-geomanist;
            letter-spacing: 0.1em;
            color: @dv-c-accent-2;
            font-size: 12px;
        }

        .button-container {
            position: absolute;
            bottom: 10px;
            left: 0;
            right: 0;
            text-align: center;
        }

        .loading {
            font-family: @dv-f-geomanist;
            text-align: center;
            color: @dv-c-accent-1;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            white-space: nowrap;
        }

        .alt-list {
            white-space: pre-line;
        }
    }
}
</style>
