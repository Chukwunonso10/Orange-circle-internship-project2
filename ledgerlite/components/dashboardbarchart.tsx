  "use client";
import SalesForm from "@/components/salesform";
import ExpenseForm from "@/components/expenseform";
import { Bar } from "react-chartjs-2";
import { ChartColumnIncreasing } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart() {
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
        data: [12000, 14500, 23000, 17000, 24500, 520000, 953000],
        backgroundColor: ["green"],

        borderRadius: 6,
      },
      {
        label: "Days vs Cashflow Out",
        data: [10000, 12500, 16000, 17500, 14500, 600000, 853000],
        backgroundColor: ["red"],

        borderRadius: 6,
      },
    ],
  };

  return (
    <div>
      <div>
        <div className="border border-gray-300 shadow-sm p-5 rounded-4xl my-5">
          <div className=" flex justify-around  gap-10">
            <div>
              <h4 className="text-sm text-gray-900 font-semibold">
                Money In versus Money Out
              </h4>
              <p className="text-xs text-gray-700">
                see how money moves through your business over time
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="hidden md:block space-x-2">
                <button className="bg-gray-300 py-1 px-2 rounded-lg md:text-xs text-gray-700 cursor-pointer">
                  Today
                </button>
                <button className="bg-gray-300 py-1 px-2 rounded-lg  text-xs text-gray-700 cursor-pointer">
                  This week
                </button>
                <button className="bg-gray-300 py-1 px-2 rounded-lg text-xs text-gray-700 cursor-pointer">
                  This month
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center py-5 ">
            <ChartColumnIncreasing className="text-slate-900" />
            <h3 className="text-2xl text-slate-900 font-semibold mb-6">
              No transaction
            </h3>
            <p className="text-sm text-center text-gray-700">
              Record your first sales or expense to see how your money moves
              thrugh your business
            </p>
            <div className="md:flex">
              <SalesForm />
              <ExpenseForm />
            </div>
          </div>
        </div>
      </div>
      {/* the bar chart */}
      <div className="md:border md:border-gray-300 md:shadow-sm p-5 md:rounded-4xl my-5">
        <div className=" flex justify-around  gap-10">
          <div>
            <h4 className="text-sm text-gray-900 font-semibold">
              Money In versus Money Out
            </h4>
            <p className="text-xs text-gray-700">
              see how money moves through your business over time
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="hidden md:block  space-x-2">
              <button className="bg-gray-300 py-1 px-2 rounded-lg text-xs text-gray-700 cursor-pointer">
                Today
              </button>
              <button className="bg-gray-300 py-1 px-2 rounded-lg text-xs text-gray-700 cursor-pointer">
                This week
              </button>
              <button className="bg-gray-300 py-1 px-2 rounded-lg text-xs text-gray-700 cursor-pointer">
                This month
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="bg-[#02AD5E] h-2 w-6 rounded-lg"></div>
                <p className="text-[10px] md:text-xs text-gray-700">Money In</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#D01527] h-2 w-6 rounded-lg"></div>
                <p className="text-[10px] md:text-xs text-gray-700">Money Out</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center pt-10">
          {/* <h3 className="text-2xl font-semibold mb-6">My page</h3> */}

          <div className="w-full max-w-4xl ">
            <div style={{ width: "100%", height: "380px" }}>
              <Bar data={barData} options={baroptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
