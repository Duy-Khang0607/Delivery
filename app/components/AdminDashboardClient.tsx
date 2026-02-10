'use client'

import { motion } from "framer-motion"
import { useState } from "react"
import { ReactElement } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
interface propType {
  earning: {
    today: number,
    sevenDays: number,
    total: number
  }
  stats: { title: string, value: number, icon: ReactElement }[]
  chartData: { day: string, orders: number }[]

}

const AdminDashboardClient = ({ earning, stats, chartData }: propType) => {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">("today")

  const { today, sevenDays, total } = earning

  const currentEarning = filter === "today" ? today : filter === "sevenDays" ? sevenDays : total

  const title = filter === "today" ? "Today" : filter === "sevenDays" ? "Last 7 Days" : "Total"

  return (
    <div className="pt-28 w-[90%] md:w-[80%] mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10 text-center sm:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-extrabold text-green-700"
        >
          Admin Dashboard
        </motion.h1>

        <select required className='w-full sm:w-auto p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300' value={filter} onChange={(e) => setFilter(e.target.value as "today" | "sevenDays" | "total")}>
          <option value="">Select Filter</option>
          <option value="today">Today</option>
          <option value="sevenDays">Last 7 Days</option>
          <option value="total">Total</option>
        </select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full rounded-2xl shadow-md border border-green-300 p-4 space-y-3 hover:shadow-lg hover:border-green-400 transition-all duration-300 text-center"
      >
        <h1 className="text-2xl md:text-xl font-bold text-green-700">{title}</h1>
        <p className="text-2xl md:text-2xl font-extrabold text-green-700">${currentEarning.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full rounded-2xl space-y-3 transition-all duration-300 text-center mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >

        {stats?.length > 0 && stats?.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-2xl shadow-lg border border-gray-200 hover:border-gray-300 p-4 hover:shadow-2xl cursor-pointer transition-all duration-300 h-full flex flex-row items-center gap-3"
          >
            <span className="text-2xl md:text-3xl font-bold text-green-700 w-10 h-10 flex items-center justify-center rounded-full bg-green-100 shrink-0">
              {stat.icon}</span>
            <div className="flex flex-col items-start justify-start text-left w-full h-full">
              <h2 className="text-md md:text-lg font-semibold text-gray-700 w-full h-full">{stat.title}</h2>
              <span className="text-lg md:text-md font-extrabold text-green-700 w-full h-full">{stat.value}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <div className="w-full h-full mt-10 bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-3 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 overflow-hidden cursor-pointer">
        <h1 className="text-md md:text-xl font-semibold text-gray-500">Orders Overviews ( Last 7 days )</h1>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
          >
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <Tooltip />
            <Bar dataKey="orders" fill="lab(54 -38.75 27.36)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

      </div>
    </div >
  )
}

export default AdminDashboardClient