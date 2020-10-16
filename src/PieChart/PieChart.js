import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";


const PieChart = () => {
  const [chart, setChart] = useState({
    title: [],
    budget: [],
  });
  const getData = () => {
    axios.get("http://localhost:3000/budget").then((res) => {
      setChart({
        ...chart,
        title: res.data.myBudget.map((data) => {
          return data.title;
        }),
        budget: res.data.myBudget.map((data) => {
          return data.budget;
        }),
      });
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const { title, budget } = chart;

  const data = {
    labels: title,
    datasets: [
      {
        data: budget,
        backgroundColor: [
          "rgb(102, 217, 255)",
          "rgb(153, 0, 255)",
          "rgb(51, 51, 204)",
          "rgb(255, 0, 102)",
          "rgb(255, 102, 255)",
          "rgb(0, 204, 0)",
          "rgb(255, 102, 153)",
        ],
      },
    ],
  };

  return (
    <Pie
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: true,
      }}
    />
  );
};

export default PieChart;