<template>
    <div class="itempage">
        <div v-if="loading">
            Loading
        </div>
        <div v-else>
            <div class="header">
                <div class="icon">
                    <item-icon 
                        class="centering"
                        :iconIndex="itemData.iconIndex" 
                        :rank="itemData.rank"
                        :type="itemData.type.type"
                        :count="itemData.maxStack"
                    ></item-icon>
                </div>
                <div class="title">
                    <h2 class="head">{{ itemData.name.name }}</h2>
                    <div class="remark">
                        <span v-if="itemData.level > 0" class="level">{{ itemData.level }} </span>
                        <span :class="itemData.rank.toLowerCase()">{{ itemData.rank }}</span> ITEM
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import ItemIcon from "@/components/game/ItemIcon";

import Item from "@/api/item/item";

Vue.component('item-icon', ItemIcon);

export default {
    name: "item-page",
    props: ["itemId"],
    data: function() {
        return {
            loading: true,
            itemData: null,
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        itemId(to, from) {
            if (to != from) {
                this.fetchData();
            }
        }
    },
    methods: {
        fetchData() {
            Item.getItem(this.itemId, this.$store.state.regionCode,
                (res) => {
                    this.itemData = res;
                    this.loading = false;
                },
                (err) => {

                });
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.itempage {
    width: 100%;
    .header {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: row;

        .icon{ 
            flex: 0 1 50px;
            vertical-align: middle;
            
            .centering {
                position: absolute;
                top: 50%;
                transform: translate(0px, -50%);
            }
        }

        .title {
            flex: 1 1 auto;
            margin-left: 10px;
            border-left: 2px solid @dv-c-accent-1;
            padding-left: 12px;
            padding-top: 8px;
            padding-bottom: 8px;

            .head {
                margin: -4px 0;
                padding: 0;
                font-size: 24px;
            }

            .remark {
                font-size: 12px;
                letter-spacing: 0.2em;

                .level {
                    color: @dv-c-accent-2;
                    &::before {
                        content: "LV ";
                        font-size: 0.625em;
                        color: @dv-c-accent-1;
                    }
                }

                .legendary {
                    color: #F050A0;
                }
                .unique {
                    color: #C080C0;
                }
                .epic {
                    color: #F09000;
                }
                .rare {
                    color: #4080F0;
                }
                .magic {
                    color: #80C040;
                }
                .normal {
                    color: #FFFFFF;
                }
            }
        }

    }
}
</style>
