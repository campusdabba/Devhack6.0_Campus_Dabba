"use client"

import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement)

const salesData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Sales",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ],
}

const ordersData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Orders",
      data: [65, 59, 80, 81, 56, 55],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
}

export default function Reports() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Monthly Sales</h2>
          <Bar data={salesData} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Monthly Orders</h2>
          <Line data={ordersData} />
        </div>
      </div>
    </div>
  )
}

