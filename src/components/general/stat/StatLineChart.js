import { Line } from 'vue-chartjs';

import StatName from '@/const/StatName';
import StatCalc from '@/api/StatCalc';

export default {
    extends: Line,
    props: ["stat"],
    name: "stat-line-chart",
    mounted() {
        // let levels = Array.from(new Array(95), (x, i) => i + 1);
        let levels = [1, 24, 32, 40, 50, 60, 70, 80, 90, 93, 95];
        let maxPercent = StatCalc.getLimits(this.stat).maxPercent;
        let data = levels.map(i => Math.round(StatCalc.getValueByName(maxPercent / 100, i, this.stat).result));
        this.renderChart({
            labels: levels,
            datasets: [
                {
                    label: `Amount to Reach Cap (${maxPercent}%)`,
                    backgroundColor: "rgba(58, 110, 150, 0.25)",
                    borderColor: "#5AA9E5",
                    data: data,
                    pointRadius: 4,
                    lineTension: 0,
                }
            ]
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
                        callback: function(lbl, idx, labels) {
                            return (lbl / 1000).toLocaleString() + 'k';
                        },
                    },
                    scaleLabel: {
                        display: true,
                        labelString: `${StatName[this.stat]} Stat`,
                    }
                }]
            }
        });
    }
};
