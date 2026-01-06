'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { Box, CardSim, ChevronDown, ChevronUp, LocationEdit, Truck } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { IOrder } from '../models/orders.model'
import PopupImage from '../HOC/PopupImage'


interface AdminOrderProps {
    orders: IOrder
}

const AdminOrdersCart = ({ orders }: AdminOrderProps) => {
    const [expand, setExpand] = useState(false)
    const [isOpenImage, setOpenImage] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='w-full h-full rounded-md shadow-md transition-all flex flex-col gap-2 hover:shadow-xl border border-gray-300'>
            <div className='flex flex-row justify-between items-center bg-green-100 p-4'>
                {/* Order ID */}
                <div className='flex flex-col gap-2'>
                    <h2 className='text-md md:text-2xl font-bold'>Order <span className='text-green-700 text-sm md:text-lg'>#{orders?._id.toString().slice(-6)}</span></h2>
                    <p className='text-xs md:text-lg text-gray-500'>{new Date(orders?.createdAt!).toLocaleString()}</p>
                </div>

                <div className='flex items-center gap-2 font-semibold text-sm md:text-sm'>
                    <span className={`rounded-2xl transition-all duration-200 p-2 cursor-pointer ${orders?.isPaid ? 'bg-green-500 text-white hover:bg-green-400' : 'bg-red-200 text-red-700 hover:bg-red-400'}`}>
                        {orders?.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                    <span className='bg-yellow-200 rounded-2xl text-yellow-700 transition-all duration-200 hover:bg-yellow-400 p-2 cursor-pointer'>{orders?.status}</span>
                </div>
            </div>

            <div className='p-4 space-y-5'>
                <div className='flex items-center gap-2'>
                    <CardSim className='w-5 h-5 text-green-700' />
                    <span className='text-sm md:text-lg w-full'>{orders?.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</span>
                </div>

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
                        <span className='font-medium text-md md:text-lg'>Delivery</span>
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