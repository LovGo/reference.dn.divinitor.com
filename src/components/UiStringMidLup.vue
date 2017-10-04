<template>
  <div class="uistrings midlup">
        <div class="searchbar">
            <input type="search" v-model="query" v-on:keyup.enter="search" name="search" autocomplete="off" placeholder="Enter MID and/or parameters"/>
            <label for="search">MID and/or parameters</label>
        </div>
        
        <div class="result-wrapper">
            <div v-if="loading" class="loading">
                <div class="loader-box">
                    <div class="loader"></div>
                    <div class="label">Loading</div>
                </div>
            </div>
            <div class="results">

            </div>
        </div>
  </div>
</template>

<script>
import region from '@/api/region';
import uistring from '@/api/uistring';

export default {
  name: 'uistringmidlup',
  data () {
    return {
        loadedQuery: "",
        query: "",
        result: {},
        loading: false,
        error: null,
        lastChangeTimer: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../less/core.less";

.uistrings.midlup {
    .result-wrapper {
        position: relative;

        .loading {
            width: 100%;
            position: absolute;
            background: rgba(0, 0, 0, 0.5);
            height: 100vh;
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

                .mid {
                    position: absolute;
                    font-size: 12px;
                    color: @dv-c-accent-1;
                }

                .text {
                    margin-top: 0.8em;
                }

                // max-height: 4em;
                width: 100%;
                overflow-y: hidden;
                text-overflow: ellipsis;
                // white-space: nowrap;
                
                padding: 12px 8px;

                &:first-child {
                    border-top: none;
                }

                &:hover {
                    background-color: rgba(0, 0, 0, 0.75);
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
