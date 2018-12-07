<template>
<div class="copy-link">
    <a class="link" v-on:click.prevent="copyLink" :href="link">
        <div class="idle">
            <slot></slot>
        </div>
        <div class="res ok">
            <slot name="ok"></slot>
        </div>
        <div class="res error">
            <i class="fa fa-exclamation-triangle"></i> Copy error
        </div>
        <input class="hidden" type="text" ref="copyLink" />
    </a>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

const FADE_OUT: anime.AnimeParams = {
    targets: "",
    opacity: "0.0",
    easing: "easeOutCubic",
    offset: 0,
};

const FADE_IN: anime.AnimeParams = {
    targets: "",
    opacity: ["0.0", "1.0"],
    easing: "easeOutCubic",
    offset: 0,
};

export default Vue.extend({
    props: {
        "copyContent": {
            type: String as () => string,
        }
    },
    computed: {
        link(): string {
            if (this.copyContent.startsWith("http://") || this.copyContent.startsWith("https://")) {
                return this.copyContent;
            }

            return "#";
        }
    },
    methods: {
        copyLink() {
            let box = this.$refs['copyLink'] as HTMLFormElement;
            box.value = this.copyContent;
            box.focus();
            box.select();
            let success = document.execCommand('copy');
            if (success) {
                this.showSuccess();
            } else {
                this.showFail();
            }
        },
        showSuccess() {
            const timeline = this.$anime.timeline();
            timeline.finished.then(() => {
                const reverse = this.$anime.timeline();
                reverse.add(this.setTarget(FADE_OUT, ".res"))
                    .add(this.setTarget(FADE_IN, ".idle"));
            });

            timeline.add(this.setTarget(FADE_OUT, ".idle"))
                .add(this.setTarget(FADE_IN, ".ok"));
            

        },
        showFail() {
            const timeline = this.$anime.timeline();

            timeline.finished.then(() => {
                const reverse = this.$anime.timeline();
                reverse.add(this.setTarget(FADE_OUT, ".res"))
                    .add(this.setTarget(FADE_IN, ".idle"));
            });

            timeline.add(this.setTarget(FADE_OUT, ".idle"))
                .add(this.setTarget(FADE_IN, ".error"));
        },
        setTarget(animParams: anime.AnimeParams, targets: string) {
            const ret = Object.assign({}, animParams);
            ret.targets = targets;
            return ret;
        },
        setDuration(animParams: anime.AnimeParams, duration: number) {
            const ret = Object.assign({}, animParams);
            ret.duration = duration;
            return ret;
        },
    },
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.copy-link {
    padding: 2px;
    height: 1.5em;

    .link {
        display: inline-block;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-family: @dv-f-geomanist;
        font-size: 12px;
        position: relative;
        white-space: nowrap;
        height: 1em;
        min-width: auto;

        .ok, 
        .error,
        .idle {
            position: absolute;
            top: 0;
            left: 0;
        }

        .error {
            color: @dv-c-red;
            opacity: 0.0;
        }
        
        .ok {
            color: @dv-c-green;
            opacity: 0.0;
        }
    }
}
</style>
