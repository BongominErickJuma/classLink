import React, { useState } from "react";
import Chart from "react-apexcharts";

const Analytics = () => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    markers: {
      size: 4,
    },
    colors: ["#28a745", "#BC9F8B", "#03aed2"], // Green, Blue, Red
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.4,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2024-08-10T00:00:00.000Z",
        "2024-08-11T00:00:00.000Z",
        "2024-08-12T00:00:00.000Z",
        "2024-08-13T00:00:00.000Z",
        "2024-08-14T00:00:00.000Z",
        "2024-08-15T00:00:00.000Z",
        "2024-08-16T00:00:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
  });

  const [chartSeries, setChartSeries] = useState([
    {
      name: "Attendance",
      data: [31, 40, 28, 51, 42, 82, 56],
    },
    {
      name: "Course Progress",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "Performance",
      data: [15, 11, 32, 18, 9, 24, 11],
    },
  ]);

  return (
    <div className="card analytics">
      <div className="card-body">
        <h3 className="card-title">Analytics</h3>
        {/* Graphs showing user engagement, course completions, etc. */}
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default Analytics;
