import connectDB from "../lib/db"
import Orders from "../models/orders.model"
import AdminDashboardClient from "./AdminDashboardClient"
import Users from "../models/user.model"
import Groceries from "../models/grocery.model"
import { Box, Truck } from "lucide-react"
import { User } from "lucide-react"
import { DollarSign } from "lucide-react"
import { IOrder } from "../models/orders.model"

const AdminDashboard = async () => {

  await connectDB()

  const orders = await Orders.find({})

  const users = await Users.find({ role: "user" })

  const groceries = await Groceries.find({})

  const totalOrders = orders?.length

  const totalCustomer = users?.length

  const pendingDeliveries = orders.filter((o) => o?.status === "Pending")?.length

  const totalRevenue = orders.reduce((sum, o) => sum + (o?.totalAmount || 0), 0)

  const totalGroceries = groceries.length

  const totalDeliveryBoys = users.filter((u) => u?.role === "deliveryBoy")?.length

  const totalPendingDeliveries = orders.filter((o) => o?.status === "Pending")?.length

  const totalCompletedDeliveries = orders.filter((o) => o?.status === "Delivered")?.length

  const today = new Date()
  const startOfToday = new Date(today)
  startOfToday.setHours(0, 0, 0, 0)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

  const todayOrders = orders?.filter((o) => new Date(o?.createdAt) >= startOfToday)
  const todayRevenue = todayOrders?.reduce((sum, o) => sum + (o?.totalAmount || 0), 0)

  const sevenDaysOrders = orders?.filter((o) => new Date(o?.createdAt) >= sevenDaysAgo)
  const sevenDaysRevenue = sevenDaysOrders?.reduce((sum, o) => sum + (o?.totalAmount || 0), 0)

  const stats = [
    { title: "Total Orders", value: totalOrders, icon: <Box className='w-5 h-5 text-green-700' /> },
    { title: "Total Customers", value: totalCustomer, icon: <User className='w-5 h-5 text-green-700' /> },
    { title: "Pending Deliveries", value: pendingDeliveries, icon: <Truck className='w-5 h-5 text-green-700' /> },
    { title: "Total Revenue", value: totalRevenue, icon: <DollarSign className='w-5 h-5 text-green-700' /> },
  ]

  const chartData = []
  const formatOrdersData = JSON.parse(JSON.stringify(orders))


  for (let i = 6; i >= 0; i--) {
    const day = new Date()
    day.setDate(day.getDate() - i)
    day.setHours(0, 0, 0, 0)

    const nextDay = new Date(day)
    nextDay.setDate(nextDay.getDate() + 1)


    const ordersCount = formatOrdersData?.filter((o: IOrder) => {
      const createdAt = new Date(o?.createdAt?.toString() || '');
      return createdAt >= day && createdAt < nextDay;
    })?.length || 0

    chartData.push({
      day: day?.toLocaleDateString('en-US', { weekday: 'short' }),
      orders: ordersCount
    })
  }

  return (
    <>
      <AdminDashboardClient
        earning={
          {
            today: todayRevenue,
            sevenDays: sevenDaysRevenue,
            total: totalRevenue
          }
        }
        stats={stats}
        chartData={chartData}
      />
    </>
  )
}

export default AdminDashboard