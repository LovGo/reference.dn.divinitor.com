import { Line } from 'vue-chartjs';
import moment from 'moment';

export default {
    extends: Line,
    props: ["popData", "range"],
    name: "server-pop-chart",
    mounted() {
        let data = this.popData.map(d => ({t: d.t, y: d.cp}));
        let start = moment().subtract(this.range.d, this.range.uu);

        this.renderChart({
            datasets: [
                {
                    label: `Connected Accounts`,
                    backgroundColor: "rgba(58, 110, 150, 0.25)",
                    borderColor: "#5AA9E5",
                    data: data,
                    pointRadius: 4,
                    lineTension: 0.5,
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
                            minute: "HH:mm"
                        },
                        min: start,
                        max: moment(),
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Time"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: true,
                        color: "rgba(200, 225, 255, 0.2)"
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Accounts"
                    }
                }]
            }
        });
    }
};
