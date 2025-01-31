"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Orders",
      data: [65, 59, 80, 81, 56, 55],
      borderColor: "rgb(124, 58, 237)",
      backgroundColor: "rgba(124, 58, 237, 0.5)",
    },
    {
      label: "Revenue",
      data: [28, 48, 40, 19, 86, 27],
      borderColor: "rgb(99, 102, 241)",
      backgroundColor: "rgba(99, 102, 241, 0.5)",
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Monthly Overview",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

export function Overview() {
  return (
    <div className="p-4 h-[300px]">
      <Line options={options} data={data} />
    </div>
  )
}

