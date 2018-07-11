import { Line } from 'vue-chartjs';

export default {
    extends: Line,
    props: ["itemData", "enhanceData"],
    name: "item-enhance-rate-line-chart",
    mounted() {
        let levels = Array.from(new Array(this.enhanceData.length), (x, i) => i + 1);
        let enhanceRateData = this.enhanceData.map((v) => v.successRate);
        let failRateData = this.enhanceData.map((v) => v.breakRate ? v.breakRate : NaN);
        this.renderChart({
            labels: levels,
            datasets: [
                {
                    label: `Success Rate`,
                    backgroundColor: "rgba(32, 205, 64, 0.075)",
                    borderColor: "#20cd40",
                    data: enhanceRateData,
                    steppedLine: true,
                    pointRadius: 4,
                    lineTension: 0,
                },
                {
                    label: `Break Rate`,
                    // backgroundColor: "rgba(205, 32, 32, 0.25)",
                    borderColor: "#cd2020",
                    steppedLine: true,
                    data: failRateData,
                    pointRadius: 4,
                    lineTension: 0,
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
                        return "Attempting " + items[0].xLabel;
                    },
                    label: function(item, data) {
                        return (item.yLabel * 100).toLocaleString() + "% " + data.datasets[item.datasetIndex].label;
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
                    gridLines: {
                        display: true,
                        color: "rgba(200, 225, 255, 0.2)"
                    },
                    ticks: {
                        callback: function(lbl, idx, labels) {
                            return (lbl * 100).toLocaleString() + "%";
                        },
                        max: 1,
                        min: 0,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: `Rate`,
                    }
                }]
            }
        });
    }
};
