<template>
<div class="stats">
    <div v-if="multiview">

        <!-- <label>Lvl </label>
        <input v-model="globalLvl" type="number" min="1" max="100" />
        <button v-on:click="setLevel">
            Set all to Lvl {{ globalLvl }}
        </button> -->

        <h2>Critical Chance</h2>
        <gen-stat-small stat="crit"></gen-stat-small>

        <h2>Critical Damage</h2>
        <gen-stat-small stat="critdmg"></gen-stat-small>

        <h2>Defense</h2>
        <gen-stat-small stat="def"></gen-stat-small>

        <h2>Final Damage</h2>
        <gen-stat-small stat="fd"></gen-stat-small>

    </div>
    <div v-else>
        <h2>{{ statName }}</h2>
    </div>
</div>
</template>

<script>
import StatName from '@/const/StatName';

export default {
    name: 'genstats',
    data () {
        return {
            globalLvl: 95,
            stat: '',
            multiview: true,
        };
    },
    watch: {
        '$route' (to, from) {
            if (to.params.statName !== from.params.statName) {
                this.fetchData();
            }
        }
    },
    computed: {
        visible(stat) {
            return this.stat === stat || this.stat === "";
        },
        statName() {
            return StatName[this.stat];
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            let statName = this.$route.params.statName;
            this.stat = statName ? statName : '';
            this.multiview = this.stat === '';
        },
        setLevel() {

        }
    },
    StatName: StatName
}
</script>

<style lang="less" scoped>
@import "../less/core.less";

.stats {

}
</style>
