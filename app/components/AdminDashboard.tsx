import connectDB from "../lib/db"
import Orders from "../models/orders.model"
import AdminDashboardClient from "./AdminDashboardClient"
import Users from "../models/user.model"
import Groceries from "../models/grocery.model"
import { Box, Truck } from "lucide-react"
import { User } from "lucide-react"
import { Clock } from "lucide-react"
import { DollarSign } from "lucide-react"

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
    { title: "Total Orders", value: totalOrders , icon: <Box className='w-5 h-5 text-green-700' /> },
    { title: "Total Customers", value: totalCustomer , icon: <User className='w-5 h-5 text-green-700' /> },
    { title: "Pending Deliveries", value: pendingDeliveries , icon: <Truck className='w-5 h-5 text-green-700' /> },
    { title: "Total Revenue", value: totalRevenue , icon: <DollarSign className='w-5 h-5 text-green-700' /> },
  ]


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
      />
    </>
  )
}

export default AdminDashboard