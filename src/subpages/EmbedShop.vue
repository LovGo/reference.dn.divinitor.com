<template>
<div class="embed-shop">
    <shop-browser v-if="valid" :shopId="shopId" :useClick="false" @click="itemClick"/>
    <a href="#" class="hidden" ref="link" target="_blank"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import ShopBrowser from '@/components/item/shop/ShopBrowser.vue';
import * as SafeBase64 from 'urlsafe-base64';
import { IItemShopTabEntry } from '@/models/items/IItemShop';

interface IData {
    shopId: number;
    domain: string;
}

export default Vue.extend({
    components: {
        ShopBrowser,
    },
    data(): IData {
        return {
            shopId: 0,
            domain: '',
        };
    },
    computed: {
        valid(): boolean {
            return !!this.shopId && !isNaN(this.shopId) && !!this.domain;
        },
    },
    mounted() {
        this.shopId = Number(this.$route.query.shopId);
        this.domain = this.$route.query.domain;
    },
    methods: {
        itemClick(slot: IItemShopTabEntry) {
            const url = `https://${this.domain}/items/${slot.itemId}`;
            const a = this.$refs.link as HTMLAnchorElement;
            if (a) {
                a.href = url;
                a.click();
            }
        }
    }
    
})
</script>

<style lang="less">
@import "~@/less/core2.less";
@import "~@/less/common/common.less";

html {
    background: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0;
    margin: 0;
    overflow: hidden;
}

body {
    background: transparent;
    font-family: @dv-f-lato;
    padding: 0;
    margin: 0;
}

.embed-shop {
    margin: 0 auto;
    
    .item-shop, .result {
        margin: 0 auto;
    }
}
</style>