'use client'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPinHouse, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'


const Checkout = () => {
    const router = useRouter()


    return (
        // <section className='w-[90%] sm:w-[85%] md:w-[80%] mx-auto min-h-screen mt-8 mb-24 relative'>
        <section className='w-[90%] sm:w-[85%] md:w-[80%] mx-auto py-10 relative'>
            {/* Back to cart */}
            <motion.button
                onClick={() => router.push('/user/cart')}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.06 }}
                className='absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold cursor-pointer bg-white shadow-lg p-2 rounded-xl'>
                <ArrowLeft className='w-5 h-5' />
                <span className='hidden md:flex font-semibold tracking-wide'>Back to home</span>
            </motion.button>

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                // className='absolute top-12 left-1/2 -translate-1/2 gap-2 flex flex-row w-full justify-center'
                className='text-3xl md:text-4xl font-bold text-green-700 text-center mb-10'
            >
                Checkout
            </motion.h1>

            {/* Delivery, Address && Payment method */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 w-full'>
                {/* Delivery */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='w-full p-3 bg-white shadow-2xl rounded-2xl flex flex-col h-fit gap-3'
                >
                    <div className='flex flex-row items-center gap-2 '>
                        <MapPinHouse className='text-green-700' />
                        <h2 className='text-lg font-semibold'>Delivery Address</h2>
                    </div>
                </motion.div>



                {/* Payment */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='w-full p-3 bg-white shadow-2xl rounded-2xl flex flex-col justify-between items-center h-fit gap-3'
                >
                    <h2>Payment method</h2>
                </motion.div>

            </div>


        </section>
    )
}

export default Checkout