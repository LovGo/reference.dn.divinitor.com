<template>
<div class="skill-tree">
    <div class="loading" v-if="tree.loading"> 
        <loader load-text="Loading class"/>
    </div>
    <div class="result" v-if="tree.isSuccess() && tree.value">
        <div class="skill-grid">
            <div class="grid-head" v-if="jobInfo">{{jobInfo.name.message}}</div>
            <div class="grid-body">
                <div class="grid-entry"
                    v-for="(entry, i) of slots"
                    :key="'sk-' + i">
                    <template v-if="entry">
                        <skill-stub-link :skillId="entry.skillId" :iconOnly="true"/>
                    </template>
                </div>
            </div>
        </div>
        <template v-if="awakeningSkills.length">
        <div class="skill-grid">
            <div class="grid-head">Awakening</div>
            <div class="grid-body">
                <div class="grid-entry"
                    v-for="(entry, i) of awakeningSlots"
                    :key="'sk-' + i">
                    <template v-if="entry">
                        <skill-stub-link :skillId="entry.skillId" :iconOnly="true"/>
                    </template>
                </div>
            </div>
        </div>
        </template>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import LoadingErrorable from '@/models/util/LoadingErrorable';
import SkillProvider from '@/api/SkillProvider';
import Loader from "@/components/util/Loader.vue";
import ISkillTreeEntry from '@/models/skills/ISkillTreeEntry';
import SkillStubLink from '@/components/skill/SkillStubLink.vue';
import JobIcon from '@/components/job/JobIcon.vue';
import JobProvider from "@/api/JobProvider";
import IIconInfo from '../../models/util/IIconInfo';
import IJob from '../../models/jobs/IJob';

interface IData {
    tree: LoadingErrorable<ISkillTreeEntry[], any>;
    jobInfo: IJob|null;
}

export default Vue.extend({
    components: {
        Loader,
        SkillStubLink,
        JobIcon,
    },
    props: {
        "jobId": {
            type: Number as () => number,
        },
    },
    data(): IData {
        return {
            tree: new LoadingErrorable(),
            jobInfo: null,
        }
    },
    computed: {
        skills(): ISkillTreeEntry[] {
            if (this.tree.value) {
                return this.tree.value.filter((s) => !s.isAwakened);
            }

            return [];
        },
        slots(): (ISkillTreeEntry|null)[] {
            const ret = [];
            for (let i = 0; i < (4*7); ++i) {
                ret[i] = this.skills.find((s) => s.index === i) || null;
            }

            return ret;
        },
        awakeningSkills(): ISkillTreeEntry[] {
            if (this.tree.value) {
                return this.tree.value.filter((s) => s.isAwakened);
            }

            return [];
        },
        awakeningSlots(): (ISkillTreeEntry|null)[] {
            const ret = [];
            for (let i = 0; i < (4*7); ++i) {
                ret[i] = this.awakeningSkills.find((s) => s.index === i) || null;
            }

            return ret;
        },
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            this.tree.startLoad();
            try {
                this.jobInfo = null;
                try {
                    this.jobInfo = await JobProvider.getJob(this.jobId);
                } catch (error) {
                    console.log('Failed to load job', error);
                }

                this.tree.done(await SkillProvider.getSkillTreeInfo(this.jobId));
            } catch (error) {
                console.log(error);
                this.tree.failed(error);
            }
        },
        async fetchJob() {
        }
    }
})
</script>

<style lang="less" scoped>
@import '~@/less/core.less';

.skill-tree {

    .result {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .skill-grid {
            position: relative;
            border: 1px solid @dv-c-accent-1;
            padding: 12px;
            flex: 0 0;
            margin-left: -1px;
            &:first-child {
                margin-left: 0;
            }

            .grid-head {
                text-transform: uppercase;
                font-family: @dv-f-geomanist;
                text-align: center;
                margin-bottom: 12px;
                letter-spacing: 0.1em;
                color: @dv-c-foreground;
            }

            .grid-body {
                @tile-size: 62px;
                display: grid;
                grid-template-columns: @tile-size @tile-size @tile-size @tile-size;

                .grid-entry {
                    min-width: @tile-size;
                    min-height: @tile-size;
                }
            }
        }
    }
}
</style>