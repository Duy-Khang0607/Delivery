'use client'

import { IOrder } from "@/app/models/orders.model"
import axios from "axios"
import { useEffect, useState } from "react"
import { ArrowLeft, Box, Boxes } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from "next/navigation"
import AdminOrdersCart from "@/app/components/AdminOrdersCart"


const ManageOrders = () => {
    const [orders, setOrder] = useState<IOrder[]>([])
    const [loading, setLoading] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)
    const router = useRouter()

    const fetchOrder = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/auth/admin/get-orders')
            setOrder(res?.data)
        } catch (error) {
            console.error({ error })
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrder()
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
                    <div className='w-full bg-white/70 fixed top-0 left-0 backdrop-blur-xl shadow-md border-b border-gray-300'>
                        <div className='max-w-3xl mx-auto flex flex-row items-center gap-3 py-3'>
                            <AnimatePresence mode="wait"
                                onExitComplete={() => {
                                    router.push("/")
                                }}
                            >
                                {!isLeaving && (
                                    <motion.button
                                        onClick={() => setIsLeaving(true)}
                                        whileTap={{ scale: 0.97 }}
                                        whileHover={{ scale: 1.06 }}
                                        exit={{ opacity: 0, x: -50, scale: 0.98 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className='bg-white shadow-2xl w-auto rounded-xl text-green-700 text-center flex flex-row gap-2 p-1.5 hover:bg-green-200 cursor-pointer transition-all duration-200 items-center'>
                                        <ArrowLeft className='w-5 h-5' />
                                        <span className='hidden md:flex font-semibold tracking-wide'>Back to home</span>
                                    </motion.button>
                                )}
                            </AnimatePresence>

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
                            <AdminOrdersCart key={index} orders={item} />
                        ))
                    )}

                </div>
            )}
        </section>
    )
}

export default ManageOrders