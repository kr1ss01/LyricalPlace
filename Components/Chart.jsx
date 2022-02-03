import React, { Component } from 'react';
import Chart from 'chart.js/auto';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import { defaults } from 'chart.js';

defaults.font.family = 'Jura';
defaults.font.size = 18;

export default class Chart_Display extends Component {
    handleGraph = () => {
        const { data } = this.props;
        var labels_array = [];
        var data_array = [];
        var backGroundColors = this.props.graph_line_colors;

        // Populate Arrays
        data.forEach((post) => {
            labels_array.push(`${post.title} - ${post.singer}`);
            data_array.push(post.views);
        })

        return (
            <Doughnut 
                data={ {
                    labels: labels_array,
                    datasets: [
                        {
                            label: this.props.label_text,
                            data: data_array,
                            backgroundColor: backGroundColors,
                        }
                    ]
                } }
                height={450}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: this.props.title,
                            color: this.props.fg_color,
                            font: {
                                size: 25,
                                family: 'Jura',
                                color: this.props.fg_color
                            }
                        },
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                color: this.props.fg_color,
                                font: {
                                    size: 10,
                                    family: 'Jura'
                                }
                            }
                        },
                        tooltip: {
                            bodyFont: {
                            family: "Jura",
                            size: 12
                            },
                            titleFont: {
                            family: "Jura",
                            size: 14
                            }
                        }
                    },
                    // scales: {
                    //     yAxis: {
                    //         grid: {
                    //             color: this.props.fg_color
                    //         },
                    //         ticks: {
                    //             color: this.props.fg_color
                    //         }
                    //     },
                    //     xAxis: {
                    //         grid: {
                    //             color: this.props.fg_color
                    //         },
                    //         ticks: {
                    //             color: this.props.fg_color
                    //         }
                    //     }
                    // },
                    maintainAspectRatio: false,
                    font: {
                        family: 'Jura'
                    }
                }} 
            />
        )
    }

  render() {
    return (
        <div>
            {this.handleGraph()}
        </div>
    );
  }
}

Chart_Display.defaultProps = {
    title: "Top Songs Of Lyrical Place",
    fg_color: "#fff",
    graph_line_colors: "#6633CC",
    label_text: "Appeal"
  }