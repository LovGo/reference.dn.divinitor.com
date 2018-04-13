import Vue from 'vue';
import Store from '@/store';

export default {
    jobsCache: {},

    getJob(jobId, region, okcb, errcb) {
        this.getJobs(region, (ret) => {
            okcb(ret[String(jobId)]);
        },
        errcb);
    },
    getJobs(region, okcb, errcb) {
        if (!region) region = Store.state.regionCode;
        let cacheKey = `${region}`;
        if (this.jobsCache[cacheKey]) {
            okcb(this.jobsCache[cacheKey]);
            return;
        }

        Vue.http.get(`server/${region}/jobs`,
        {
        }).then(
        (res) => {
            this.jobsCache[cacheKey] = res.body;
            okcb(res.body);
        }, 
        errcb);
    },
    // isJobSpecializationOf(job, parentJob, region) {
    //     let bJID = job.id;
    //     let sJID = parentJob.id;
        
    // }
    
    getIconCoordinates(iconIndex) {
        let row = Math.floor(iconIndex / 9);
        let column = iconIndex % 9;
        const UNIT_SIZE = 55;

        let ret = {
            x: Math.max(UNIT_SIZE * column, 0),
            y: UNIT_SIZE * row,
            size: UNIT_SIZE
        };

        return ret;
    },

    getIconUrl(region) {
        if (!region) region = Store.state.regionCode;
        return `${Vue.http.options.root}/server/${region}/dds/jobicon_main/png`;
    },
};
