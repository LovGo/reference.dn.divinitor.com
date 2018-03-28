import { Line } from 'vue-chartjs';

import StatName from '@/const/StatName';
import StatCalc from '@/api/StatCalc';

const levels = [1, 24, 32, 40, 50, 60, 70, 80, 90, 93, 95];

export default {
    extends: Line,
    props: ["stat", "value"],
    name: "stat-equal-line-chart",
    watch: {
        value: function(oldVal, newVal) {
            let chart = this.$data._chart;
            let ds = chart.data.datasets[0].data;
            let nv = this.genDatasets()[0].data;
            for (let k = 0; k < levels.length; ++k)
            {
                ds[k] = nv[k];
            }
            chart.update();
        }
    },
    methods: {
        genDatasets() {
            let data = levels.map(i => Math.round(StatCalc.getPercentByName(this.value, i, this.stat).result * 100 + StatCalc.getLimits(this.stat).minPercent));
            return [
                {
                    label: `${StatName[this.stat]} at ${this.value.toLocaleString()}`,
                    backgroundColor: "rgba(58, 110, 150, 0.25)",
                    borderColor: "#5AA9E5",
                    data: data,
                    pointRadius: 4,
                    lineTension: 0,
                }
            ];
        },
        render() {
            // let levels = Array.from(new Array(95), (x, i) => i + 1);
            this.renderChart({
                labels: levels,
                datasets: this.genDatasets()
            },
            {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom'
                },
                tooltips: {
                    mode: 'nearest',
                    intersect: false,
                    position: 'nearest',
                    callbacks: {
                        label: function(item, data) {
                            return item.yLabel + "%";
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: true,
                            color: "rgba(200, 225, 255, 0.2)"
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
                            min: StatCalc.getLimits(this.stat).minPercent + 0,
                            max: StatCalc.getLimits(this.stat).minPercent + 100,
                            callback: function(lbl, idx, labels) {
                                return lbl + '%';
                            },
                        },
                        scaleLabel: {
                            display: true,
                            labelString: `${StatName[this.stat]} %`,
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
