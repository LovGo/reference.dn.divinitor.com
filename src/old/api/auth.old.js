//  Temporary test authentication for STARGAZER public test

import Vue from 'vue';

export default {
    redeem(code, okcb, errcb) {
        ApiHttpClient.get(`auth/discord?code=${code}`,
        {
        }).then(
        (res) => {
            okcb(res.data);
        }, 
        errcb);
    }
}
