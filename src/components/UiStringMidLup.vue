<template>
  <div class="uistrings midlup">
        <div class="searchbar">
            <input type="search" v-model="query" v-on:keyup.enter="search" name="search" autocomplete="off" placeholder="Enter MID and/or parameters"/>
            <label for="search">MID and/or parameters</label>
        </div>
        
        <div class="result-wrapper">
            <transition name="fade">
                <div v-if="loading" class="loading">
                    <div class="loader-box">
                        <div class="loader"></div>
                        <div class="label">Loading</div>
                    </div>
                </div>
            </transition>
            <transition name="fade-item">
                <div v-if="result">
                    <uistring-midresult :result="result"></uistring-midresult>
                </div>
            </transition>
            <transition name="fade-item">
                <div v-if="error" class="no-results">
                    <div class="icon">
                        <i class="fa fa-exclamation-triangle"></i>
                    </div>
                    <div class="head">
                        Error: {{ error.statusText }}
                    </div>
                    <p>
                        {{ error.bodyText }}
                    </p>
                </div>
            </transition>
        </div>
  </div>
</template>

<script>
import region from '@/api/region';
import uistring from '@/api/uistring';

const COPY_TEXT = "Copy HTML Source";
const COPIED_TEXT = "Copied!";

export default {
  name: 'uistringmidlup',
  data () {
    return {
        loadedQuery: "",
        query: "",
        result: null,
        loading: false,
        error: null,
        lastChangeTimer: null,
        copyText: COPY_TEXT,
    };
  },
  created() {
    this.query = this.$route.query.q;
    this.fetchData();
  },
  methods: {
    fetchData() {
        if (!this.query) {
            return;
        }

        clearTimeout(this.lastChangeTimer);
        let mid = 0;
        let params = "";

        let split = this.query.split(/\s/, 2);
        let midStr = split[0].replace(/(^")|("$)/g, "");

        mid = parseInt(midStr);
        if (isNaN(mid)) {
            //  TODO
            this.error = {
                statusText: "Invalid Request",
                bodyText: "Not a valid MID"
            };
            return;
        }
        if (split.length == 2) {
            params = split[1].replace(/(^")|("$)/g, "");
        }

        this.loading = true;
        uistring.getVariant(mid, 
        {
            vue: this,
            region: this.$store.state.regionCode,
            param: params,
            format: 'html',
            okcb: (res) => {
                this.result = {
                    html: res.html,
                    raw: res.raw,
                    strip: res.strip.replace(/\n/g, "<br/>")
                };
                this.loadedQuery = this.query;
                this.error = null;
                //  Add a slight delay cuz otherwise its too fast
                setTimeout(() => this.loading = false, 250);
            },
            errcb: (err) => {
                console.error(err);
                this.error = err;
                this.loading = false;
                this.end = true;
            }
        });
    },
    changed() {
        clearTimeout(this.lastChangeTimer);
        this.lastChangeTimer = setTimeout(this.search, 1000);
    },
    search() {
        clearTimeout(this.lastChangeTimer);
        if (this.query == this.loadedQuery) {
            return;
        }

        this.result = null;
        this.$router.push({ path: '/text/uistring/midlup', query: {q: this.query }});
        this.fetchData();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../less/core.less";

.uistrings.midlup {
    .result-wrapper {
        margin-top: 20px;
        position: relative;

        .loading {
            width: 100%;
            position: absolute;
            padding-right: 16px;
            z-index: 10;
            
            .loader-box {
                position: fixed;
                text-align: center;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                transform: translate(5%, 0);

                .label {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 50%;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: @dv-c-foreground;
                    transform: translate(0, 10px);
                }

                .loader,
                .loader:after {
                    border-radius: 50%;
                    width: 10em;
                    height: 10em;
                }
                .loader {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    line-height: 100%;
                    font-size: 16px;
                    margin: -5em -6em;
                    text-indent: -9999em;
                    border-top: 1.1em solid rgba(0, 0, 0, 0.75);
                    border-right: 1.1em solid rgba(0, 0, 0, 0.75);
                    border-bottom: 1.1em solid rgba(0, 0, 0, 0.75);
                    border-left: 1.1em solid @dv-c-foreground;
                    background: rgba(0, 0, 0, 0.5);
                    //   -webkit-transform: translateZ(0);
                    //   -ms-transform: translateZ(0);
                    //   transform: translateZ(0);
                    -webkit-animation: load8 1.1s infinite linear;
                    animation: load8 1.1s infinite linear;
                }

                @-webkit-keyframes load8 {
                    0% {
                        -webkit-transform: rotate(0deg);
                        transform: rotate(0deg);
                    }
                    100% {
                        -webkit-transform: rotate(360deg);
                        transform: rotate(360deg);
                    }
                }
                @keyframes load8 {
                    0% {
                        -webkit-transform: rotate(0deg);
                        transform: rotate(0deg);
                    }
                    100% {
                        -webkit-transform: rotate(360deg);
                        transform: rotate(360deg);
                    }
                }
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
}

</style>
