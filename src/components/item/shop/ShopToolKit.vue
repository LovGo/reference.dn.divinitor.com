<template>
<div class="shop-toolkit">
    <input type="number" v-model.number="shopId"/>
    <div class="browser">
        <shop-browser :shopId="shopId" v-if="shopId"/>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import ShopBrowser from './ShopBrowser.vue';

interface IData {
    shopId: number;
}

export default Vue.extend({
    components: {
        ShopBrowser,
    },
    data(): IData {
        return {
            shopId: 0,
        };
    },
})
</script>

<style lang="less" scoped>

.shop-toolkit {
    .browser {
        margin-top: 120px;
    }
}

</style>