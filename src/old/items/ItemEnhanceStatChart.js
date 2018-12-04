import { Line } from 'vue-chartjs';

const colors = [
    '#D0A020',
    '#F050A0',
    '#C080C0',
    '#F09000',
    '#4080F0',
    '#80C040',
    '#E0E0E0',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFFFF',
    '#000000',
];

export default {
    extends: Line,
    props: ["itemData", "enhanceData", "activeStats"],
    name: "item-enhance-stat-line-chart",
    watch: {
    },
    methods: {
        nanny(v) {
            return v ? v : NaN;
        },
        render() {
            let levels = Array.from(new Array(this.enhanceData.length), (x, i) => i + 1);
            let datasets = [

            ];

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
                            return items[0].xLabel;
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
                        id: 'stat',
                        gridLines: {
                            display: true,
                            color: "rgba(200, 225, 255, 0.2)"
                        },
                        ticks: {
                            callback: function(lbl, idx, labels) {
                                return lbl.toLocaleString(undefined, {
                                    minimumFractionDigits: 0
                                }) + "";
                            },
                        },
                        scaleLabel: {
                            display: true,
                            labelString: `Stat`,
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
