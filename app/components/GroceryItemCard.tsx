'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { IGrocery } from '../models/grocery.model'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import PopupImage from '../HOC/PopupImage'

interface GroceryItemCardProps {
  groceries: IGrocery
}


const GroceyItemCard = ({ groceries }: GroceryItemCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div className='h-auto bg-white shadow-xl rounded-lg flex flex-col justify-center transition-all duration-300 border-gray-100 border overflow-hidden cursor-pointer gap-2 min-w-[300px] md:min-w-[200px]'
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
      <div className='p-3'>
        {/* Category */}
        <p className='text-[12px] tracking-wide text-gray-400'>{groceries?.category}</p>

        {/* Name */}
        <h1 className='h-10 w-auto font-semibold text-md'>{groceries?.name}</h1>

        {/* Unit & Price */}
        <div className='flex flex-row justify-between items-center'>
          <span className='w-auto p-1.5 rounded-2xl bg-gray-100 text-center text-[11px] font-normal'>{groceries?.unit}</span>
          <span className='text-green-700 text-lg font-semibold'>
            ${groceries?.price}
          </span>
        </div>

        {/* Button */}
        <motion.button whileTap={{ scale: 0.96 }} className='w-full bg-green-600 text-white rounded-2xl hover:bg-green-400 cursor-pointer flex flex-row justify-center items-center gap-2 py-1.5 mt-3'>
          <ShoppingCart className='w-5 h-5' />
          Add to cart
        </motion.button>
        
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