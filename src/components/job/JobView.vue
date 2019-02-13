<template>
<div class="job-view">
    <div class="loading" v-if="job.loading"> 
        <loader load-text="Loading class"/>
    </div>
    <div class="result" v-if="job.isSuccess() && job.value">
        <div class="breadcrumb">
            <router-link :to="{ name: 'jobs' }" class="breadcrumb-entry">
                Classes
            </router-link>
            <router-link :to="{name: 'job-view', params: { jobId: j.id }}" class="breadcrumb-entry" v-for="j in getBreadcrumb()" :key="j.id">
                <sprite-icon :icon-info="j.icon" :size-override="20"/>
                <ui-string :message-data="j.name" inline="true" />
            </router-link>
        </div>
        <div class="header">
            <div class="icon">
                <sprite-icon :icon-info="job.value.icon" />
            </div>
            <div class="title">
                <div class="remark">
                    <span class="id">#{{ jobId }}</span>
                </div>
                <h2 class="head">
                    <ui-string class="name" :message-data="job.value.name" />
                </h2>
                <div class="remark">
                    <span class="base" v-if="job.value.jobNumber == 0">Base Class </span>
                    <span :class="`spec spec-${job.value.jobNumber}`" v-else>Spec {{ job.value.jobNumber }} </span>
                    <span :class="`spinoff ${getClassType()}`" v-if="job.value.classType != 0"> {{ getClassType() }} spinoff </span>
                    <span class="awakened" v-if="job.value.hasAwakening">Awakened </span>
                    <span class="type">{{ job.value.mainStatString.message }} </span>
                </div>
            </div>
        </div>

        <div class="desc" v-if="job.value.jobDescription.id">
            <i><ui-string :message-data="job.value.jobDescription"/></i>
        </div>

        <h3>Stat Scaling</h3>
        <job-stat-scaling :job-id="job.value.id" />

        <p>
            Additional features and info are coming soon
        </p>

        <!-- <h3>Base Stats</h3>

        <h3>Skills</h3>
        <p>Coming soon</p>

        <h3>Quick Items</h3> -->

    </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingErrorable from "@/models/util/LoadingErrorable";
import IJob from "@/models/jobs/IJob";
import JobProvider from "@/api/JobProvider";

import SpriteIcon from "@/components/util/SpriteIcon.vue";
import Loader from "@/components/util/Loader.vue";
import JobStatScaling from "@/components/job/JobStatScaling.vue";
import UiString from "@/components/uistring/UiString.vue";

interface IData {
    job: LoadingErrorable<IJob, any>;
}

export default Vue.extend({
    components: {
        Loader,
        SpriteIcon,
        JobStatScaling,
        UiString,
    },
    props: {
        "jobId": {}
    },
    data(): IData {
        return {
            job: new LoadingErrorable(),
        };
    },
    watch: {
        jobId(newId, oldId) {
            this.fetchData();
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.job.startLoad();
            JobProvider.getJob(Number(this.jobId), true).then((job) => {
                this.job.done(job);
            }).catch((error: any) => {
                this.job.failed(error);
            });
        },
        getBreadcrumb() {
            let ret = [];
            let j = this.job.value ? this.job.value.parentJob : null;
            while (j) {
                ret.push(j);
                j = j.parentJob;
            }

            return ret.reverse();
        },
        getClassType(): string {
            if (this.job.value) {
                const t = this.job.value.classType;
                switch (t) {
                    case 0:
                        return "";
                    case 1:
                        return "dark";
                    case 2:
                        return "light";
                    default:
                        return String(t);
                }
            }

            return "";
        },
    }

});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.job-view {
    .result {

        .breadcrumb {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .breadcrumb-entry {
                flex: 0 0;
                display: block;
                white-space: nowrap;
                color: @dv-c-accent-1;
                text-transform: uppercase;
                letter-spacing: 0.05em;

                &::after {
                    content: ">";
                    margin: 0 4px 0 4px;
                    color: @dv-c-idle;
                }

                &:last-child {
                    &::after {
                        content: "";
                        margin: 0;
                    }
                }

                &:hover {
                    color: @dv-c-foreground;
                }
            }
        }

        .header {
            position: relative;
            width: 100%;
            padding-left: 0;
            padding-bottom: 0;
            display: flex;
            flex-direction: row;
            margin: 8px 0 10px 0;

            .icon{ 
                flex: 0 0 50px;
                vertical-align: middle;

                // width: 50px;
                
                .centering {
                    position: absolute;
                    top: 50%;
                    transform: translate(0px, -50%);
                }

            }

            .title {
                flex: 1 1 auto;
                margin-left: 6px;
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
                    text-transform: uppercase;

                    & > span {
                        &::after {
                            content: "|";
                            margin: 0 8px 0 2px;
                            color: @dv-c-idle;
                        }
                        &:last-child::after {
                            content: "";
                            margin: 0;
                        }
                    }

                    .spec {
                        &.spec-1 {
                            color: #589ecb;
                        }
                        &.spec-2 {
                            color: #e09048;
                        }
                    }

                    .spinoff {
                        &.dark {
                            color: #a257a0;
                        }

                        &.light {
                            color: #eee475;
                        }
                    }
                }
            }
        }
        
        .desc {
            // color: @dv-c-accent-2;
        }
    }
}
</style>
