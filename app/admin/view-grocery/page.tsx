'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { IGrocery } from '@/app/models/grocery.model'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Edit, Search, Trash2 } from 'lucide-react'
import Image from 'next/image'
import FormEditGrocery from '@/app/components/FormEditGrocery'
import ButtonHome from '@/app/components/ButtonHome'

const ViewGrocery = () => {
  const [groceries, setGrocery] = useState<IGrocery[]>([])
  const [loading, setLoading] = useState(false)
  const [isEdit, setEdit] = useState<boolean>(false)
  const [editItem, setEditItem] = useState<IGrocery | null>(null)
  const [search, setSearch] = useState<string>('')
  const [filter, setFilter] = useState<IGrocery[]>([])


  const fetchGrocery = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/auth/admin/get-grocery')
      setGrocery(res?.data)
      setFilter(res?.data)
    } catch (error) {
      console.error({ error })
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGrocery()
  }, [])

  const handleSearchGrocery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = search.toLowerCase()

    setFilter(groceries?.filter((item: IGrocery) => item?.name?.toLowerCase()?.includes(value) || item?.category?.toLowerCase()?.includes(value)))
  }


  return (
    <>
      {loading ? (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: [0, -10, 0], opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className='flex flex-col items-center justify-center min-h-screen'
        >
          <Box className='w-25 h-25 md:w-50 md:h-50 text-green-700 mb-5' />
        </motion.div>
      ) : (
        <>
          <motion.div className='w-[90%] sm:w-[85%] md:w-[80%] mx-auto py-10 relative'>
            {/* Back to home */}
            {/* <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className='w-full h-full flex flex-row justify-between'
            >
              <motion.button onClick={() => router.push('/')} whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.06 }} className='bg-white shadow-2xl w-auto rounded-xl text-green-700 text-center flex flex-row gap-2 p-1.5 hover:bg-green-200 cursor-pointer transition-all duration-200 items-center'>
                <ArrowLeft className='w-5 h-5' />
                <span className='hidden md:flex font-semibold tracking-wide'>Back to home</span>
              </motion.button>

              <motion.h1 className=' text-lg md:text-2xl text-green-700 font-extrabold'>Manage Grocery</motion.h1>
            </motion.div> */}
            <ButtonHome />

            {/* Search */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className='w-full h-full flex flex-row justify-center items-center mt-5'
              onSubmit={handleSearchGrocery}
            >
              <div className='relative w-full max-w-lg'>
                <input
                  type="text"
                  id='search'
                  placeholder='Search for a grocery'
                  className='w-full h-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10'
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <motion.button
                  type='submit'
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.06 }}
                  className='absolute right-0 top-0 bg-green-700 text-white rounded-r-md p-2 hover:bg-green-800 cursor-pointer transition-all duration-200 w-auto h-full'

                >
                  <Search className='w-5 h-5' />
                </motion.button>
              </div>
            </motion.form>


            {filter?.length > 0 ? (
              <div
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-10 w-full'
              >
                {filter?.map((item: IGrocery, index: number) => {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className='w-full h-full flex flex-row justify-between items-center px-4 py-5 rounded-2xl shadow-xl border border-gray-200 bg-white gap-4 hover:shadow-2xl transition-all duration-200 cursor-pointer'
                    >
                      <div className='flex flex-row items-center gap-4 w-full'>
                        <Image src={item?.image[0]} alt='grocery' width={100} height={100} className='w-20 h-[100px] object-cover rounded-xl' />

                        <div className='flex flex-col items-start justify-start gap-2'>
                          <h1 className='text-lg md:text-2xl font-extrabold text-green-700'>{item?.name}</h1>
                          <p className='text-sm md:text-base text-gray-500'>{item?.category}</p>
                          <p className='text-sm md:text-base text-green-700 font-extrabold'>${item?.price} <span className='text-sm md:text-base text-gray-500'>/{item?.unit}</span></p>
                        </div>

                      </div>

                      <div className='flex flex-row items-center gap-2'>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          whileHover={{ scale: 1.06 }}
                          className='bg-green-700 text-white rounded-md p-2 hover:bg-green-800 cursor-pointer transition-all duration-200 w-auto h-auto'
                          onClick={() => {
                            setEdit(true)
                            setEditItem(item)
                          }}
                        >
                          <Edit className='w-5 h-5' />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          whileHover={{ scale: 1.06 }}
                          className='bg-red-500 text-white rounded-md p-2 hover:bg-red-800 cursor-pointer transition-all duration-200 w-auto h-auto'
                        >
                          <Trash2 className='w-5 h-5' />
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                }
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='w-full h-full flex flex-col items-center justify-center'
              >
                <p className='text-lg md:text-2xl font-extrabold text-gray-500'>No groceries items found</p>
              </motion.div>
            )}
          </motion.div>

          {/* Edit Grocery */}
          <AnimatePresence mode='wait' onExitComplete={() => setEdit(false)}>
            {isEdit && (
              <FormEditGrocery isEdit={isEdit} title="Edit Grocery" description="Edit a grocery item in your store." setEdit={setEdit} editItem={editItem} fetchGrocery={fetchGrocery} />
            )}
          </AnimatePresence>
        </>
      )}
    </>
  )
}

export default ViewGrocery