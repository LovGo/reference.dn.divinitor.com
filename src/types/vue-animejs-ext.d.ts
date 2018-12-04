import Vue from "vue";
import Anime from "animejs";

declare module "vue/types/vue" {
    interface Vue {
        $anime: typeof Anime;
    }
}
