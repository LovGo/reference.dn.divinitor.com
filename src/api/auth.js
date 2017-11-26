//  Temporary test authentication for STARGAZER public test

import Vue from 'vue';

export default {
    redeem(code, okcb, errcb) {
        Vue.http.get(`/api/auth/discord?code=${code}`,
        {
        }).then(
        (res) => {
            okcb(res.body);
        }, 
        errcb);
    }
}
