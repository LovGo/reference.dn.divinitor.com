import { Line } from 'vue-chartjs';

const colors = {
    divine: '#D0A020',
    legendary: '#F050A0',
    unique: '#C080C0',
    epic: '#F09000',
    rare: '#4080F0',
    magic: '#80C040',
    normal: '#E0E0E0',
};

export default {
    extends: Line,
    props: ["itemData", "enhanceData", "goldenGoose", "materialsSet"],
    name: "item-enhance-material-line-chart",
    watch: {
        goldenGoose: function(oldVal, newVal) {
            let conv = 1;
            if (oldVal == newVal) {
                return;
            }

            if (oldVal && !newVal) {
                //  Turning on
                conv = 0.5;
            } else {
                //  Turning off
                conv = 2;
            }

            let chart = this.$data._chart;
            let ds = chart.data.datasets[0].data;
            for (let k = 0; k < ds.length; ++k)
            {
                ds[k] *= conv;
            }
            chart.update();
        }
    },
    methods: {
        nanny(v) {
            return v ? v : NaN;
        },
        render() {
            let levels = Array.from(new Array(this.enhanceData.length), (x, i) => i + 1);
            let goldData = this.enhanceData.map((v) => Math.floor(v.cost * (this.goldenGoose ? 0.5 : 1.0) / 10000));
            let jellyData = this.enhanceData.map((v) => this.nanny(v.jellyUseCount));
            
            let datasets = [
                {
                    label: `Gold`,
                    // backgroundColor: "rgba(208, 160, 32, 0.125)",
                    borderColor: "rgba(208, 160, 32, 0.25)",
                    data: goldData,
                    pointRadius: 4,
                    pointBackgroundColor: "#D0A020",
                    pointBorderColor: "#D0A020",
                    lineTension: 0,
                    yAxisID: 'gold',
                    // steppedLine: true,
                    labelCb: function(v) {
                        return v.toLocaleString() + "g";
                    }
                },
                {
                    label: `Jelly`,
                    // backgroundColor: "rgba(205, 32, 32, 0.25)",
                    borderColor: "rgba(205, 32, 32, 0.25)",
                    // borderColor: "#cd2020",
                    pointBackgroundColor: "#cd2020",
                    pointBorderColor: "#cd2020",
                    data: jellyData,
                    pointRadius: 4,
                    lineTension: 0,
                    steppedLine: true,
                    yAxisID: 'items',
                    labelCb: function(v) {
                        return v + " jelly";
                    }
                }
            ];

            for (let mk in this.materialsSet) {
                let mv = this.materialsSet[mk];
                let dd = Array.from(new Array(this.enhanceData.length), (x, i) => this.nanny(mv.amount[i + 1] || 0));
                let rcol = colors[mv.item.rank.toLowerCase()];
                let d = {
                    label: mv.item.name.name,
                    data: dd,
                    pointRadius: 2,
                    lineTension: 0,
                    borderColor: rcol,
                    pointBackgroundColor: rcol,
                    pointBorderColor: rcol,
                    borderWidth: 1,
                    hidden: true,
                    steppedLine: true,
                    // backgroundColor: "rgba(255, 255, 255, 0.125)",
                    yAxisID: 'items',
                    labelCb: function(v) {
                        return v + " " + mv.item.name.name;
                    }
                }

                datasets.push(d);
            }


            this.renderChart({
                labels: levels,
                datasets: datasets
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
                            return "Attempting " + items[0].xLabel;
                        },
                        label: function(item, data) {
                            let cb = data.datasets[item.datasetIndex].labelCb;
                            if (cb) {
                                return cb(item.yLabel);
                            }

                            return item.yLabel;
                        }
                    }
                },
                hover: {
                    mode: 'label',
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: true,
                            color: "rgba(200, 225, 255, 0.2)"
                        },
                        ticks: {
                            callback: function(lbl, idx, labels) {
                                return "+" + lbl;
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Level",
                        }
                    }],
                    yAxes: [{
                        id: 'gold',
                        gridLines: {
                            display: true,
                            color: "rgba(200, 225, 255, 0.2)"
                        },
                        ticks: {
                            callback: function(lbl, idx, labels) {
                                return lbl.toLocaleString(undefined, {
                                    minimumFractionDigits: 0
                                }) + "g";
                            },
                        },
                        scaleLabel: {
                            display: true,
                            labelString: `Gold`,
                        }
                    },
                    {
                        id: 'items',
                        gridLines: {
                            display: false,
                            color: "rgba(200, 225, 255, 0.2)"
                        },
                        position: 'right',
                        ticks: {
                            callback: function(lbl, idx, labels) {
                                return lbl.toLocaleString() + "x";
                            },
                            min: 0,

                        },
                        scaleLabel: {
                            display: true,
                            labelString: `Materials`,
                        }
                    }]
                }
            });
        }
    },
    mounted() {
        this.render();
    }
};
