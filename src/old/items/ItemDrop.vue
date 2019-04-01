<template>
    <div class="itemdrop">
        <div class="prompt">
            <label for="dropid">Drop ID</label>
            <input type="text" placeholder="Enter Drop ID" v-model="dropId" id="dropid" />
        </div>
        <item-drop-list :dropId="dropId" />
    </div>
</template>

<script>

import Vue from 'vue';
import ItemIcon from "@/old/game/ItemIcon";
import ItemIconTooltip from "@/old/items/ItemIconTooltip";
import ItemCard from "@/old/items/ItemCard";
import ItemDropListComponent from "@/old/items/ItemDropListComponent";
import ItemStat from "@/old/api/item/itemstat";

import Item from "@/old/api/item/item";
import ItemFilter from "@/old/api/item/itemfilter";

Vue.component('item-icon', ItemIcon);
Vue.component('item-icon-tooltip', ItemIconTooltip);
Vue.component('item-card', ItemCard);
Vue.component('item-drop-list', ItemDropListComponent);

export default {
    data: function() {
        return {
            dropId: this.$route.params.id,
        }
    },
    created() {
    },
    computed: {
    },
    watch: {
        '$route'(to, from) {
            this.dropId = this.$route.params.id;
        },
        dropId(to, from) {
            if (to != from) {
                const val = this.dropId;

                if (!val || val.length == 0) {
                    this.$router.push({ 
                        name: 'item-drop'
                    });
                } else {
                    this.$router.push({ 
                        name: 'item-drop', 
                        params: {
                            id: this.dropId
                        },
                    });
                }
            }
        }
    },
    methods: {
    },
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.itemdrop {
    
    .item-list {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        max-height: 500px;
        overflow-y: scroll;
        border-top: 2px solid @dv-c-accent-1;
        border-bottom: 2px solid @dv-c-accent-1;

        .result {
            &.no {
                display: none;
            }

            &:first-child.no {
                display: block;
            }
        }

        .entry {
            flex: 1 1 380px;
            border: 1px solid @dv-c-foreground;
            border-top-color: transparent;

            &:first-child {
                border-top-color: @dv-c-foreground;
            }

            @media only screen and (min-width:@min-desktop-wide-width) {
                flex: 0 1 460px;
                .border-left(none);
                &:first-child,
                &:nth-child(2) {
                    border-top-color: @dv-c-foreground;
                }
                &:nth-child(2n + 1) {
                    .border-left(1px solid @dv-c-foreground);
                }
                &:last-child {
                    // border-right: 1px solid @dv-c-foreground;
                }
                &:first-child:last-child {
                    // border-right: 1px solid @dv-c-foreground;
                }

            }
        }
    }
}
</style>
