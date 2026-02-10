'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'


const ButtonHome = () => {
    const router = useRouter()
    const [isLeaving, setIsLeaving] = useState(false)


    return (
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
    )
}

export default ButtonHome