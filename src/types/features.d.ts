import Vue from "vue";
import * as Features from "./../api/FeaturesProvider";

declare module "vue/types/vue" {
    interface Vue {
        $fOn: typeof Features.getFeatureState;
        $f: typeof Features.netFeatures;
    }
    interface VueConstructor {
        $fOn: typeof Features.getFeatureState;
        $f: typeof Features.netFeatures;
    }
}
