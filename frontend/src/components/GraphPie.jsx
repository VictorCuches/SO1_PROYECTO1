import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

const GraphPie = ( { title, usageValue } ) => {
  const data = {
    labels: [title],
    datasets: [
      {
        label: "Libre",
        data: [usageValue, 100 - usageValue],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 2,
      },
    ],
  };
  return <Pie data={data} />;
};

export default GraphPie;
