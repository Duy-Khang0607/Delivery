'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { IGrocery } from '../models/grocery.model'
import Image from 'next/image'
import { CircleMinus, CirclePlus, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import PopupImage from '../HOC/PopupImage'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { addToCart, decreaseQuantity, increaseQuantity } from '../redux/cartSlice'

interface GroceryItemCardProps {
  groceries: IGrocery
}


const GroceyItemCard = ({ groceries }: GroceryItemCardProps) => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>()

  // State redux - Cart
  const { cartData } = useSelector((state: RootState) => state.cart)

  // Find item -> khi click "Add to cart"
  const cartItem = cartData?.find(item => item?._id === groceries?._id)


  return (
    <motion.div className='bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col md:min-w-[150px]'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {/* Image */}
      <div className='relative w-full aspect-4/3 bg-gray-50 overflow-hidden group border-b border-gray-100'>
        <Image onClick={() => setOpen(true)} src={groceries?.image[0]} alt={groceries?.name} className='object-cover transition-transform duration-500 group-hover:scale-105 w-full' sizes='(max-width: 768px) 100vw, 25vw' fill />
      </div>

      {/* Title && Button */}
      <div className='p-3 w-full'>
        {/* Category */}
        <p className='text-xs md:text-md font-medium text-gray-400 w-full h-7'>{groceries?.category}</p>

        {/* Name */}
        <h1 className='h-7 w-auto font-semibold text-xs md:text-md'>{groceries?.name}</h1>

        {/* Unit & Price */}
        <div className='flex flex-row justify-between items-center'>
          <span className='w-auto p-1.5 rounded-2xl bg-gray-100 text-center text-xs font-normal'>{groceries?.unit}</span>
          <span className='text-green-700 font-semibold text-xs md:text-lg'>
            ${groceries?.price}
          </span>
        </div>

        {/* Button Add to Cart */}
        {cartItem ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className='w-full bg-gray-200 rounded-2xl cursor-pointer gap-2 py-1.5 mt-3 border border-green-500 text-green-500'>
            <div className='flex flex-row items-center justify-center gap-2'>
              <CircleMinus onClick={() => dispatch(decreaseQuantity(groceries?._id))} className='w-5 h-5 hover:text-green-700' />
              <span>{cartItem?.quantity}</span>
              <CirclePlus onClick={() => dispatch(increaseQuantity(groceries?._id))} className='w-5 h-5 hover:text-green-700' />
            </div>
          </motion.div>
        ) : (
          <motion.button onClick={() => dispatch(addToCart({ ...groceries, quantity: 1 }))} whileTap={{ scale: 0.96 }} className='w-full bg-green-600 text-white rounded-2xl hover:bg-green-400 cursor-pointer flex flex-row justify-center items-center gap-2 py-1.5 mt-3 text-xs md:text-sm'>
            <ShoppingCart className='w-4 h-4 md:w-5 md:h-5' />
            Add to cart
          </motion.button>
        )}
      </div>

      {/* Popup image */}
      <AnimatePresence>
        {open && groceries?.image[0] && (
          <PopupImage image={groceries?.image[0]} setOpen={setOpen} />
        )}
      </AnimatePresence>

    </motion.div>
  )
}

export default GroceyItemCard