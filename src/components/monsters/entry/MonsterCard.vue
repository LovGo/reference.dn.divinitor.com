<template>
    <div class="monster-card">
        <div class="title">
            <div class="remark">
                <span class="iid">#{{ monsterId }}</span>
            </div>
            <div class="head">
                {{ name }}
            </div>
            <div class="remark">
                <span class="level">{{ monsterData.level }}</span> 
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';

import Monster from "@/api/monster/monster";

export default {
    props: ["monsterId", "stub"],
    data: function() {
        return {
            loading: true,
            monsterData: null,
            valid: true,
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        monsterId(to, from) {
            if (to != from) {
                this.fetchData();
            }
        }
    },
    computed: {
        name() {
            if (this.monsterData.name) {
                if (this.monsterData.name.message && this.monsterData.name.id) {
                    return this.monsterData.name.message;
                } else if (this.monsterData.name.id) {
                    return "Monster MID: " + this.monsterData.name.id;
                }
            }
            
            return "Monster #" + this.monsterId;
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.monsterData = null;

            if (this.stub) {
                this.monsterData = this.stub;
                this.loading = false;
                return;
            }

            Monster.getMonster(this.monsterId, this.$store.state.regionCode,
                (res) => {
                    this.monsterData = res;
                    this.loading = false;
                },
                (err) => {

                });
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../../less/core.less";

.monster-card {
    position: relative;
    padding: 4px 0 0 10px;
    min-height: 48px;
    height: 100%;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.375);

    transition: background-color ease-in 0.125s;

    &:hover,
    &.active:hover {
        background: fade(@dv-c-foreground, 30%);
    }

    &.active {
        background: fade(@dv-c-foreground, 20%);
    }
    
    &:hover .title {
        .remark {
            .iid {
                color: @dv-c-body;
            }

            .level::before {
                color: @dv-c-body;
            }
        }
    }
    
    .title {
        flex: 1 1 auto;
        padding-left: 12px;
        padding-top: 0px;
        padding-bottom: 12px;

        &:last-child {
            padding-right: 40px;
        }

        .level {
            color: @dv-c-accent-2;
            &::before {
                content: "LV ";
                font-size: 0.625em;
                color: @dv-c-accent-1;
                transition: color ease-in 0.125s;
            }
        }

        .head {
            margin: -2px 0;
            padding: 0;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-family: @dv-f-geomanist;
            color: @dv-c-foreground;
        }

        .remark {
            font-size: 14px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            word-wrap: break-word;

            .iid {
                font-size: 12px;
                color: fade(@dv-c-body, 20%);
                transition: color ease-in 0.125s;
            }

        }
    }
}
</style>
