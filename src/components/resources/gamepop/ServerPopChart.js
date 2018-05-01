import { Line } from 'vue-chartjs';
import moment from 'moment';

export default {
    extends: Line,
    props: ["popData", "range"],
    name: "server-pop-chart",
    watch: {
        popData: function(oldVal, newVal) {
            let chart = this.$data._chart;
            let ds = chart.data.datasets[0].data;
            let nv = this.genDatasets();
            ds = ds.slice(0, nv.length);
            for (let k = 0; k < nv.length; ++k)
            {
                ds[k] = nv[k];
            }

            chart.data.datasets[0].data = ds;

            let start = moment().subtract(this.range.d, this.range.uu);
            chart.options.scales.xAxes[0].time.min = start;
            chart.options.scales.xAxes[0].time.max = moment();
            chart.options.scales.xAxes[0].time.unit = this.range.du;
            chart.update();
            this.mounted();
        },
        range: function(oldVal, newVal) {
            this.mounted();
        }
    },
    methods: {
        genDatasets() {
            return this.popData.map(d => ({t: d.t, y: d.cp})).reverse();
        }
    },
    mounted() {
        let data = this.genDatasets();
        let start = moment().subtract(this.range.d, this.range.uu);

        this.renderChart({
            datasets: [
                {
                    label: `Connected Accounts`,
                    backgroundColor: "rgba(58, 110, 150, 0.25)",
                    borderColor: "#5AA9E5",
                    data: data,
                    pointRadius: 0.001,
                    borderWidth: 1,
                    lineTension: 0.2,
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
                        return item.yLabel.toLocaleString() + " accounts";
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
                            labelString: "Accounts"
                        }
                    }
                ]
            }
        });
    }
};
