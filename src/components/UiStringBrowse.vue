<template>
    <div class="uistrings browse">
        <div class="searchbar">
            <input type="search" v-model="query" v-on:keyup.enter="search" v-on:change="search" v-on:input="changed" name="search" autocomplete="off" placeholder="Enter search terms"/>
            <label for="search">Search</label>
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
            <div class="results" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="0">
                <div v-if="results.length">
                    <transition name="fade-item">
                        <div class="active-result" v-if="activeResultId">
                            <div class="container">
                                <h1>MID {{ activeResultId }}</h1>
                                <uistring-midresult :result="activeResult"></uistring-midresult>
                                <div class="buttonbox">
                                    <button v-on:click="closeActive">Close</button>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <div class="count">Found <span class="val">{{ approxResultCount | thousands }} results</span></div>
                    <div v-for="item in results" :key="item.mid" class="midresult" v-on:click.self="setActiveResult" :data-id="item.mid">
                        <div class="mid">
                            {{ item.mid }}
                        </div>
                        <div class="text" v-html="item.message">
                        </div>
                    </div>
                    <div v-if="end" class="end-results">
                        End of results
                    </div>
                </div>
                <div v-else>
                    <div class="no-results" v-if="!loading">
                        <div class="error" v-if="error">
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
                        <div v-else>
                            <div class="icon">
                                <i class="fa fa-question-circle"></i>
                            </div>
                            <div class="head">
                                No results
                            </div>
                            <p>
                                Try searching something different.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import region from '@/api/region';
import uistring from '@/api/uistring';

export default {
  name: 'uistringbrowse',
  data () {
    return {
        loadedQuery: "",
        query: "",
        results: [],
        activeResult: null,
        activeResultId: 0,
        loading: false,
        page: 0,
        approxResultCount: 0,
        end: false,
        error: null,
        lastChangeTimer: null
    };
  },
  created() {
    this.query = this.$route.query.q;
    this.fetchData();
  },
  methods: {
    fetchData() {
        clearTimeout(this.lastChangeTimer);
        this.loading = true;
        uistring.getBulk({
            page: this.page,
            size: 50,
            query: this.query
        },
        {
            vue: this,
            region: this.$store.state.regionCode,
            format: 'html',
            okcb: (res) => {
                this.results.push(...res.strings);
                this.end = this.results.length >= res.estimatedSize;
                this.approxResultCount = res.estimatedSize;
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

        this.page = 0;
        this.results = [];
        this.end = false;
        this.$router.push({ path: '/text/uistring/browse', query: {q: this.query }});
        this.fetchData();
    },
    loadMore() {
        if (!this.end) {
            this.page += 1;
            this.fetchData();
        }
    },
    setActiveResult(evt) {
        this.activeResultId = evt.target.dataset.id;
        this.activeResult = null;
        
        uistring.getVariant(this.activeResultId, 
        {
            vue: this,
            param: null,
            region: this.$store.state.regionCode,
            okcb: (res) => {
                this.activeResult = {
                    html: res.html,
                    raw: res.raw,
                    strip: res.strip.replace(/\n/g, "<br/>")
                };
            },
            errcb: (err) => {
                console.error(err);
            }
        });
    },
    closeActive() {
        this.activeResultId = 0;
        this.activeResult = null;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../less/core.less";

.uistrings.browse {
    .result-wrapper {
        margin-top: 20px;
        position: relative;

        .loading {
            width: 100%;
            position: absolute;
            height: 100%;
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

        .results {
            position: relative;

            .active-result {
                background: rgba(10, 10, 10, 0.95);
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 100;
                
                .container {
                    position: relative;
                    width: 900px;
                    margin-left: auto;
                    margin-right: auto;
                    top: 50%;
                    transform: translateY(-50%);
                }

                .buttonbox {
                    text-align: right;
                }

                button {
                    margin-top: 4em;
                    min-width: 100px;
                    width: 20%;
                }
            }

            .midresult {
                border-top: 1px solid @dv-c-accent-1;
                position: relative;
                transition: background-color ease-in 0.125s;
                cursor: pointer;
                overflow-y: hidden;
                text-overflow: ellipsis;
                padding: 12px 8px;
                background-color: rgba(0, 0, 0, 0.25);

                &:first-child {
                    border-top: none;
                }

                &:hover {
                    background-color: rgba(0, 0, 0, 0.75);
                }

                .mid {
                    position: absolute;
                    font-size: 12px;
                    color: @dv-c-accent-1;
                    pointer-events: none;
                }

                .text {
                    margin-top: 0.8em;
                    pointer-events: none;
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

            .count {
                font-weight: normal;
                letter-spacing: 0.1em;
                color: @dv-c-accent-1;
                font-family: @dv-f-geomanist;
                text-transform: uppercase;
                letter-spacing: 0.3em;
                font-size: 14px;

                .val {
                    color: @dv-c-accent-2;
                }
            }

            .end-results {
                text-align: center;
                border-top: 1px solid @dv-c-accent-1;
                padding-top: 0.25em;
                padding-bottom: 0.25em;
                font-family: @dv-f-geomanist;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                font-size: 16px;
                color: @dv-c-foreground;
            }
        }
    }
}

</style>
