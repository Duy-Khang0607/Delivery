'use client'
import { CircleX, ClosedCaption, LogOut, Package, Search, ShoppingCart, User } from 'lucide-react'
import { IUser } from '../models/user.model'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { useDebouncedCallback } from 'use-debounce'

const Nav = ({ user }: { user: IUser }) => {
  console.log({ user })
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearchMobile, setShowSearchMobile] = useState(false)
  const [search, setSearch] = useState('')
  const profileDropDown = useRef<HTMLButtonElement>(null)
  const searchMobileRef = useRef<HTMLFormElement>(null)

  // Debounce chỉ cho logic tìm kiếm (API call, filter, etc)
  const debouncedSearch = useDebouncedCallback((value: string) => {
    console.log({ search: value })
    // Thêm logic tìm kiếm ở đây (gọi API, filter data, etc)
  }, 500)

  const handleInputChange = (value: string) => {
    setSearch(value) // Cập nhật ngay để hiển thị trên input
    debouncedSearch(value) // Debounce cho logic tìm kiếm
  }

  const handleClearSearch = () => {
    setShowSearchMobile(false)
    setSearch('')
  }

  // Tắt dropdown Profile khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Dropdown Profile
      if (showUserMenu && profileDropDown.current && !profileDropDown.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }

      // Search mobile
      if (showSearchMobile && searchMobileRef.current && !searchMobileRef.current.contains(event.target as Node)) {
        setShowSearchMobile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu, showSearchMobile])

  return (
    <section className='max-w-[90%] mx-auto h-16 shadow-md flex items-center justify-between px-4 text-white mt-4 rounded-md bg-green-500 fixed top-0 left-0 right-0 z-99'>
      {/* Title */}
      <div className='text-white text-xl font-bold max-w-full'>
        <Link href='/' className='hover:text-gray-300 transition-all duration-300'>Delivery</Link>
      </div>

      {/* Search */}
      <form className='hidden md:flex items-center rounded-md w-1/2 bg-white max-w-lg shadow-md'>
        <Search className='w-5 h-5 ml-2 text-black ml-2' />
        <input type="text" id="search" placeholder='Search for a product' className='w-full outline-none text-gray-700 placeholder:text-gray-400 p-3 focus:outline-none  focus:ring-green-500' value={search} onChange={(e) => handleInputChange(e.target.value)} />
      </form>

      {/* Cart && User */}
      <div className='flex flex-row items-center gap-3'>

        {/* Icon search mobile */}
        <div className='relative bg-white rounded-full p-2 cursor-pointer md:hidden' onClick={() => setShowSearchMobile((prev) => !prev)}>
          <Search className='w-5 h-5 text-green-500' />
        </div>

        {/* Cart Icon */}
        <Link href='' className='relative bg-white rounded-full p-2'>
          <ShoppingCart className='w-5 h-5 text-green-500' />
          <span className='absolute -top-1.5 -right-2 text-white font-bold text-sm flex items-center justify-center w-5 h-5 bg-red-500 rounded-full'>1</span>
        </Link>

        {/* User Image */}
        <div className='relative'>
          <Image src={user?.image || ''} alt='User' width={36} height={36} className='w-9 h-9 rounded-full cursor-pointer' onClick={() => setShowUserMenu(!showUserMenu)} />
        </div>

        {/* Dropdown Profile */}
        <AnimatePresence>
          {showUserMenu && (
            <motion.div
              key="user-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className='absolute top-16 right-10 w-48 bg-white rounded-2xl shadow-md p-4'
            >
              {/* Profile */}
              <Link href='/profile' className='flex items-center gap-2.5 p-2 hover:bg-gray-100 rounded-md w-full transition-all duration-300 cursor-pointer hover:bg-green-200'>
                <Image src={user?.image || ''} alt='User' width={32} height={32} className='w-8 h-8 rounded-full cursor-pointer' />
                <div className='flex flex-col gap-1'>
                  <span className='text-black font-bold text-sm'>{user?.name.toUpperCase()}</span>
                  <span className='text-green-400 text-xs w-auto font-bold'>{user?.role?.toUpperCase()}</span>
                </div>
              </Link>
              <button className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md w-full transition-all duration-300 cursor-pointer hover:bg-green-200'>
                <Package className='w-5 h-5 text-green-500' />
                <span className='text-black text-sm'>My Orders</span>
              </button>
              <hr className='border-gray-200' />
              <button ref={profileDropDown} className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md w-full hover:bg-red-200 transition-all duration-300 cursor-pointer mt-1.5' onClick={() => signOut({ callbackUrl: '/login' })}>
                <LogOut className='w-5 h-5 text-red-500' />
                <span className='text-black text-sm'>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search mobile */}
        <AnimatePresence>
          {showSearchMobile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className='fixed top-22 left-0 right-0 z-99 bg-black/50 backdrop-blur-sm p-2.5 w-[80%] mx-auto rounded-2xl text-black'
            >

              <form className='flex items-center gap-2' ref={searchMobileRef}>
                <Search className='w-5 h-5 text-green-500' />
                <input type="text" id="search" placeholder='Search for a product' className='w-full outline-none text-gray-700 placeholder:text-gray-400 focus:outline-none  focus:ring-green-500' value={search} onChange={(e) => handleInputChange(e.target.value)} />
                <button type='button'>
                  <CircleX className='w-5 h-5 text-red-500 cursor-pointer' onClick={handleClearSearch} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Nav