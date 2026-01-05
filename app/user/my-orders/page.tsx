'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Box, CardSim, ChevronDown, ChevronUp, LocationEdit, Truck } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'



const MyOrders = () => {
  const router = useRouter()
  const [expand, setExpand] = useState(false)



  return (
    <section className='w-full min-h-screen'>
      <motion.div
        className='max-w-3xl mx-auto w-full h-auto relative pt-20 pb-24 space-y-10'>
        {/* Back && My orders */}
        <div className='w-full bg-white/70 fixed top-0 left-0 backdrop-blur-xl shadow-md border-b border-gray-300'>
          <div className='max-w-3xl mx-auto flex flex-row items-center gap-3 px-4 py-3'>
            <motion.button onClick={() => router.push('/')} whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.06 }} className='bg-white shadow-2xl w-auto rounded-xl text-green-700 text-center flex flex-row gap-2 p-1.5 hover:bg-green-200 cursor-pointer transition-all duration-200 items-center'>
              <ArrowLeft className='w-5 h-5' />
              <span className='hidden md:flex font-semibold tracking-wide'>Back to home</span>
            </motion.button>

            <motion.h1 className='font-bold text-md md:text-2xl'>
              My Orders
            </motion.h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='w-full h-full rounded-md shadow-md transition-all flex flex-col gap-2 hover:shadow-xl border border-gray-300'>
          <div className='flex flex-row justify-between items-center bg-green-100 p-4'>
            {/* Order ID */}
            <div className='flex flex-col gap-2'>
              <h2 className='text-xl font-bold'>Order <span className='text-green-700 text-lg'>#abc2111</span></h2>
              <p className='text-sm text-gray-500'>05/12/2025, 12:23:41</p>
            </div>

            <div className='flex items-center gap-2 font-semibold text-sm md:text-sm'>
              <span className='bg-red-200 rounded-2xl text-red-700 transition-all duration-200 hover:bg-red-400 p-2 cursor-pointer'>Unpaid</span>
              <span className='bg-yellow-200 rounded-2xl text-yellow-700 transition-all duration-200 hover:bg-yellow-400 p-2 cursor-pointer'>Pending</span>
            </div>
          </div>

          <div className='p-4 space-y-5'>
            <div className='flex items-center gap-2'>
              <CardSim className='w-5 h-5 text-green-700' />
              <span>Online Payment</span>
            </div>

            <div className='flex items-center gap-2 '>
              <LocationEdit className='w-5 h-5 text-green-700' />
              <span>65 Truong Minh Ky , Ho Chi Minh , Go Vap</span>
            </div>

            <div className='border-b border-gray-200'></div>


            <div className='flex items-center justify-between gap-2 border-b border-gray-100'>
              <div className='flex items-center gap-2'>
                <Box className='w-5 h-5 text-green-700' />
                <span className='font-medium text-lg'>{expand ? 'Hide order items' : 'Items (1)'}</span>
              </div>

              <div className='cursor-pointer transition-all duration-200' onClick={() => setExpand(!expand)}>
                {expand ? (
                  <ChevronDown className='w-5 h-5 text-green-700' />
                ) : (
                  <ChevronUp className='w-5 h-5 text-green-700' />
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {expand && (
                <motion.div
                  key="expand-box"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className='flex justify-between h-auto items-center gap-3 px-4 py-2 bg-gray-100 rounded-2xl shadow-sm'>
                  <div className='flex items-center gap-2'>
                    <Image
                      src='https://plus.unsplash.com/premium_photo-1701616945586-2a7e6908b01f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                      width={100}
                      height={100}
                      alt="Image upload"
                      className="object-cover bg-white border-gray-300 border shadow-2xl rounded-2xl cursor-pointer hover:border-gray-500 transition-all duration-200"
                    />
                    <div>
                      <h1>Food 1</h1>
                      <p>1 x Pack</p>
                    </div>
                  </div>

                  <div>
                    <p>$400</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className='border-b border-black'></div>

            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <Truck className='w-5 h-5 text-green-700' />
                <span className='font-medium text-lg'>Delivery</span>
              </div>

              <div>
                <p>Total: <span>$400</span></p>

              </div>
            </div>
          </div>
        </motion.div>
      </motion.div >
    </section >
  )
}

export default MyOrders