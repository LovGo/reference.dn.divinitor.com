<template>
<div class="monsters">
    <h1 class="divided">Monsters</h1>
    <form class="search-form" v-on:submit.prevent="loadMonster">
        <div class="name-class-filter">
            <input type="text" v-model.number="monsterId" placeholder="Monster ID"/>
        </div>
        <button class="dv-button small" :disabled="!valid">Load</button>
    </form>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

interface IData {
    monsterId: number|null;
}

export default Vue.extend({
    components: {
    },
    data(): IData {
        return {
            monsterId: null,
        };
    },
    computed: {
        valid(): boolean {
            return !isNaN(Number(this.monsterId)) && !!this.monsterId && this.monsterId > 0;
        },
    },
    methods: {
        loadMonster() {
            this.$router.push(`/monsters/${this.monsterId}`);
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../less/core.less";

.monsters {
}

</style>
