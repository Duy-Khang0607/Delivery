'use client'

import { useParams } from "next/navigation"
import axios from "axios"
import { useEffect, useState } from "react"
import { IOrder } from "@/app/models/orders.model"
import { RootState } from "@/app/redux/store"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { ArrowLeft, Box } from "lucide-react"
import { useRouter } from "next/navigation"
import LiveMap from "@/app/components/LiveMap"
import { getSocket } from "@/app/lib/socket"
import DeliveryChat from "@/app/components/DeliveryChat"

interface ILocation {
  latitude: number;
  longitude: number;
}

const TrackOrder = () => {
  const router = useRouter()
  const { userData } = useSelector((state: RootState) => state?.user)
  const { orderId } = useParams()
  const [order, setOrder] = useState<IOrder>()
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  })
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  })

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/auth/user/get-order/${orderId}`)
      setOrder(res?.data?.order)
      setUserLocation({
        latitude: res?.data?.order?.address?.latitude,
        longitude: res?.data?.order?.address?.longitude,
      })
      setDeliveryBoyLocation({
        latitude: res?.data?.order?.assignedDeliveryBoy?.location?.coordinates?.[1],
        longitude: res?.data?.order?.assignedDeliveryBoy?.location?.coordinates?.[0],
      })
    } catch (error) {
      console.error({ error })
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    const socket = getSocket()
    socket?.on('update-deliveryBoy-location', (data) => {
      setDeliveryBoyLocation({
        latitude: data?.location?.coordinates?.[1],
        longitude: data?.location?.coordinates?.[0],
      })
    })
    return () => {
      socket.off('update-deliveryBoy-location')
    }
  }, [order])

  useEffect(() => {
    fetchOrder()
  }, [userData?._id])


  return (
    <div className='w-[90%] md:w-[80%] mx-auto mt-5 space-y-5'>
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
        <>
          {/* Titiel */}
          <div className='flex flex-row items-center justify-start gap-4 border border-gray-300 rounded-md p-4 shadow-md overflow-hidden w-full h-full'>
            <motion.button
              onClick={() => router.back()}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.06 }}
              className='flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold cursor-pointer bg-white shadow-lg p-2 rounded-xl'>
              <ArrowLeft className='w-5 h-5' />
              <span className='hidden md:flex font-semibold tracking-wide'>Back to home</span>
            </motion.button>

            <div className='flex flex-col gap-2'>
              <h1 className='text-green-700 font-extrabold text-2xl md:text-3xl tracking-wide'>Track order</h1>
              <p className='mb-4'>Order: <span className="text-red-500 text-sm font-semibold">#{order?._id?.toString()?.slice(-6)}</span> - <span className="text-green-700 font-semibold">{order?.status}</span></p>
            </div>
          </div >

          {/* Map */}
          <div className="w-full h-full">
            <LiveMap userLocation={userLocation} deliveryLocation={deliveryBoyLocation} />
          </div>

          {/* Chat */}
          {
            order?._id && userData?._id && (
              <DeliveryChat
                orderId={order._id}
                deliveryBoyId={userData._id} 
                role={userData?.role as 'user' | 'deliveryBoy' | 'admin'} />
            )
          }
        </>
      )}
    </div >
  )
}

export default TrackOrder