import Vue from 'vue';
import Store from '@/store';

export default {
    getTaxes(region, okcb, errcb) {
        if (!region) region = Store.state.regionCode;
        
        Vue.http.get(`server/${region}/taxes`,
        {
        }).then(
        (res) => {
            okcb(res.body);
        }, 
        errcb);
    }
};
