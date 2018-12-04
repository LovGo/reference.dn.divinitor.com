import { ensureRegion } from "@/api/RegionProvider";
import { ApiHttpClient } from "@/globals";

export default {
    getTaxes(region, okcb, errcb) {
        region = ensureRegion(region);
        
        ApiHttpClient.get(`server/${region}/taxes`,
        {
        }).then(
        (res) => {
            okcb(res.data);
        }, 
        errcb);
    }
};
