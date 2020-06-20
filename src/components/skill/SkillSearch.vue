<template>
<div class="skill-search">
    <h2>Search</h2>
    <form class="search-form" v-on:submit.prevent="searchSkill">
        <div class="name-class-filter">
            <input id="filter-name" type="text" v-model="query" placeholder="Skill name or ID"/>
        </div>
        <div class="button-row">
            <button class="submit" v-on:click.prevent="searchSkill" :disabled="!valid">Search</button>
        </div>
    </form>
    <div class="result-wrapper">
        <transition name="fade">
            <div v-if="loading" class="loading">
                <div class="loader-box">
                    <div class="loader"></div>
                    <div class="label">Loading</div>
                </div>
            </div>
        </transition>
        
        <div class="results">
            <responsive-card-list>
                <responsive-card-list-entry
                    v-for="skill in this.skills"
                    :key="skill.id">
                    <div class="card">
                        <skill-stub-link :skillData="skill" :fill="true" />
                    </div>
                </responsive-card-list-entry>
            </responsive-card-list>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import SkillProvider from "@/api/SkillProvider";
import ResponsiveCardList from "@/components/util/ResponsiveCardList.vue";
import ResponsiveCardListEntry from "@/components/util/ResponsiveCardListEntry.vue";
import SkillStubLink  from "@/components/skill/SkillStubLink.vue";
import ISkill from '../../models/skills/ISkill';

interface IData {
    query: string;
    loading: boolean;
    skills: ISkill[];
}

export default Vue.extend({
    components: {
        ResponsiveCardList,
        ResponsiveCardListEntry,
        SkillStubLink,
    },
    props: {
        "initialQuery": {
            type: String as () => string,
        },
    },
    data(): IData {
        return {
            query: this.initialQuery,
            loading: false,
            skills: [],
        };
    },
    watch: {
        initialQuery() {
            this.query = this.initialQuery;
            this.searchSkill();
        }
    },
    computed: {
        valid(): boolean {
            return !!this.query && !this.loading;
        },
    },
    mounted() {
        this.searchSkill();
    },
    methods: {
        async searchSkill() {
            if (!this.valid) {
                return;
            }

            this.loading = true;
            const asN = Number(this.query);
            if (!isNaN(asN)) {
                try {
                    const sk = await SkillProvider.getSkill(asN)
                    if (sk) {
                        this.skills = [sk];
                    } else {
                        this.skills = [];
                    }
                } catch (e) {
                    this.skills = [];
                }
            } else {
                this.skills = await SkillProvider.searchSkillsByName(this.query);
            }
            this.loading = false;

            this.$emit("query", this.query);
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";
// @import "./../../less/common/common.less";

.skill-search {
    .search-form {
        .button-row {
            margin-top: 10px;
        }
    }
    
    .result-wrapper {
        margin-top: 20px;
        position: relative;
        .loading {
            width: 100%;
            position: absolute;
            height: 100%;
            .padding-right(16px);
            z-index: 10;
            pointer-events: none;
            
            .loader-box {
                position: fixed;
                text-align: center;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                transform: translate(5%, 0);

                .label {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 50%;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: @dv-c-foreground;
                    transform: translate(0, 10px);
                }

                .loader,
                .loader:after {
                    border-radius: 50%;
                    width: 10em;
                    height: 10em;
                }
                .loader {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    line-height: 100%;
                    font-size: 16px;
                    margin: -5em -6em;
                    text-indent: -9999em;
                    border-top: 1.1em solid rgba(0, 0, 0, 0.75);
                    border-right: 1.1em solid rgba(0, 0, 0, 0.75);
                    border-bottom: 1.1em solid rgba(0, 0, 0, 0.75);
                    border-left: 1.1em solid @dv-c-foreground;
                    background: rgba(0, 0, 0, 0.5);
                    //   -webkit-transform: translateZ(0);
                    //   -ms-transform: translateZ(0);
                    //   transform: translateZ(0);
                    -webkit-animation: load8 1.1s infinite linear;
                    animation: load8 1.1s infinite linear;
                }
            }
        }

        .results {
            // Padding at the bottom because of tooltip overflow
            padding-bottom: 90vh;
            overflow: hidden;
        }
        
    }
}
</style>
