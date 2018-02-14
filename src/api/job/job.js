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

        Vue.http.get(`/api/server/${region}/jobs`,
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
};
