<template>
<div class="job-stat-grid">
    <div class="loading" v-if="scalings.loading">
        <loader load-text="Loading class scalings"/>
    </div>
    <div class="grid">
        <transition name="fade">
            <div class="scroll-notice" v-if="groups.length">
                Remember to scroll horizontally too!
            </div>
        </transition>
        <table>
            <tbody v-for="g in groups" :key="g.representative.id">
                <tr class="group-header">
                    <th class="job-name">
                        <sprite-icon :icon-info="g.representative.icon" :size-override="26" />
                        <ui-string class="job-name-text" :message-data="g.representative.name" inline="true"/>
                    </th>
                    <th>PDMG/STR</th>
                    <th>PDMG/AGI</th>
                    <th>MDMG/INT</th>
                    <th class="critdmg">CRITDMG</th>
                    <th>HP/VIT</th>
                    <th>PDEF/VIT</th>
                    <th>MDEF/INT</th>
                    <th>CRIT/AGI</th>
                </tr>
                <tr v-for="c in g.children" :key="c.id">
                    <th>
                        <router-link class="job-name" :to="{name: 'job-view', params: { jobId: c.id }}">
                            <ui-string class="job-name-text" :message-data="c.name" inline="true" />
                            <sprite-icon :icon-info="c.icon" :size-override="18" /> 
                        </router-link>
                    </th>
                    <template v-if="c.stats">
                        <td>{{ c.stats.strToPhys }}</td>
                        <td>{{ c.stats.agiToPhys }}</td>
                        <td>{{ c.stats.intToMagic }}</td>
                        <td class="critdmg">{{ c.stats.strIntToCritDmg }}</td>
                        <td>{{ c.stats.vitToHp }}</td>
                        <td>{{ c.stats.vitToDef }}</td>
                        <td>{{ c.stats.intToMdef }}</td>
                        <td>{{ c.stats.agiToCrit }}</td>
                    </template>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import LoadingErrorable from '@/models/util/LoadingErrorable';
import IJobScaling from '@/models/jobs/IJobScaling';
import JobProvider from '@/api/JobProvider';
import IJob from '@/models/jobs/IJob';
import Loader from "@/components/util/Loader.vue";
import SpriteIcon from "@/components/util/SpriteIcon.vue";
import UiString from "@/components/uistring/UiString.vue";

interface IData {
    scalings: LoadingErrorable<IJobScaling[], any>;
    groups: IJobGroup[];
}

interface IStatJob extends IJob {
    stats: IJobScaling|null;
}

interface IJobGroup {
    representative: IJob;
    children: IStatJob[];
}

export default Vue.extend({
    components: {
        Loader,
        SpriteIcon,
        UiString,
    },
    data(): IData {
        return {
            scalings: new LoadingErrorable(),
            groups: [],
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.scalings.startLoad();
            JobProvider.getAllJobs().then((jobs) => {
                this.groups = this.categorizeJobsByBase(jobs);
                return JobProvider.getJobsScaling(jobs.map(j => j.id));
            }).then((scalings) => {
                for (let g of this.groups) {
                    g.children.forEach(((j) => {
                        j.stats = this.getScalingForJob(j.id, scalings);
                    }));
                }

                this.scalings.done(scalings);
            })
        },

        categorizeJobsByBase(jobs: IJob[]): IJobGroup[] {
            // Find all base jobs
            const ret = jobs.filter((j) => j.jobNumber == 0).map((j: IJob): IJobGroup => {
                return {
                    representative: j,
                    children: [],
                };
            });

            ret.forEach((g) => {
                const rep = g.representative;
                g.children.push(...(jobs.filter((j) => j.id != rep.id && j.baseClass == rep.id && j.jobNumber == 2)
                    .map((j) => {
                        const r = j as IStatJob;
                        r.stats = null;
                        return r;    
                    })));
            });

            return ret;
        },

        getScalingForJob(jobId: number, scalings: IJobScaling[]): IJobScaling {
            return scalings.find((s) => s.jobId == jobId)!;
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.job-stat-grid {
    max-width: 100%;
    position: relative;

    .grid {
        overflow-x: auto;
        overflow-y: hidden;

        .scroll-notice {
            position: absolute;
        }

        table {
            margin-top: 30px;
            white-space: nowrap;
            .group-header {
                background: transparent;
                height: 3em;
                
                th {
                    border-bottom: 2px solid @dv-c-body;
                    vertical-align: bottom;
                    text-align: center;
                    padding-left: 0.5em;
                    padding-right: 0.5em;
                    &:not(:first-child) {
                        border-right: none;
                    }

                    &:first-child {
                        text-align: left;
                        font-size: 18px;
                    }
                }
            }

            // Chrome fix
            tbody::after {
                content: ''; 
                display: block;
                page-break-after: always;
                page-break-inside: avoid;
                page-break-before: avoid;
            }

            tr td {
                padding-left: 0.5em;
                padding-right: 0.5em;
            }

            .critdmg {
                padding-left: 0.2em;
                padding-right: 0.2em;
            }
        }

        @media @wide-desktop {
            .scroll-notice {
                display: none;
            }

            table {
                margin-top: 0;
            }
        }
    }

    .job-name {
        white-space: nowrap;

        .job-name-text {
            margin: 0 4px;
            color: @dv-c-foreground;
        }
    }

    @media @tablet {
        .job-name-text {
            display: none;
        }
    }
}

</style>

