'use client'
import { Box, CircleCheckBig, MoveRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearCart } from '@/app/redux/cartSlice'


const OrderSuccess = () => {
    const dispatch = useDispatch()

    // Clear cart khi vào trang order success
    useEffect(() => {
        dispatch(clearCart())
    }, [dispatch])

    return (
        <section className='flex flex-col items-center text-center justify-center min-h-screen gap-2 px-6'>
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: "spring",
                    damping: 10,
                    stiffness: 100,
                    duration: 0.4
                }}
                className='relative'
            >
                <motion.div
                    initial={{ opacity: 0, scale: -0.5 }}
                    animate={{ opacity: [0.3, 0, 0.3], scale: [1, 0.5, 1] }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeIn"
                    }}
                    className='absolute inset-0'
                >
                    <div className='w-full h-full rounded-full bg-green-700 blur-xs'></div>
                </motion.div>
                <CircleCheckBig className='w-15 h-15 text-green-700' />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='text-4xl font-extrabold text-green-700'
            >
                Order Placed Successfully
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }} className='text-base w-full max-w-2xl'>Thank you for shopping with us! Your order has been placed and is being processed. You can track its progress in your <strong>My Orders</strong> section
            </motion.p>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: [0, -10, 0], opacity: 1 }}
                transition={{
                    delay: 0.2,
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Box className='w-15 h-15 text-green-700' />
            </motion.div>

            <Link href="/user/my-orders">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='text-white bg-green-700 p-2 rounded-lg w-full hover:bg-green-500 transition-all duration-300 cursor-pointer flex flex-row items-center gap-2 justify-center'
                >
                    Go to My Orders  <MoveRight className='w-5 h-5' />
                </motion.button>
            </Link>

        </section>
    )
}

export default OrderSuccess