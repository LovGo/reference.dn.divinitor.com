<template>
<div class="item-charm-required-key" v-if="this.keys.length > 0">
    <div class="dv-section">
        <div class="dividing title">
            Box Key
        </div>

        This box requires the following item(s) to be opened:

        <responsive-card-list :size="this.keys.length">
            <responsive-card-list-entry
                v-for="key in this.keys"
                :key="key[0]">
                <item-card :itemId="key[0]" :count="key[1]" />
            </responsive-card-list-entry>
        </responsive-card-list>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import ItemCard from "@/old/items/ItemCard.vue";
import ResponsiveCardList from "@/components/util/ResponsiveCardList.vue";
import ResponsiveCardListEntry from "@/components/util/ResponsiveCardListEntry.vue";
import ItemsProvider from '@/api/ItemsProvider';

interface IData {
    keys: [number, number][]
}

export default Vue.extend({
    components: {
        ItemCard,
        ResponsiveCardList,
        ResponsiveCardListEntry,
    },
    props: {
        itemId: {
            type: Number as () => number,
            required: true,
        },
    },
    watch: {
        itemId() {
            this.load();
        }
    },
    data(): IData {
        return {
            keys: [],
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            this.keys = await ItemsProvider.getItemCharmRequiredKeys(this.itemId);
        }
    }
});
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-charm-required-key {

}
</style>
