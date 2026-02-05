'use client'
import { CircleX, ListOrdered, LogOut, Menu, Package, Plus, Search, ShoppingCart, User, View, X } from 'lucide-react'
import { IUser } from '../models/user.model'
import Link from 'next/link'
import Image from 'next/image'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { useDebouncedCallback } from 'use-debounce'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useRouter } from 'next/navigation'
import { IOrder } from '../models/orders.model'
import axios from 'axios'

const Nav = ({ user }: { user: IUser }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearchMobile, setShowSearchMobile] = useState(false)
  const [search, setSearch] = useState('')
  const profileDropDown = useRef<HTMLButtonElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const iconSearchRef = useRef<HTMLDivElement>(null)
  const searchMobileRef = useRef<HTMLFormElement>(null)
  const [sideBar, setSideBar] = useState(false)
  const router = useRouter()
  const [orders, setOrders] = useState<IOrder[] | undefined>([])
  const { cartData } = useSelector((state: RootState) => state.cart)


  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    try {
      const q = search?.trim();

      if (!q) {
        return router.push(`/`)
      }

      router.push(`/?q=${encodeURIComponent(q)}`)

      setShowSearchMobile(false)
    } catch (error) {
      return error
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/auth/user/my-orders');
      setOrders(res?.data)
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Tắt dropdown Profile khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Dropdown Profile
      const isInsideDropdown = profileDropDown.current?.contains(target)
      const isInsideAvatar = avatarRef.current?.contains(target)

      if (showUserMenu && !isInsideDropdown && !isInsideAvatar) {
        setShowUserMenu(false)
      }

      // Search mobile
      const isInsideSearch = searchMobileRef.current?.contains(target)
      const isInsideIconSearch = iconSearchRef.current?.contains(target)
      if (showSearchMobile && !isInsideSearch && !isInsideIconSearch) {
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
      {user?.role === 'user' && <>
        <form className='hidden md:flex items-center rounded-md w-1/2 md:w-1/3 bg-white max-w-lg shadow-md' onSubmit={handleSearch}>
          <Search className='w-5 h-5 ml-2 text-black' />
          <input type="text" id="search" placeholder='Search for a product' className='w-full outline-none text-gray-700 placeholder:text-gray-400 p-3 focus:outline-none  focus:ring-green-500' value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
      </>}

      {/* Cart && User */}
      <div className='flex flex-row items-center gap-3'>

        {/* Icon search mobile */}
        {user?.role === 'user' && <>
          <div ref={iconSearchRef} className='relative bg-white rounded-full p-2 cursor-pointer md:hidden' onClick={() => setShowSearchMobile((prev) => !prev)}>
            <Search className='w-5 h-5 text-green-500' />
          </div>
        </>}

        {/* Cart Icon */}
        {user?.role === 'user' && <>
          <Link href='/user/cart' className='relative bg-white rounded-full p-2'>
            <ShoppingCart className='w-5 h-5 text-green-500' />
            <span className='absolute -top-1.5 -right-2 text-white font-bold text-sm flex items-center justify-center w-5 h-5 bg-red-500 rounded-full'>{cartData?.length}</span>
          </Link>
        </>}

        {/* Icon menu admin mobile  */}
        {user?.role === 'admin' && (
          <div className='relative bg-white rounded-full p-2 md:hidden' onClick={() => setSideBar(prev => !prev)}>
            <Menu className='w-5 h-5 text-green-500' />
          </div>
        )}


        {/* Menu admin  */}
        {user?.role === 'admin' && (
          <div className='hidden md:flex flex-row gap-4 items-center w-full'>
            {/* Add Category */}
            <Link href='admin/add-grocery' className='flex items-center gap-1.5 bg-white text-green-700 font-semibold p-2 rounded-full hover:bg-green-100 transition-all duration-300 min-w-[100px] text-sm'>
              <Plus className='w-5 h-5 text-green-500' />
              Add category
            </Link>
            {/* View Category */}
            <Link href='admin/view-grocery' className='flex items-center gap-1.5 bg-white text-green-700 font-semibold p-2 rounded-full hover:bg-green-100 transition-all duration-300 min-w-[100px] text-sm'>
              <View className='w-5 h-5 text-green-500' />
              View category
            </Link>
            {/* Manager Orders */}
            <Link href='admin/manage-orders' className='flex items-center gap-1.5 bg-white text-green-700 font-semibold p-2 rounded-full hover:bg-green-100 transition-all duration-300 min-w-[100px] text-sm'>
              <ListOrdered className='w-5 h-5 text-green-500' />
              Manager orders
            </Link>
          </div>
        )}

        {/* User Image */}
        <div ref={avatarRef} className='relative min-w-[30px]' onClick={() => setShowUserMenu(prev => !prev)}>
          <Image src={user?.image || ''} alt='User' width={32} height={32} className='w-8 h-8 rounded-full cursor-pointer'
          />
        </div>

        {/* Dropdown Profile */}
        <AnimatePresence mode="wait">
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
              <Link href='/profile' className='flex items-center gap-2.5 p-2 rounded-md w-full transition-all duration-300 cursor-pointer hover:bg-green-200'>
                <Image src={user?.image || ''} alt='User' width={32} height={32} className='w-8 h-8 rounded-full cursor-pointer' />
                <div className='flex flex-col gap-1'>
                  <span className='text-black font-bold text-xs'>{user?.name.toUpperCase()}</span>
                  <span className='text-green-400 text-xs w-auto font-semibold tracking-wide'>{user?.role?.toUpperCase()}</span>
                </div>
              </Link>
              {user?.role === 'user' && <>
                <button onClick={() => router.push('/user/my-orders')} className='flex items-center gap-2 p-2 rounded-md w-full transition-all duration-300 cursor-pointer hover:bg-green-200'>
                  <Package className='w-5 h-5 text-green-500' />
                  <span className='text-black text-sm md:text-md relative'>My Orders <span className='absolute top-0 -right-8 text-white font-bold text-xs flex items-center justify-center w-6 h-6 bg-red-500 rounded-full'>{orders?.length && orders?.length > 0 ? orders?.length : 0}</span></span>
                </button>
              </>}
              <hr className='border-gray-200' />
              <button ref={profileDropDown} className='flex items-center gap-2 p-2 rounded-md w-full hover:bg-red-200 transition-all duration-300 cursor-pointer mt-1.5' onClick={() => signOut({ callbackUrl: '/login' })}>
                <LogOut className='w-5 h-5 text-red-500' />
                <span className='text-black text-xs md:text-sm'>Logout</span>
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

              <form className='flex items-center gap-2' ref={searchMobileRef} onSubmit={handleSearch}>
                <Search className='w-5 h-5 text-green-500' />
                <input type="text" id="search" placeholder='Search for a product' className='w-full outline-none text-white placeholder:text-gray-400 focus:outline-none  focus:ring-green-500' value={search} onChange={(e) => setSearch(e.target.value)} />
                <button type='button'>
                  <CircleX className='w-5 h-5 text-red-500 cursor-pointer' onClick={() => {
                    setSearch('')
                    setShowSearchMobile(false)
                  }} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar admin */}
      <AnimatePresence mode='wait'>
        {sideBar && <>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 14 }}
            className='fixed top-0 left-0 text-white h-full w-[50%] mx-auto shadow-xl shadow-black px-4 py-2 z-9999 bg-linear-to-b from-green-800/90 via-green-700/80 to-green-900-90 backdrop-blur-sm flex flex-col'
          >
            {/* Admin Panal */}
            <div className='flex flex-row justify-between items-center'>
              <h1 className='font-extrabold'>Admin Panel</h1>
              <X className='w-5 h-5 text-red-500 cursor-pointer hover:text-red-200 transition-all' onClick={() => setSideBar(false)} />
            </div>

            {/* Profile */}
            <div className='flex flex-row bg-black/10 rounded-lg hover:bg-white/20 items-center gap-2 p-2 mt-5 shadow-md shadow-white/50 border-white border-1 '>
              <Image src={user?.image || ''} alt='User' width={32} height={32} className='w-8 h-8 rounded-full cursor-pointer' />
              <div className='flex flex-col gap-1'>
                <span className='text-white font-bold text-sm'>{user?.name.toUpperCase()}</span>
                <span className='text-green-400 text-xs w-auto font-bold tracking-wide'>{user?.role?.toUpperCase()}</span>
              </div>
            </div>

            {/* Items */}
            <div className='flex flex-col gap-3 mt-4'>
              {/* Add */}
              <Link href='admin/add-grocery' className='flex flex-row bg-black/10 rounded-lg hover:bg-white/20 items-center p-2 text-sm gap-2'>
                <Plus className='text-white w-5 h-5' />
                Add category
              </Link>

              {/* View */}
              <Link href='admin/view-grocery' className='flex flex-row bg-black/10 rounded-lg hover:bg-white/20 items-center p-2 text-sm gap-2'>
                <View className='text-white w-5 h-5' />
                View category
              </Link>

              {/* Manager */}
              <Link href='admin/manage-orders' className='flex flex-row bg-black/10 rounded-lg hover:bg-white/20 items-center p-2 text-sm gap-2'>
                <ListOrdered className='text-white w-5 h-5' />
                Manager Orders
              </Link>

              {/* Border */}
              <div className='my-2 border-t border-white/50'></div>

            </div>

            {/* Logout */}
            <div onClick={() => signOut({ callbackUrl: '/login' })} className="flex bg-red-200/50 px-2 py-1 mt-auto text-red-400 font-semibold hover:bg-red-500/20 rounded-lg transition-all">
              Logout
            </div>
          </motion.div>
        </>}
      </AnimatePresence>
    </section >
  )
}

export default Nav