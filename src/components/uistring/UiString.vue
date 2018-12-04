<template>
<div class="ui-string" :inline="inline">
    <div v-if="message.isSuccess() && format == 'html'" v-html="message.value.message"/>
    <span v-else-if="message.isSuccess()">{{ message.value.message }}</span>
    <span v-else>{{ alt ? alt : "M:" + mid}}</span>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import LoadingErrorable from "@/models/util/LoadingErrorable";
import UiStringProvider, { UiStringFormat } from '@/api/UiStringProvider';
import IUiStringMessage from '@/models/uistring/IUiStringMessage';

interface IData {
    message: LoadingErrorable<IUiStringMessage, any>;
}

export default Vue.extend({
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
            type: String as () => string,
        },
        "alt": {
            type: String as () => string,
        },
        "messageData": {
            type: Object as () => IUiStringMessage,
        },
    },
    data(): IData {
        return {
            message: new LoadingErrorable()
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
            return Number(this.mid);
        }
    },
    methods: {
        fetchData() {
            if (this.messageData) {
                this.message.done(this.messageData);
                return;
            }

            this.message.startLoad();
            UiStringProvider.get(this.id, this.region, this.params, this.format).then((msg) => {
                this.message.done(msg);
            }).catch((err) => {
                this.message.failed(err);
            });
        }
    }
});
</script>

<style lang="less" scoped>
.ui-string {
    &[inline] {
        display: inline-block;
    }
}
</style>
