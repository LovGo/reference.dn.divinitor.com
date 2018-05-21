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
    props: ["popData", "range"],
    name: "channel-pop-chart",
    watch: {
        popData: function(oldVal, newVal) {
            let chart = this.$data._chart;
            let nv = this.genDatasets();
            if (chart.data.datasets.length != nv.length) {
                chart.data.datasets = nv.slice();
            }

            for (let i = 0; i < nv.length; ++i) {
                let ds = chart.data.datasets[i].data;
                ds = ds.slice(0, nv[i].data.length);
                for (let k = 0; k < nv[i].data.length; ++k)
                {
                    ds[k] = nv[i].data[k];
                }
    
                chart.data.datasets[i].data = ds;
            }

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
            //  Grouping
            let ret = {};
            let rev = this.popData.slice().reverse();
            for (let k in rev) {
                let v = rev[k];
                let arr = ret[v.cn];
                if (!arr) {
                    arr = [];
                    ret[v.cn] = arr;
                }

                arr.push({t: v.t, y: v.cp, n: v.cn});
            }

            let rret = [];

            let i = 0;
            for (let k in ret) {
                let v = ret[k];
                rret.push({
                    label: `Ch${k}`,
                    backgroundColor: colorsTrans[i % colorsTrans.length],
                    borderColor: colors[i % colors.length],
                    data: v,
                    pointRadius: 0.001,
                    borderWidth: 1,
                    lineTension: 0.1,
                    id: k,
                });

                ++i;
            }

            return rret.reverse();
        },
        onMount() {
            let data = this.genDatasets();
            let start = moment().subtract(this.range.d, this.range.uu);
            this.renderChart({
                datasets: data
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
                            return data.datasets[item.datasetIndex].label + " " + item.yLabel.toLocaleString() + " players";
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
                            stacked: true,
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
                                labelString: "Players"
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
