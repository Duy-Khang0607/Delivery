'use client'
import { ArrowLeft, BadgePlus, User, Lock, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

const AddGrocery = () => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [unit, setUnit] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')


  return (
    <section className='bg-linear-to-b from-green-50 to-white w-full min-h-screen py-16 px-4 relative flex flex-col items-center justify-center'>
      {/* <- and Back to home */}
      <Link href='/' className='bg-white shadow-2xl w-auto rounded-xl text-green-700 text-center absolute top-6 left-6 flex flex-row gap-2 p-1.5 hover:bg-green-200 cursor-pointer transition-all duration-200 items-center'>
        <ArrowLeft className='w-5 h-5' />
        <span className='hidden md:flex font-semibold tracking-wide'>Back to home</span>
      </Link>

      {/* Add Grocery */}
      <motion.div
        // onSubmit={ }
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        transition={{ duration: 1, delay: 0.2 }} className='min-w-2xl h-full overflow-hidden rounded-2xl bg-white shadow-2xl px-3 py-5 border-green-200'>

        {/* Tittle */}
        <div className='flex flex-col items-center text-center gap-3 mb-8'>
          <div className='flex flex-row items-center gap-2 tracking-wide text-xl font-semibold'>
            <BadgePlus className='w-5 h-5 text-green-700' />
            Add Grocery
          </div>
          <p className='text-sm max-w-xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis id quasi, aspernatur harum quibusdam pariatur ducimus atque culpa cum veniam? Repellat, cupiditate! Maiores autem corrupti quo animi illo, dolorum laborum.</p>
        </div>

        {/* Form */}
        <motion.form className='flex flex-col gap-3'>
          {/* Grocry name */}
          <div className='relative w-full flex flex-col gap-2'>
            <label className='text-base font-semibold'>Grocery Name <span className='text-red-500'>*</span></label>
            <input required type="email" placeholder='Your email' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300' value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Category - Unit */}
          <div className='relative w-full flex flex-row gap-3 items-center justify-between'>
            {/* Category */}
            <div className='w-full flex flex-col gap-2'>
              <label className='text-base font-semibold'>Category <span className='text-red-500'>*</span></label>
              <input required type="email" placeholder='Your email' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300' value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            {/* Unit */}
            <div className='w-full flex flex-col gap-2'>
              <label className='text-base font-semibold'>Unit <span className='text-red-500'>*</span></label>
              <input required type="email" placeholder='Your email' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300' value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
          </div>

          {/* Price */}
          <div className='relative w-full flex flex-col gap-2'>
            <label className='text-base font-semibold'>Price <span className='text-red-500'>*</span></label>
            <input required type="email" placeholder='Your email' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300' value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          {/* Button upload image */}
          <div className='relative max-w-[25%] flex flex-col gap-3 text-green-700'>
            <Upload className='w-5 h-5 absolute top-3.5 left-2.5' />
            <label
              htmlFor="file-upload"
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300 cursor-pointer"
            >
              Upload image
            </label>
            <input
              type="file"
              id="file-upload"
              value={image}
              className="hidden"
            // onChange={handleFileChange}
            />
          </div>

          {/* Button Add grocery */}
          <button type="button" className='bg-green-500 rounded-md mt-5 hover:bg-green-400 cursor-pointer transition-all text-center p-2 text-white'>Add Grocery</button>

        </motion.form>
      </motion.div>
    </section>
  )
}

export default AddGrocery