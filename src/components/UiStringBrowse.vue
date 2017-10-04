<template>
    <div class="uistrings browse">
        <div class="searchbar">
            <input type="search" v-model="query" v-on:keyup.enter="search" v-on:blur="search" name="search" autocomplete="off" placeholder="Enter search terms"/>
            <label for="search">Search</label>
        </div>
        
        <div class="result-wrapper">
            <div v-if="loading" class="loading">
                <div class="loader-box">
                    <div class="loader"></div>
                    <div class="label">Loading</div>
                </div>
            </div>
            <div class="results" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="0">
                <div v-if="results.length">
                    <div v-for="item in results" :key="item.mid" class="midresult">
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
        loading: false,
        page: 0,
        end: false,
        error: null
    };
  },
  created() {
    this.query = this.$route.query.q;
    this.fetchData();
  },
  methods: {
    fetchData() {
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
                this.loadedQuery = this.query;
                //  Add a slight delay cuz otherwise its too fast
                setTimeout(() => this.loading = false, 250);
            },
            errcb: (err) => {
                console.error(err);
                this.loading = false;
                this.end = true;
            }
        });
    },
    search() {
        if (this.query == this.loadedQuery) {
            return;
        }

        this.results = [];
        this.page = 0;
        this.end = false;
        this.$router.push({ path: '/uistring', query: {q: this.query }});
        this.fetchData();
    },
    loadMore() {
        if (!this.end) {
            this.page += 1;
            this.fetchData();
        }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../less/core.less";

.uistrings.browse {
    .searchbar {
        margin-top: 20px;
        label {
            display: block;
            font-weight: normal;
            letter-spacing: 0.1em;
            color: @dv-c-accent-1;
            font-family: @dv-f-geomanist;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            font-size: 10px;
            margin: 0 0 0.5em 0;
        }

        input[type="search"] {
            border: none;
            border-bottom: 1px @dv-c-accent-1 solid;
            background: none;
            width: 100%;
            color: @dv-c-foreground;
            font-family: @dv-f-lato;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 24px;
            transition: border-color 0.125s ease-in, color 0.125s ease-in;

            &:focus {
                border-bottom-color: @dv-c-foreground;
            }

            &::placeholder {
                color: @dv-c-idle;
                font-size: 0.75em;
                letter-spacing: 0.3em;
            }
        }
    }

    .result-wrapper {
        position: relative;

        .loading {
            width: 100%;
            position: absolute;
            background: rgba(0, 0, 0, 0.5);
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
                }

                .text {
                    margin-top: 0.8em;
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
