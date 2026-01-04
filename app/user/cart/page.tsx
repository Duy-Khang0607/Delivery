'use client'
import { ArrowLeft, CircleMinus, CirclePlus, Delete, ShoppingBag, ShoppingBagIcon, ShoppingBasket, Trash } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { decreaseQuantity, increaseQuantity, removeCart } from '@/app/redux/cartSlice'
import { useRouter } from 'next/navigation'

const Cart = () => {
    const dispatch = useDispatch()

    const { cartData, subTotal, deliveryFee, finalTotal } = useSelector((state: RootState) => state.cart)

    const router = useRouter()
    console.log({ subTotal })

    return (
        <section className='w-[90%] sm:w-[85%] md:w-[80%] mx-auto min-h-screen mt-8 mb-24 relative'>
            {/* Back to home */}
            <motion.button onClick={() => router.push('/')} whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.06 }} className='bg-white shadow-2xl w-auto rounded-xl text-green-700 text-center absolute -top-2 left-0 flex flex-row gap-2 p-1.5 hover:bg-green-200 cursor-pointer transition-all duration-200 items-center'>
                <ArrowLeft className='w-5 h-5' />
                <span className='hidden md:flex font-semibold tracking-wide'>Back to home</span>
            </motion.button>

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='absolute top-12 left-1/2 -translate-1/2 gap-2 flex flex-row w-full justify-center'
            >
                <ShoppingBag className='w-10 h-10 text-gray-400' />
                <span className='text-green-700 text-2xl sm:text-3xl md:text-4xl font-bold'>Your Shopping Cart</span>
            </motion.h1>

            {/* Items */}
            <div className='grid grid-cols-1 lg:grid-cols-3 md:gap-8'>
                <div className='lg:col-span-2 space-y-5 mt-20'>
                    <AnimatePresence>
                        {cartData?.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className='w-full p-3 bg-white shadow-2xl rounded-2xl flex flex-col justify-between items-center h-fit gap-3'
                            >
                                <ShoppingBasket className='w-15 h-15' />
                                <p className='text-gray-400 text-sm md:text-md'>Your cart is empty . Add some groceries to continue shopping !</p>
                                <Link
                                    href='/'
                                    className='w-full p-2 text-center bg-green-600 text-white rounded-2xl mt-4 cursor-pointer hover:bg-green-500 transition-all duration-300 font-medium'>
                                    Continue Shopping
                                </Link>
                            </motion.div>
                        ) : (
                            cartData?.map((item, index) => {
                                return <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className='w-full p-3 bg-white shadow-2xl rounded-2xl flex flex-col sm:flex-row justify-between items-center mb-4 border border-gray-100'
                                >
                                    {/* Image && Items */}
                                    <div className='flex flex-row items-center gap-4 w-full'>
                                        <Image src={item?.image[0]} alt='Image' className='object-cover transition-transform duration-500 group-hover:scale-105 rounded cursor-pointer w-[100px] h-[100px]' sizes='(max-width: 768px) 100vw, 25vw' width={100} height={100} />
                                        <div className='flex flex-col gap-1'>
                                            <h2 className='text-xl font-semibold'>{item?.name}</h2>
                                            <p className='text-gray-400 text-sm font-medium'>{item?.unit}</p>
                                            <h3 className='text-green-600 font-bold text-sm md:text-base'>${item?.price}</h3>
                                        </div>
                                    </div>

                                    {/* Quantity && Delete*/}
                                    <div className='flex flex-row items-center gap-4 w-full md:justify-end mt-3'>
                                        <div className='bg-gray-100 py-2 px-4 rounded-2xl flex flex-row items-center gap-4 w-full md:w-auto justify-center'>
                                            <motion.button onClick={() => dispatch(decreaseQuantity(item?._id))} whileTap={{ scale: 0.96 }} className='text-green-700 rounded-2xl cursor-pointer hover:text-green-500 transition-all duration-300'>
                                                <CircleMinus className='w-5 h-5' />
                                            </motion.button>
                                            <span className='text-md font-semibold'>{item?.quantity}</span>
                                            <motion.button onClick={() => dispatch(increaseQuantity(item?._id))} whileTap={{ scale: 0.96 }} className='text-green-700 rounded-2xl cursor-pointer hover:text-green-500 transition-all duration-300'>
                                                <CirclePlus className='w-5 h-5' />
                                            </motion.button>
                                        </div>
                                        <motion.button whileTap={{ scale: 0.96 }} className='text-red-700 rounded-2xl cursor-pointer hover:text-red-500 transition-all duration-300 bg-gray-100  py-2 px-2 flex justify-center text-center items-center' onClick={() => dispatch(removeCart(item?._id))}>
                                            <Trash className='w-5 h-5' />
                                        </motion.button>
                                    </div>

                                </motion.div>
                            })
                        )}
                    </AnimatePresence>
                </div>

                {/* Total */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='w-full p-5 bg-white shadow-2xl rounded-2xl flex flex-col mb-4 border border-gray-100 h-fit 
                    sticky mt-20'
                >
                    <div className='flex flex-col gap-2'>
                        {/* Title */}
                        <h2 className='text-2xl font-bold'>Order Summary</h2>

                        {/* Subtotal */}
                        <div className='flex flex-row items-center justify-between'>
                            <p className='text-gray-400 text-sm font-semibold'>Subtotal</p>
                            <p className='text-green-700 font-semibold text-base'>${subTotal}</p>
                        </div>

                        {/* Delivery Fee */}
                        <div className='flex flex-row items-center justify-between'>
                            <p className='text-gray-400 text-sm font-semibold'>Delivery Fee</p>
                            <p className='text-green-700 font-semibold text-base'>${deliveryFee}</p>
                        </div>

                        {/* Border */}
                        <div className='w-full h-1 bg-gray-400 rounded'></div>

                    </div>

                    {/* Final Total */}
                    <div className='flex flex-row items-center justify-between mt-4'>
                        <p className='text-black text-xl font-bold'>Final Total</p>
                        <p className='text-green-700 font-extrabold text-md'>${finalTotal}</p>
                    </div>

                    {/* Proceed checkout */}
                    {cartData?.length > 0 ? (
                        <Link href='/user/checkout'
                            className={`w-full p-2 text-center text-white rounded-2xl mt-4 transition-all duration-300 font-medium bg-green-600 hover:bg-green-500 cursor-pointer`}>
                            Proceed to Checkout
                        </Link>
                    ) : (
                        <div
                            className={`w-full p-2 text-center text-white rounded-2xl mt-4 transition-all duration-300 font-medium bg-gray-400 cursor-not-allowed`}>
                            Proceed to Checkout
                        </div>
                    )}

                </motion.div>
            </div>

        </section>
    )
}

export default Cart