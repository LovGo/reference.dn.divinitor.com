<template>
<div class="gameclient">
    <h1>Download Game Client</h1>

    <p>
        This is an alternative to using EYEDENTITY's installer or Steam. Please follow these instructions carefully.
    </p>

    <ol>
        <li>Ensure you have <strong>at least {{ result.TotalSize | fileSize }}</strong> of free space available on the target disk.</li>
        <li>Ensure you have <strong>administrator privileges</strong>.</li>
        <li>Create a target folder for your Dragon Nest installation.<br/>The default location is <code>C:\Program Files (x86)\EYEDENTITY GAMES\Dragon Nest</code> but can be anywhere you want so long as you have permissions.</li>
        <li>Download all the files from <strong>Set 1</strong> into the target folder.</li>
        <li>Create a <code>xigncode</code> folder in the target folder.</li>
        <li>Download all the files from <strong>Set 2</strong> into the <code>xigncode</code> folder.</li>
        <li>In the target folder, run <code>vcredist_x86.exe</code> as an administrator and complete its installation.</li>
        <li>Patch your new Dragon Nest installation by running <code>DnLauncher.exe</code>. Once patching has completed, you are ready to play.</li>
    </ol>

    <div class="dl-info">
        <h3 class="title">Installation Details</h3>
        <table class="data-list">
            <tr>
                <th>Packaged Date</th>
                <td>{{ installerDate }}</td>
            </tr>
            <tr>
                <th>Total Download Size</th>
                <td>{{ result.TotalSize | fileSize }}</td>
            </tr>
            <tr>
                <th>Number of Files</th>
                <td>{{ result.TotalCount }}</td>
            </tr>
        </table>
    </div>

    <h3>Set 1</h3>
    <p>
        Download these files into your target folder.
    </p>
    <div class="file-list">
        <div class="entry" v-for="file in result.FileList" v-if="isSet1(file)" :key="file.Name">
            <div class="name">{{ file.Name }}</div>
            <div class="details">
                <div class="detail">{{ file.Size | fileSize }}</div>
                <div class="detail">{{ file.CheckSum }}</div>
            </div>
            <div class="actions">
                <a :href="makeUrl(file)" download v-on:click="setDownloaded(file)" class="download">
                    <i class="fa fa-download"></i> Download
                </a>
            </div>
            <div class="downloaded" :data-active="file.downloaded">
                Downloaded <i class="fa fa-check"></i>
            </div>
        </div>
    </div>

    <h3>Set 2</h3>
    <p>
        Download these files into the <code>xigncode</code> in your target folder.
    </p>
    <div class="file-list">
        <div class="entry" v-for="file in result.FileList" v-if="!isSet1(file)" :key="file.Name">
            <div class="name">{{ file.Name }}</div>
            <div class="details">
                <div class="detail">{{ file.Size | fileSize }}</div>
                <div class="detail">{{ file.CheckSum }}</div>
            </div>
            <div class="actions">
                <a :href="makeUrl(file)" download v-on:click="setDownloaded(file)" class="download">
                    <i class="fa fa-download"></i> Download
                </a>
            </div>
            <div class="downloaded" :data-active="file.downloaded">
                Downloaded <i class="fa fa-check"></i>
            </div>
        </div>
    </div>

    <h3>Raw file list</h3>
    <p>
        Use this if you have a download manager or are scripting. Be sure to move the XIGNCODE files to the XIGNCODE folder.
    </p>
    <div>
        <code class="block" v-html="asList" />
    </div>

</div>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import FileList from './filelist';

const temp_endpoint = "http://fullclientus.dragonnest.com/filelist.json";

export default {
    data: function() {
        return {
            loading: true,
            error: null,
            result: null
        }
    },
    created() {
        this.load();
    },
    computed: {
        installerDate() {
            return moment(this.result.Version, "YYYY.MM.DD").format("MMM DD YYYY");
        },
        asList() {
            return this.result.FileList.map(v => this.makeUrl(v)).join('<br/>');
        }
    },
    methods: {
        load() {
            this.loading = true;
            this.error = null;
            this.result = FileList;
            for (let k in this.result.FileList) {
                let v = this.result.FileList[k];
                this.$set(v, "downloaded", false);
            }
            // Vue.http.get(temp_endpoint, {
            //     before: function(req) {
            //         req.headers.delete("Authorization");
            //     }
            // }).then((res) => {
            //     this.loading = false;
            //     this.result = res;
            //     this.error = null;
            // }, (err) => {
            //     this.error = err;
            //     this.loading = false;
            // })
        },
        isSet1(file) {
            return file.Name.indexOf("/") < 0;
        },
        makeUrl(file) {
            return this.result.URL + file.Name;
        },
        setDownloaded(file) {
            file.downloaded = true;
            appInsights.trackEvent(`resources.gameclient.download`,
            {
                file: file.Name,
                region: this.$store.state.regionCode,
            });
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../../less/core.less";
.gameclient {
    position: relative;

    .file-list {
        .entry {
            position: relative;
            display: block;
            border: 1px solid @dv-c-accent-2;
            border-top-color: transparent;
            padding: 4px 8px;

            background: rgba(0, 0, 0, 0.375);
            transition: background-color ease-in 0.125s;

            &:first-child {
                border-top-color: @dv-c-accent-2;
            }

            &:hover,
            &.active:hover {
                background: fade(@dv-c-foreground, 20%);
                .details {
                    color: @dv-c-body;
                }
            }

            &.active {
                background: fade(@dv-c-foreground, 10%);
            }
            
            .name {
                font-family: @dv-f-geomanist;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: @dv-c-foreground;
                font-size: 18px;
            }

            .details {
                display: flex;
                flex-direction: row;
                color: @dv-c-idle;
                font-size: 12px;
                transition: color ease-in 0.125s;

                .detail {
                    margin-right: 12px;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }

            .actions {
                margin: 4px 0;
                .download {
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-size: 14px;
                }
            }

            .downloaded {
                position: absolute;
                right: 10px;
                top: 10px;
                font-size: 12px;
                color: @dv-c-green;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                opacity: 0;
                transition: opacity ease-in 0.125s;

                &[data-active="true"] {
                    opacity: 1.0;
                }
            }
        }
    }

    .dl-info {
        table {
            th {
                text-align: right;
                padding-right: 12px;
                font-weight: normal;
                color: @dv-c-foreground;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                font-size: 14px;
            }
        }
    }
}
</style>
