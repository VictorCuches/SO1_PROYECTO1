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

const GraphLine = ({title, color}) => {
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

      const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

      const data = {
        labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: [1,2,3,4,5,6,7,8,9,10,11,12],
            borderColor: color,
            backgroundColor: color,
          }, 
        ],
      };

  return <Line options={options} data={data} />;
};

export default GraphLine;
