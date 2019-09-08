<template>
<div class="job-tree">
    <div class="loading" v-if="jobs.loading">
        <loader load-text="Loading classes"/>
    </div>
    <div class="root" v-else-if="classes.length">
        <div class="base class" v-for="j in classes" :key="j.base.id">
            <router-link class="job-header" :to="{name: 'job-view', params: { jobId: j.base.id }}">
                <sprite-icon :icon-info="j.base.icon" />
                <ui-string class="name" :message-data="j.base.name" />
                <div class="jid">{{ j.base.id }}</div>
            </router-link>

            <div class="first classes">
                <div class="first class" v-for="f in j.firsts" :key="f.first.id"
                    :alt-type="f.first.classType">
                    <router-link class="job-header" 
                        :to="{name: 'job-view', params: { jobId: f.first.id }}"
                        :alt-type="f.first.classType"
                        :awakened="f.first.hasAwakening">
                        <sprite-icon :icon-info="f.first.icon" />
                        <ui-string class="name" :message-data="f.first.name" />
                <div class="jid">{{ f.first.id }}</div>
                    </router-link>

                    <div class="second classes">
                        <div class="second class" v-for="s in f.seconds" :key="s.id"
                            :alt-type="s.classType">
                            <router-link class="job-header" 
                                :to="{name: 'job-view', params: { jobId: s.id }}"
                                :alt-type="s.classType"
                                :awakened="s.hasAwakening">
                                <sprite-icon :icon-info="s.icon" />
                                <ui-string class="name" :message-data="s.name" />
                                <div class="jid">{{ s.id }}</div>
                            </router-link>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="error" v-else-if="jobs.error">
        <big-error-box
            :error-title="'Failed to load class tree'"
            :error-content="jobs.error"
            :icon-class="'fa-exclamation-triangle'"
            :can-retry="true"
            v-on:retry="fetchData" />
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import LoadingErrorable from '@/models/util/LoadingErrorable';
import JobProvider from '@/api/JobProvider';
import IJob from '@/models/jobs/IJob';
import Loader from "@/components/util/Loader.vue";
import SpriteIcon from "@/components/util/SpriteIcon.vue";
import UiString from "@/components/uistring/UiString.vue";
import BigErrorBox from "@/components/util/BigErrorBox.vue";

import { axiosErrorToString } from "@/helpers/AxiosErrorUtils";

interface IBaseClass {
    base: IJob;
    firsts: IFirstClass[];
}

interface IFirstClass {
    first: IJob;
    seconds: IJob[];
}

interface IData {
    classes: IBaseClass[];
    jobs: LoadingErrorable<IJob[], any>;
}

export default Vue.extend({
    components: {
        BigErrorBox,
        Loader,
        SpriteIcon,
        UiString,
    },
    data(): IData {
        return {
            classes: [],
            jobs: new LoadingErrorable(),
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.jobs.startLoad();
            JobProvider.getAllJobs().then((all) => {
                this.classes = this.buildTree(all);
                this.jobs.done(all);
                this.$emit("done");
            }, (err) => {
                this.jobs.failed(axiosErrorToString(err));
            });
        },
        buildTree(jobs: IJob[]): IBaseClass[] {
            const baseCls = jobs.filter((j) => j.jobNumber == 0);
            let ret: IBaseClass[] = [];
            for (let cls of baseCls) {
                let ifc: IBaseClass = {
                    base: cls,
                    firsts: [],
                };

                const firstJobs = jobs.filter((j) => j.jobNumber == 1 && j.parentJobId == cls.id);
                for (let f of firstJobs) {
                    let fc: IFirstClass = {
                        first: f,
                        seconds: jobs.filter((j) => j.jobNumber == 2 && j.parentJobId == f.id),
                    };

                    ifc.firsts.push(fc);
                }

                ret.push(ifc);
            }

            return ret;
        }
    },
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.job-tree {

    .root {
        display: flex;
        flex-direction: column;
    }

    .class {
        text-align: center;
        display: flex;
        flex-direction: column;

        .job-header {
            flex: 0 0 auto;
            position: relative;
            display: block;
            padding: 10px 10px 20px 10px;
            // min-width: 100px;
            // white-space: nowrap;

            transition: background-color 0.125s ease-in;

            color: @dv-c-foreground;

            text-transform: uppercase;
            letter-spacing: 0.05em;

            font-size: 12px;

            @media @wide-desktop {
                font-size: 14px;
            }

            &:hover {
                background: fade(@dv-c-foreground, 20%);
                @supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
                    backdrop-filter: blur(4px);
                }
            }

            &[awakened]::after {
                content: "+";
                font-size: 10px;

                position: absolute;
                top: 14px;
                .left(calc(50% + 20px));
            }

            &[alt-type="1"] {
                background: fade(@rank-unique, 5%);

                &:hover {
                    background: fade(@rank-unique, 20%);
                }
            }

            &[alt-type="2"] {
                background: fade(@rank-divine, 5%);

                &:hover {
                    background: fade(@rank-divine, 20%);
                }
            }

            .jid {
                position: absolute;
                top: 10px;
                .left(10px);
                color: fade(@dv-c-accent-3, 25%);
                transition: color 0.125s ease-in;
                font-size: 10px;

                &::before {
                    content: "#";
                }
            }

            &:hover .jid {
                color: @dv-c-accent-2;
            }
        }


        &.base {
            border: 1px solid @dv-c-foreground;
            margin-top: 10px;
        }

        &.second {
            .job-header {
                flex: 1 1 auto;
            }
        }

        .classes {
            border-top: 1px solid @dv-c-foreground;
            flex: 1 1 auto;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .class {
                flex: 1 1;
                .border-right(1px solid @dv-c-foreground);
                min-width: 0;

                &:last-child {
                    .border-right(none);
                }

                &.first[alt-type="1"],
                &.first[alt-type="2"] {
                    flex: 0.5 0.5;
                }
            }
        }

        @media @tablet {
            .second.classes {
                flex-direction: column;

                .class {
                    .border-right(none);
                    border-bottom: 1px solid fade(@dv-c-foreground, 50%);
                    
                    &:last-child {
                        border-bottom: none;
                    }
                }
            }
        }

        @media @mobile {
            .first.classes {
                flex-direction: column;
            }

            .second.classes {
                flex-direction: row;
                border-bottom: 2px solid @dv-c-foreground;
                .class {
                    border-bottom: none;
                    .border-right(1px solid fade(@dv-c-foreground, 50%));
                    
                    &:last-child {
                        .border-right(none);
                    }
                }
            }
        }
    }
}

</style>
