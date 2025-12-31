'use client'
import { motion } from 'framer-motion'
import { ArrowLeft, Calculator, LocationEdit, MapPinHouse, Phone, Search, Send, StickyNote, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { useState, useEffect } from 'react'
import axios from 'axios'

// Dynamic import để tránh lỗi SSR với leaflet
const VietnamMap = dynamic(() => import('@/app/components/VietnamMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-gray-500">Đang tải bản đồ...</div>
        </div>
    ),
})

const Checkout = () => {
    const router = useRouter()

    const { userData } = useSelector((state: RootState) => state.user)

    const [position, setPosition] = useState<[number, number] | null>(null)

    const [info, setInfo] = useState({
        name: "",
        mobile: "",
        city: "",
        state: "",
        pinCode: "",
        fullAddress: ""
    })

    const handleLocationSelect = (lat: number, lng: number, address?: string) => {
        console.log({ lat, lng, address })
        // setPosition([lat,lng])
        setInfo(prev => ({
            ...prev,
            fullAddress: address || ""
        }))
    }


    // Cập nhật info khi userData được load
    useEffect(() => {
        if (userData) {
            setInfo(prev => ({
                ...prev,
                name: userData?.name ?? prev.name,
                mobile: userData?.mobile ? String(userData.mobile) : prev.mobile,
            }))
        }
    }, [userData])

    // Lấy vị trí hiện tại
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos?.coords
                    setPosition([latitude, longitude])
                },
                (error) => {
                    console.error('Error getting location:', error)
                }
            )
        }
    }, [])

    console.log({ position })

    // Gọi API khi position có giá trị
    useEffect(() => {
        const fetchAddress = async () => {
            if (!position) return

            try {
                // Nominatim yêu cầu User-Agent header để tránh bị block
                const res = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}&zoom=18&addressdetails=1`,
                    {
                        headers: {
                            'User-Agent': 'DeliveryApp/1.0', // Bắt buộc phải có User-Agent
                        },
                    }
                )
                setInfo(prev => ({
                    ...prev,
                    city: res?.data?.address?.city,
                    state: res?.data?.address?.suburb,
                    pinCode: res?.data?.address?.postcode,
                    fullAddress: res?.data?.display_name
                }))
            } catch (error: any) {
                console.log({ error: error?.response?.data || error?.message || error })
            }
        }
        fetchAddress()
    }, [position])


    return (
        // <section className='w-[90%] sm:w-[85%] md:w-[80%] mx-auto min-h-screen mt-8 mb-24 relative'>
        <section className='w-[90%] sm:w-[85%] md:w-[80%] mx-auto py-10 relative'>
            {/* Back to cart */}
            <motion.button
                onClick={() => router.push('/user/cart')}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.06 }}
                className='absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold cursor-pointer bg-white shadow-lg p-2 rounded-xl'>
                <ArrowLeft className='w-5 h-5' />
                <span className='hidden md:flex font-semibold tracking-wide'>Back to home</span>
            </motion.button>

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                // className='absolute top-12 left-1/2 -translate-1/2 gap-2 flex flex-row w-full justify-center'
                className='text-3xl md:text-4xl font-bold text-green-700 text-center mb-10'
            >
                Checkout
            </motion.h1>

            {/* Delivery, Address && Payment method */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 w-full'>
                {/* Delivery */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='w-full p-3 bg-white shadow-2xl rounded-2xl flex flex-col h-fit gap-3'
                >
                    {/* Title */}
                    <div className='flex flex-row items-center gap-3'>
                        <MapPinHouse className='text-green-700' />
                        <h2 className='text-lg font-semibold'>Delivery Address</h2>
                    </div>

                    {/* User */}
                    <div className='relative w-full flex flex-col gap-3'>
                        <User className='w-5 h-5 absolute top-3.5 left-2.5 text-green-700' />
                        <input
                            value={info?.name || ""}
                            onChange={(e) => setInfo({ ...info, name: e?.target?.value })} type="text" placeholder='Your user'
                            className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300' />
                    </div>

                    {/* SDT*/}
                    <div className='relative w-full flex flex-col gap-3'>
                        <Phone className='w-5 h-5 absolute top-3.5 left-2.5 text-green-700' />
                        <input
                            value={info?.mobile || ""}
                            onChange={(e) => setInfo({ ...info, mobile: e?.target?.value })}
                            type="number"
                            placeholder='Your phone'
                            className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300'
                        />
                    </div>

                    {/* Address*/}
                    <div className='relative w-full flex flex-col gap-3'>
                        <LocationEdit className='w-5 h-5 absolute top-3.5 left-2.5 text-green-700' />
                        <input
                            value={info?.fullAddress || ""}
                            onChange={(e) => setInfo({ ...info, fullAddress: e?.target?.value })}
                            type="text"
                            placeholder='Your address'
                            className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300'
                        />
                    </div>

                    {/* Detail address && Post code */}
                    <div className='w-full flex flex-row items-center gap-2'>
                        <div className='relative w-full flex flex-col gap-3'>
                            <Calculator className='w-5 h-5 absolute top-3.5 left-2.5 text-green-700' />
                            <input
                                value={info?.city || ""}
                                onChange={(e) => setInfo({ ...info, city: e?.target?.value })}
                                type="text"
                                placeholder='Your district'
                                className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300'
                            />
                        </div>
                        <div className='relative w-full flex flex-col gap-3'>
                            <StickyNote className='w-5 h-5 absolute top-3.5 left-2.5 text-green-700' />
                            <input
                                value={info?.state || ""}
                                onChange={(e) => setInfo({ ...info, state: e?.target?.value })}
                                type="text"
                                placeholder='Your ward'
                                className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300'
                            />
                        </div>
                        <div className='relative w-full flex flex-col gap-3'>
                            <Send className='w-5 h-5 absolute top-3.5 left-2.5 text-green-700' />
                            <input
                                value={info?.pinCode || ""}
                                onChange={(e) => setInfo({ ...info, pinCode: e?.target?.value })}
                                type="number"
                                placeholder='Your postcode'
                                className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300'
                            />
                        </div>
                    </div>

                    {/* Search && Button search */}
                    <div className='w-full flex flex-row items-center gap-2'>
                        <form className='hidden md:flex items-center rounded-md bg-white max-w-lg shadow-md border border-gray-300 w-full'>
                            <Search className='w-5 h-5 ml-2 text-black' />
                            <input type="text" id="search" placeholder='Search for a your address' className='w-full outline-none text-gray-700 placeholder:text-gray-400 p-3 focus:outline-none  focus:ring-green-500' />
                        </form>
                        <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 0.95 }}
                            className='bg-green-700 p-2 rounded-md text-white text-center w-full transition-all duration-300 cursor-pointer hover:bg-green-600 flex-1 shadow-md shadow-green-700'
                        >
                            Search
                        </motion.button>
                    </div>

                    {/* Map */}
                    <div className="w-full mt-3">
                        {position && (
                            <VietnamMap
                                onLocationSelect={handleLocationSelect}
                                height="400px"
                                showSearch={true}
                                showCurrentLocation={true}
                                position={position}
                            />
                        )}

                    </div>
                </motion.div>

                {/* Payment */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='w-full p-3 bg-white shadow-2xl rounded-2xl flex flex-col justify-between items-center h-fit gap-3'
                >
                    <h2>Payment method</h2>
                </motion.div>

            </div>


        </section>
    )
}

export default Checkout