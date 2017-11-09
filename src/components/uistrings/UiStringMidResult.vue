<template>
<div class="results">
    <div class="col rich">
        <div v-html="result.html"></div>
        <div class="foot" v-on:click="copyHtml">{{ copyText }}</div>
        <textarea class="hidden" v-model="result.html" ref="htmltext"></textarea>
    </div>
    <!-- <div class="col strip" v-html="result.strip">
    </div> -->
    <div class="col raw">
        <textarea v-model="result.raw" readonly onclick="this.focus();this.select()">
        </textarea>
    </div>
</div>
</template>

<script>

const COPY_TEXT = "Copy HTML Source";
const COPIED_TEXT = "Copied!";

export default {
    name: 'uistring-midresult',
    props: ['result'],
    data: function() {
        return {
            copyText: COPY_TEXT
        }
    },
    methods: {
        copyHtml() {
            let hiddenArea = this.$refs.htmltext;
            hiddenArea.focus();
            hiddenArea.select();
            let success = document.execCommand('copy');
            if (success) {
                this.copyText = COPIED_TEXT;
                setTimeout(() => this.copyText = COPY_TEXT, 1000);
            } else {
                console.log("KO");
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.results {
    
    display: flex;

    .col {
        position: relative;
        display: flex;
        flex: 1;
        padding: 1em 1em 2em 1em;
        border: 1px solid @dv-c-accent-1;
        background-color: rgba(0, 0, 0, 0.25);
        transition: background-color ease-in 0.125s;
        margin: 0;

        &:first-child {
            border-right: none;
        }

        &:hover {
            background-color: rgba(0, 0, 0, 0.75);
        }

    }

    .rich::before {
        content: "HTML";
        position: absolute;
        font-size: 12px;
        top: 0.1em;
        left: 0.4em;
        color: @dv-c-idle;
    }

    .raw::before {
        content: "RAW";
        position: absolute;
        font-size: 12px;
        top: 0.1em;
        left: 0.4em;
        color: @dv-c-idle;
    }

    .foot {
        position: absolute;
        bottom: -1.5em;
        left: 0;
        font-size: 12px;
        color: @dv-c-accent-1;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        transition: color ease-in 0.125s;
        cursor: pointer;

        &:hover {
            color: @dv-c-foreground;
        }
    }

    textarea {
        color: @dv-c-body;
        font-size: 14px;
        font-family: @dv-f-lato;
        resize: none;
        background: none;
        border: none;
        width: 100%;

        &.hidden {
            position: absolute;
            opacity: 0;
        }
    }

    .no-results {
        margin-top: 2em;
        text-align: center;
        background: rgba(0, 0, 0, 0.75);
        padding-bottom: 1em;
        border: 1px solid @dv-c-red;
        .icon {
            font-size: 144px;
            color: @dv-c-red;
        }
        .head {
            font-family: @dv-f-lato;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 24px;
            color: @dv-c-red;
        }
        p {
            font-size: 18px;
        }
    }
}

</style>