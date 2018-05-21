import { Line } from 'vue-chartjs';
import moment from 'moment';

const colors = [
    "rgb(49, 192, 246)",
    "rgb(49, 145, 245)",
    "rgb(137, 78, 205)",
    "rgb(208, 0, 141)",
    "rgb(253, 48, 89)",
    "rgb(255, 126, 39)"
];

const colorsTrans = [
    "rgba(49, 192, 246, 0.1)",
    "rgba(49, 145, 245, 0.1)",
    "rgba(137, 78, 205, 0.1)",
    "rgba(208, 0, 141, 0.1)",
    "rgba(253, 48, 89, 0.1)",
    "rgba(255, 126, 39, 0.1)"
];

export default {
    extends: Line,
    props: ["pingData", "range"],
    name: "ping-chart",
    watch: {
        pingData: function(oldVal, newVal) {
            let chart = this.$data._chart;
            let nv = this.genDatasets();
            let con = nv.connect;

            let ds = chart.data.datasets[0].data;
            ds = ds.slice(0, con.length);
            for (let k = 0; k < con.length; ++k)
            {
                ds[k] = con[k];
            }

            chart.data.datasets[0].data = ds;

            let log = nv.login;
            ds = chart.data.datasets[1].data;
            ds = ds.slice(0, log.length);
            for (let k = 0; k < log.length; ++k)
            {
                ds[k] = log[k];
            }

            chart.data.datasets[1].data = ds;

            let ch = nv.channel;
            ds = chart.data.datasets[2].data;
            ds = ds.slice(0, ch.length);
            for (let k = 0; k < ch.length; ++k)
            {
                ds[k] = ch[k];
            }

            chart.data.datasets[2].data = ds;
            
            let start = moment().subtract(this.range.d, this.range.uu);
            chart.options.scales.xAxes[0].time.min = start;
            chart.options.scales.xAxes[0].time.max = moment();
            chart.options.scales.xAxes[0].time.unit = this.range.du;
            chart.update();
        },
        range: function(oldVal, newVal) {
            let chart = this.$data._chart;
            let start = moment().subtract(this.range.d, this.range.uu);
            chart.options.scales.xAxes[0].time.min = start;
            chart.options.scales.xAxes[0].time.max = moment();
            chart.options.scales.xAxes[0].time.unit = this.range.du;
            chart.update();
        }
    },
    methods: {
        genDatasets() {
            let ret = {
                connect: [],
                login: [],
                channel: [],
            };

            let d = this.pingData.slice().reverse();
            for (const v of d) {
                ret.connect.push({t: v.t, y: v.pc});
                ret.login.push({t: v.t, y: v.pl});
                ret.channel.push({t: v.t, y: v.ph});
            }

            console.log(ret.connect);
            return ret;
        },
        onMount() {
            let data = this.genDatasets();
            let start = moment().subtract(this.range.d, this.range.uu);

            this.renderChart({
                datasets: [
                    {
                        label: `Connect`,
                        backgroundColor: colorsTrans[0],
                        borderColor: colors[0],
                        data: data.connect,
                        pointRadius: 0.001,
                        borderWidth: 1,
                        lineTension: 0.2,
                        id: "connect",
                    },
                    {
                        label: `Login`,
                        backgroundColor: colorsTrans[1],
                        borderColor: colors[1],
                        data: data.login,
                        pointRadius: 0.001,
                        borderWidth: 1,
                        lineTension: 0.2,
                        id: "login",
                    },
                    {
                        label: `Channel`,
                        backgroundColor: colorsTrans[2],
                        borderColor: colors[2],
                        data: data.channel,
                        pointRadius: 0.001,
                        borderWidth: 1,
                        lineTension: 0.2,
                        id: "channel",
                    }
                ]
            },
            {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',
                },
                tooltips: {
                    mode: 'label',
                    intersect: false,
                    position: 'average',
                    callbacks: {
                        title: function(items, data) {
                            return moment(items[0].xLabel).format("MMM DD YYYY HH:mm");
                        },
                        label: function(item, data) {
                            return item.yLabel.toLocaleString() + "ms";
                        }
                    }
                },
                hover: {
                    mode: 'label',
                },
                scales: {
                    xAxes: [{
                        type: "time",
                        gridLines: {
                            display: true,
                            color: "rgba(200, 225, 255, 0.2)"
                        },
                        time: {
                            displayFormats: {
                                minute: "HH:mm",
                                hour: "HH:mm"
                            },
                            unit: this.range.du,
                            min: start,
                            max: moment(),
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Time"
                        }
                    }],
                    yAxes: [
                        {
                            gridLines: {
                                display: true,
                                color: "rgba(200, 225, 255, 0.2)"
                            },
                            ticks: {
                                callback: function(lbl, idx, labels) {
                                    return lbl.toLocaleString(undefined, {
                                        minimumFractionDigits: 0
                                    });
                                },
                                min: 0,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Ping (ms)"
                            }
                        }
                    ]
                }
            });
        }
    },
    mounted() {
        this.onMount();
    }
};
