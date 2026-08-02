  "use client";


import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChartClient({inflow, outflow}:{inflow: number[], outflow: number[]}) {

  const baroptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const barData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Days vs Cashflow In",
        data: inflow,
        backgroundColor: ["green"],

        borderRadius: 6,
      },
    ],
    datasets2: [
      {
        label: "Days vs Cashflow Out",
        data: outflow,
        backgroundColor: ["red"],

        borderRadius: 6,
      },
    ],
  };

  return (
    <div>
      <div>
        <div>
          <h4>Money In versus Money Out</h4>
          <p>see how ,oney ,over through your business over</p>
        </div>
      </div>
      <div className="flex flex-col items-center pt-20">
        {/* <h3 className="text-2xl font-semibold mb-6">My page</h3> */}

        <div className="w-full max-w-4xl ">
          <div style={{ width: "100%", height: "380px" }}>
            <Bar data={barData} options={baroptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
