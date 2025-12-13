'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBasket, Truck } from 'lucide-react'

interface nextType {
    nextStep: (step: string) => void;
}

const Wellcome = ({ nextStep }: nextType) => {
    const handleNextStep = () => {
        nextStep('register');
    }
    return (
        <div className='flex flex-col items-center justify-center gap-2 min-h-screen py-6 text-center bg-linear-to-b from-green-50'>
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{
                    opacity: 1,
                    y: -20,
                }}
                transition={{ duration: 1, delay: 0.3 }}
                className='flex items-center gap-3'
            >
                <ShoppingBasket className='w-10 h-10 text-green-600 font-bold' />
                <h1 className='text-4xl md:text-5xl text-center text-green-700 font-extrabold'>Delivery App</h1>
            </motion.div>
            {/* Decsription */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{
                    opacity: 1,
                    y: -10,
                }}
                transition={{ duration: 1, delay: 0.9 }}
            >
                <p className='text-gray-700 text-lg md:text-xl max-w-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </motion.div>
            {/* Icon */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                    opacity: 1,
                    y: -10,
                }}
                transition={{ duration: 1, delay: 1.8 }}
                className='flex flex-row items-center gap-3'
            >
                <ShoppingBasket className='w-20 h-20 md:w-32 md:h-32 text-green-600 font-bold' />
                <Truck className='w-20 h-20 md:w-32 md:h-32 text-orange-500 font-bold' />
            </motion.div>
            {/* Button next Login */}
            <motion.button initial={{ scale: 0, y: 100 }} animate={{ scale: 1, y: -5 }} transition={{ duration: 1, delay: 2 }} className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2' onClick={handleNextStep}>
                Next
                <ArrowRight className='w-6 h-6 ml-2' />
            </motion.button>
        </div >
    )
}

export default Wellcome