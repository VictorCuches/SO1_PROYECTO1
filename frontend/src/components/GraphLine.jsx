import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GraphLine = ({title, color, dates, dataHistory}) => {
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: title,
          },
        },
      };

      const labels = dates;

      const data = {
        labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: dataHistory,
            borderColor: color,
            backgroundColor: color,
          }, 
        ],
      };

  return <Line options={options} data={data} />;
};

export default GraphLine;
