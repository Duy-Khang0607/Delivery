'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { Box, CardSim, CheckCircle, ChevronDown, ChevronUp, Loader2, LocationEdit, Phone, Truck, User } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import PopupImage from '../HOC/PopupImage'
import axios from 'axios'
import { IUser } from '../models/user.model'
import mongoose from "mongoose";
import { useRouter } from 'next/navigation'
import { getSocket } from '../lib/socket'



interface AdminOrderProps {
    orders: IOrder
}

interface IOrder {
    _id: string | mongoose.Types.ObjectId,
    user: string | mongoose.Types.ObjectId,
    items: [
        {
            grocery: string | mongoose.Types.ObjectId,
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
    assignedDeliveryBoy?: IUser | null | mongoose.Types.ObjectId,
    assignment?: string | mongoose.Types.ObjectId
}


const AdminOrdersCart = ({ orders }: AdminOrderProps) => {
    const [expand, setExpand] = useState(false)
    const [isOpenImage, setOpenImage] = useState(false)
    const statusPayment = ['Out of delivery', 'Pending']
    const [status, setStatus] = useState<string>('Pending')
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const updateOrderStatus = async (orderId: string, status: string) => {
        setLoading(true)
        try {
            const res = await axios.post(`/api/auth/admin/update-order-status/${orderId}`, { status })
            setStatus(status)
        } catch (error) {
            console.error({ error })
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setStatus(orders?.status)
    }, [orders])

    useEffect(() => {
        const socket = getSocket()
        socket?.on('order-status-updated', (data) => {
            if (data?.orderId?.toString() === orders?._id.toString()) {
                setStatus((prev) => prev === data?.status ? prev : data?.status)
            }
        })
        return () => {
            socket.off('order-status-updated')
        }
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='w-full h-full rounded-md shadow-md transition-all flex flex-col gap-2 hover:shadow-xl border border-gray-300'>
            <div className='flex flex-row justify-between items-center bg-green-100 p-4'>
                {/* Order ID */}
                <div className='flex flex-col gap-2'>
                    <h2 className='text-md md:text-2xl font-bold'>Order <span className='text-green-700 text-sm md:text-lg'>#{String(orders?._id).slice(-6)}</span></h2>
                    {status !== 'Delivered' && (
                        <div className={`rounded-2xl transition-all duration-200 p-2 cursor-pointer ${orders?.isPaid ? 'bg-green-500 text-white hover:bg-green-400' : 'bg-red-200 text-red-700 hover:bg-red-400'} w-fit`}>
                            {orders?.isPaid ? 'Paid' : 'Unpaid'}
                        </div>
                    )}
                    <p className='text-xs md:text-lg text-gray-500'>{new Date(orders?.createdAt!).toLocaleString()}</p>
                </div>

                <div className='flex items-center gap-2 font-semibold text-sm md:text-sm'>
                    {status !== 'Delivered' && (
                        <select required disabled={loading} className='p-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 cursor-pointer' value={status} onChange={(e) => updateOrderStatus(String(orders?._id), e.target.value)}>
                            <option value='' disabled className='bg-gray-300'>Select Status</option>
                            {statusPayment?.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>
                    )}
                    <span className={`rounded-2xl transition-all duration-200 p-2 cursor-pointer ${status === 'Delivered' ? 'bg-green-200 text-green-700 hover:bg-green-400' : status === 'Out of delivery' ? 'bg-yellow-200 text-yellow-700 hover:bg-yellow-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-400'}`}>{loading ? <Loader2 className='w-5 h-5 text-green-700 animate-spin' /> : status}</span>
                </div>
            </div>

            <div className='p-4 space-y-5'>
                <div className='flex items-center gap-2'>
                    <User className='w-5 h-5 text-green-700' />
                    <span className='text-sm md:text-lg w-full'>{orders?.address?.fullName}</span>
                </div>

                <div className='flex items-center gap-2'>
                    <Phone className='w-5 h-5 text-green-700' />
                    <span className='text-sm md:text-lg w-full'>{orders?.address?.mobile}</span>
                </div>

                <div className='flex items-center gap-2'>
                    <CardSim className='w-5 h-5 text-green-700' />
                    <span className='text-sm md:text-lg w-full'>{orders?.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</span>
                </div>

                {orders?.assignedDeliveryBoy && (
                    <>
                        <div className='flex flex-row items-center justify-between gap-2 border bg-blue-100 rounded-2xl p-2 border-blue-200 shadow-md hover:shadow-xl transition-all duration-300'>
                            <div className='flex flex-row  items-center justify-center gap-2'>
                                <User className='w-5 h-5 text-blue-500' />
                                <div className='flex flex-col gap-1'>
                                    <span className='text-sm md:text-lg w-full'>Assigned: <span className='text-sm md:text-lg w-full font-semibold'>{(orders?.assignedDeliveryBoy as IUser)?.name}</span></span>
                                    <span className='text-sm md:text-md text-gray-500 font-semibold'>📞 {(orders?.assignedDeliveryBoy as IUser)?.mobile}</span>
                                </div>
                            </div>

                            <p className='w-auto h-full bg-blue-200 rounded-2xl p-2 transition-all duration-300 hover:bg-blue-400 cursor-pointer'><a href="tel:+4733378901"><Phone className='w-5 h-5 text-blue-500 hover:text-white' /></a></p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            // onClick={() => {
                            //     router.push(`/user/track-order/${orders?._id.toString()}`)
                            // }}
                            className='flex flex-row justify-center items-center gap-2 bg-green-600 text-white rounded-2xl p-2 border border-green-200 shadow-md hover:shadow-xl transition-all duration-300 w-full cursor-pointer text-sm md:text-lg'>

                            {status === 'Delivered' ? (
                                <>
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.2 }}
                                        animate={{ opacity: [0.3, 0, 0.9], scale: [1, 0.5, 1] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2,
                                            ease: "easeIn"
                                        }}
                                        className='inline-block' >
                                        <CheckCircle className='w-5 h-5' />
                                    </motion.span>
                                    Order Delivered
                                </>
                            ) : (
                                <>
                                    <motion.span
                                        initial={{ x: 0 }}
                                        animate={{ x: [0, 10, 0] }}
                                        transition={{ duration: 1, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                                        className='inline-block'
                                    >
                                        <Truck className='w-5 h-5' />
                                    </motion.span>
                                    Tracking my orders
                                </>
                            )}
                        </motion.button>
                    </>
                )}

                <div className='flex items-center gap-2'>
                    <LocationEdit className='w-5 h-5 text-green-700' />
                    <span className='text-sm md:text-lg w-full'>{orders?.address?.fullAddress}</span>
                </div>

                <div className='border-b border-gray-200'></div>


                <div className='flex items-center justify-between gap-2 border-b border-gray-100 cursor-pointer' onClick={() => setExpand(!expand)}>
                    <div className='flex items-center gap-2'>
                        <Box className='w-5 h-5 text-green-700' />
                        <span className='font-medium text-md md:text-lg'>{expand ? 'Hide order items' : `Items (${orders?.items.length})`}</span>
                    </div>

                    <div className='cursor-pointer transition-all duration-200'>
                        {expand ? (
                            <ChevronDown className='w-5 h-5 text-green-700' />
                        ) : (
                            <ChevronUp className='w-5 h-5 text-green-700' />
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {expand && (
                        orders?.items?.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6 }}
                                className='flex justify-between h-auto items-center gap-3 px-4 py-2 bg-gray-100 rounded-2xl shadow-md  transition-all duration-300 border border-gray-200'>
                                <div className='flex items-center gap-2'>
                                    <Image
                                        src={item?.image[0]}
                                        width={60}
                                        height={60}
                                        onClick={() => setOpenImage(true)}
                                        alt="Image upload"
                                        className="object-cover w-[60px] h-[60px] bg-white border-gray-300 border shadow-2xl rounded-2xl cursor-pointer hover:border-gray-500 transition-all duration-200"
                                    />
                                    {/* Popup image */}
                                    <AnimatePresence>
                                        {isOpenImage && item?.image[0] && (
                                            <PopupImage image={item?.image[0]} setOpen={setOpenImage} />
                                        )}
                                    </AnimatePresence>
                                    <div>
                                        <h1 className='text-md md:text-lg font-semibold'>{item?.name}</h1>
                                        <p className='text-sm text-gray-500 font-semibold'>{item?.quantity} x {item?.unit}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className='text-green-700 font-semibold'>${item?.price}</p>
                                </div>
                            </motion.div>

                        ))
                    )}
                </AnimatePresence>

                <div className='border-b border-black'></div>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Truck className='w-5 h-5 text-green-700' />
                        <span className='font-medium text-md md:text-lg'>Delivery: <strong className='text-green-700'>{status}</strong></span>
                    </div>

                    <div>
                        <p className='font-bold text-md md:text-xl'>Total: <span className='text-green-700 font-bold text-md md:text-xl'>${orders?.totalAmount}</span></p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default AdminOrdersCart