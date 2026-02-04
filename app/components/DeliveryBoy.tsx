import DeliveryBoyDashboard from './DeliveryBoyDashboard'
import connectDB from '../lib/db'
import { auth } from '../auth'
import Orders from '../models/orders.model'

const DeliveryBoy = async () => {
  await connectDB()

  const session = await auth()

  const deliveryBoyId = session?.user?.id;

  const orders = await Orders.find({ assignedDeliveryBoy: deliveryBoyId, deliveryOTPVerification: true })

  const today = new Date().toDateString();

  const todayOrders = orders?.filter((order) => order?.deliveredAt?.toDateString() === today)?.length || 0;

  const todayEarnings = todayOrders * 40;

  return (
    <>
      <DeliveryBoyDashboard earning={todayEarnings} />
    </>
  )
}

export default DeliveryBoy