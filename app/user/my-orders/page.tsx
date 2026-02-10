'use client'
import UserOrdersCart from '@/app/components/UserOrdersCart'
import { getSocket } from '@/app/lib/socket'
import { IUser } from '@/app/models/user.model'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowLeft, Box, Boxes } from 'lucide-react'
import mongoose from 'mongoose'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface IOrder {
  _id: mongoose.Types.ObjectId,
  user: mongoose.Types.ObjectId,
  items: [
    {
      grocery: mongoose.Types.ObjectId,
      name: string,
      price: string,
      unit: string,
      image: string[],
      quantity: string,
    }
  ]
  totalAmount: number,
  paymentMethod: 'cod' | 'online',
  address: {
    fullName: string,
    mobile: number,
    city: string,
    state: string,
    pincode: string,
    fullAddress: string,
    latitude: number,
    longitude: number
  },
  status: 'Pending' | 'Out of delivery' | 'Delivered',
  createdAt?: Date,
  updatedAt?: Date,
  isPaid: Boolean,
  assignedDeliveryBoy?: IUser | null,
  assignment?: mongoose.Types.ObjectId,
  deliveredAt?: Date | null,
  deliveryOTP?: string | null,
  deliveryOTPVerification: boolean,
}

const MyOrders = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<IOrder[] | null>([])


  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/auth/user/my-orders');
      setOrders(res?.data)
    } catch (error: any) {
      console.error({ error: error?.response?.data })
      setLoading(false)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const socket = getSocket()

    socket?.on('order-assigned', (data) => {
      const { orderId, assignmentDeliveryBoy } = data

      setOrders((prevOrders) => {
        if (!prevOrders) return prevOrders

        return prevOrders.map((order) =>
          order?._id.toString() === orderId?.toString()
            ? {
              ...order,
              assignedDeliveryBoy: assignmentDeliveryBoy
            }
            : order
        )
      })
    })

    return () => {
      socket.off('order-assigned')
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <section className='w-[90%] sm:w-[85%] md:w-[80%] mx-auto min-h-screen'>
      {loading ? (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: [0, -10, 0], opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className='flex flex-col items-center justify-center min-h-screen'
        >
          <Box className='w-25 h-25 md:w-50 md:h-50 text-green-700 mb-5' />
        </motion.div>
      ) : (
        <div
          className='max-w-3xl mx-auto w-full h-full relative pt-20 pb-24 space-y-10'>
          {/* Back && My orders */}
          <div className='w-full bg-white/70 fixed top-0 left-0 backdrop-blur-xl shadow-md border-b border-gray-300 z-9'>
            <div className='max-w-3xl mx-auto flex flex-row items-center gap-3 py-3'>
              <motion.button onClick={() => router.push('/')} whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.06 }} className='bg-white shadow-2xl w-auto rounded-xl text-green-700 text-center flex flex-row gap-2 p-1.5 hover:bg-green-200 cursor-pointer transition-all duration-200 items-center'>
                <ArrowLeft className='w-5 h-5' />
                <span className='hidden md:flex font-semibold tracking-wide'>Back to home</span>
              </motion.button>

              <motion.h1 className='font-bold text-lg md:text-2xl'>
                My Orders
              </motion.h1>
            </div>
          </div>

          {/* Order cart items empty */}
          {orders?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className='w-full flex flex-col items-center justify-center'
            >
              <Boxes className='w-15 h-15 md:w-20 md:h-20 text-green-700' />
              <h1 className='text-md md:text-2xl font-bold'>No Orders Found</h1>
              <p className='text-sm max-w-md md:max-w-xl text-gray-500'>Start shopping to view your orders here.</p>
            </motion.div>
          ) : (
            orders?.map((item, index) => (
              <UserOrdersCart key={index} orders={item} />
            ))
          )}
        </div >
      )}

    </section >
  )
}

export default MyOrders