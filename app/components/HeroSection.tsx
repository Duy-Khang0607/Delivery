'use client'
import { Leaf, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
const HeroSection = () => {
    const [current, setCurrent] = useState(0)

    const slides = [
        {
            id: 1,
            icon: <Leaf className='w-20 h-20 text-green-400 sm:w-28 sm:h-28 drop-shadow-lg font-bold' />,
            title: 'Free Delivery',
            subTitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
            btnText: 'Shop Now',
            bg: 'https://media.istockphoto.com/id/2191424156/vi/anh/ph%E1%BB%A5-n%E1%BB%AF-mua-h%C3%A0ng-t%E1%BA%A1p-h%C3%B3a-trong-khi-%C4%91%E1%BB%8Dc-nh%C3%A3n-s%E1%BA%A3n-ph%E1%BA%A9m.jpg?s=2048x2048&w=is&k=20&c=0iTULcsMSHzziyDR6hjzTIp1w3nbjXEpTrUTHtG3b6U='
        },
        {
            id: 2,
            icon: <Leaf className='w-20 h-20 text-green-400 sm:w-28 sm:h-28 drop-shadow-lg font-bold' />,
            title: 'Free Delivery',
            subTitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
            btnText: 'Shop Now',
            bg: 'https://media.istockphoto.com/id/914906098/vi/anh/ng%C6%B0%E1%BB%9Di-ph%E1%BB%A5-n%E1%BB%AF-tr%E1%BA%BB-thu-ho%E1%BA%A1ch-nh%C3%A0-tr%E1%BB%93ng-rau-di%E1%BA%BFp.jpg?s=2048x2048&w=is&k=20&c=YswOtBy9cZc6jTaDnKNvHuRPVFc8JIkt3CW16Gq-QH0='
        },
        {
            id: 3,
            icon: <Leaf className='w-20 h-20 text-green-400 sm:w-28 sm:h-28 drop-shadow-lg font-bold' />,
            title: 'Free Delivery',
            subTitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
            btnText: 'Shop Now',
            bg: 'https://images.unsplash.com/photo-1646143542229-8f8b9ad26747?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % (slides.length))
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className='w-[98%] mx-auto mt-32 h-[80vh] relative rounded-3xl overflow-hidden shadow-3xl'>
            {/* Background Image */}
            <AnimatePresence mode='wait'>
                <motion.div key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }} className='absolute inset-0'
                >
                    <Image src={slides[current]?.bg} alt={slides[current]?.title} fill className='object-cover' />
                </motion.div>
                {/* Blur */}
                <div className='absolute inset-0 bg-black/50 blur-sm'></div>
            </AnimatePresence>

            {/* Icon - Title - Subtitle */}
            <div className='absolute inset-0 flex items-center justify-center text-center text-white'>
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className='flex flex-col items-center justify-center gap-4'
                >
                    <div className='bg-white/10 p-6 rounded-full shadow-lg backdrop-blur-md'>{slides[current]?.icon}</div>
                    <div className='text-2xl md:text-5xl font-extrabold text-center'>{slides[current]?.title}</div>
                    <div className='text-lg md:text-2xl text-center max-w-2xl'>{slides[current]?.subTitle}</div>
                    <motion.button
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className='bg-white/10 p-5 rounded-full shadow-lg backdrop-blur-md cursor-pointer text-green-400 font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2'
                    >
                        <ShoppingBag className='w-5 h-5 text-green-400' />
                        {slides[current]?.btnText}
                    </motion.button>
                </motion.div>
            </div>

            {/* Dots */}
            <div className='absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2'>
                {slides.map((_, index) => (
                    <button className={` h-3 rounded-full transition-all duration-300 ${current === index ? 'bg-green-400 w-5' : 'bg-white/50 w-3'}`} onClick={() => setCurrent(index)}></button>
                ))}
            </div>
        </div>
    )
}

export default HeroSection