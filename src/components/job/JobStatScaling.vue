<template>
<div class="job-stat-scaling">
    <div class="loading" v-if="scaling.loading"> 
        <loader load-text="Loading class"/>
    </div>
    <div class="result" v-if="scaling.isSuccess() && scaling.value">
        <div class="two-col">
            <table class="col">
                <thead>
                    <th>Stat</th>
                    <th>Scaling</th>
                </thead>
                <tbody>
                    <tr>
                        <th>PDMG/STR</th>
                        <td>{{ scaling.value.strToPhys }}</td>
                    </tr>
                    <tr>
                        <th>PDMG/AGI</th>
                        <td>{{ scaling.value.agiToPhys }}</td>
                    </tr>
                    <tr>
                        <th>MDMG/INT</th>
                        <td>{{ scaling.value.intToMagic }}</td>
                    </tr>
                    <tr>
                        <th>CRITDMG/STR+INT</th>
                        <td>{{ scaling.value.strIntToCritDmg }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="col">
                <thead>
                    <th>Stat</th>
                    <th>Scaling</th>
                </thead>
                <tbody>
                    <tr>
                        <th>HP/VIT</th>
                        <td>{{ scaling.value.vitToHp }}</td>
                    </tr>
                    <tr>
                        <th>PDEF/VIT</th>
                        <td>{{ scaling.value.vitToDef }}</td>
                    </tr>
                    <tr>
                        <th>MDEF/INT</th>
                        <td>{{ scaling.value.intToMdef }}</td>
                    </tr>
                    <tr>
                        <th>CRIT/AGI</th>
                        <td>{{ scaling.value.agiToCrit }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import LoadingErrorable from '@/models/util/LoadingErrorable';
import IJobScaling from '@/models/jobs/IJobScaling';
import JobProvider from '@/api/JobProvider';
import Loader from "@/components/util/Loader.vue";

interface IData {
    scaling: LoadingErrorable<IJobScaling, any>;
}

export default Vue.extend({
    components: {
        Loader,
    },
    props: {
        "jobId": {
            type: Number as () => number,
        },
    },
    data(): IData {
        return {
            scaling: new LoadingErrorable(),
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.scaling.startLoad();
            JobProvider.getJobScaling(this.jobId).then((result) => {
                this.scaling.done(result);
            }).catch((error: any) => {
                this.scaling.failed(error);
            });
        }
    }

});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.job-stat-scaling {

    .two-col {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .col {
            flex: 0 0;

            th:first-child {
                width: 110px;
            }
        }
    }
}

</style>
