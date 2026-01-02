'use client'
import { motion } from 'framer-motion'
import { ArrowLeft, Calculator, CreditCard, DollarSign, Loader2, LocateFixed, LocationEdit, Lock, MapPin, MapPinHouse, Phone, Search, Send, StickyNote, Truck, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

// Dynamic import để tránh lỗi SSR với leaflet
const MapViewComponent = dynamic(() => import('@/app/components/MapView'), {
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

    const [searchMap, setSearchMap] = useState<string>("")

    const [isSearchLoading, setSearchLoading] = useState(false)

    const [info, setInfo] = useState({
        name: "",
        mobile: "",
        city: "",
        state: "",
        pinCode: "",
        fullAddress: ""
    })

    const [paymentMethod, setPaymentMethod] = useState<string>('')

    const { cartData, subTotal, deliveryFee, finalTotal } = useSelector((state: RootState) => state.cart)

    // Tìm kiếm địa chỉ trên map
    const handleSearchMap = async (e: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        try {
            const { OpenStreetMapProvider } = await import("leaflet-geosearch")

            const provider = new OpenStreetMapProvider({
                params: {
                    countrycodes: 'vn', // Limit search to Vietnam
                    addressdetails: 1,
                },
            })
            const results = await provider.search({ query: searchMap })
            if (results?.length > 0) {
                setPosition([results[0]?.y, results[0]?.x] as [number, number])
            }

            console.log({ results })

        } catch (error) {
            console.log({ error })
        }
    }

    // Lấy vị trí hiện tại
    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos?.coords
                    setPosition([latitude, longitude])
                },
                (error) => {
                    console.error("Error getting location:", {
                        code: error.code,
                        message: error.message,
                    });
                }, {
                // enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000,
            }
            )
        }
    }

    // Paymend Cod 
    const handleCod = async () => {
        if (!position) return

        try {
            const res = await axios.post('/api/auth/user/order', {
                userId: userData?._id,
                items: cartData?.map((item) => ({
                    grocery: item?._id,
                    name: item?.name,
                    price: item?.price,
                    unit: item?.unit,
                    image: item?.image,
                    quantity: item?.quantity,
                })),
                paymentMethod,
                totalAmount: finalTotal,
                address: {
                    fullName: info?.name,
                    mobile: info?.mobile,
                    city: info?.city,
                    state: info?.state,
                    pincode: info?.pinCode,
                    fullAddress: info?.fullAddress,
                    latitude: position[0],
                    longitude: position[1]
                }
            });
            if(res?.data?.success) router.push('/user/order-success')
            console.log({ res })

        } catch (error) {
            console.error({ error })
        }
    }

    // Payment Online
    const handleOnline = () => {

    }

    // Gọi API khi position có giá trị hoặc thay đổi giá trị
    useEffect(() => {
        const fetchAddress = async () => {
            if (!position) return

            setSearchLoading(true)
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
                console.log({ res: res?.data?.address })
                setInfo(prev => ({
                    ...prev,
                    city: res?.data?.address?.city,
                    state: res?.data?.address?.suburb,
                    pinCode: res?.data?.address?.postcode,
                    fullAddress: res?.data?.display_name
                }))
                setSearchLoading(false)
            } catch (error: any) {
                console.log({ error })
                console.log({ error: error?.response?.data || error?.message || error })
                setSearchLoading(false)
            } finally {
                setSearchLoading(false)
            }
        }
        fetchAddress()
    }, [position])

    // Cập nhật info user làn đầu và khi userData thay đổi
    useEffect(() => {
        if (userData) {
            setInfo(prev => ({
                ...prev,
                name: userData?.name ?? prev.name,
                mobile: userData?.mobile ? String(userData.mobile) : prev.mobile,
            }))
        }
    }, [userData])

    // Lấy vị trí hiện tại lần đầu load trang
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos?.coords
                    setPosition([latitude, longitude])
                },
                (error) => {
                    console.error("Error getting location:", {
                        code: error.code,
                        message: error.message,
                    });
                }, {
                // enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000,
            }
            )
        }
    }, [])

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
                {/* Delivery address */}
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
                            disabled={userData?.name ? true : false}
                            value={info?.name || ""}
                            onChange={(e) => setInfo({ ...info, name: e?.target?.value })} type="text" placeholder='Your user'
                            className={`w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300 ${userData?.name ? 'bg-gray-200 cursor-not-allowed' : ''}`} />
                    </div>

                    {/* SDT*/}
                    <div className='relative w-full flex flex-col gap-3'>
                        <Phone className='w-5 h-5 absolute top-3.5 left-2.5 text-green-700' />
                        <input
                            value={info?.mobile || ""}
                            disabled={userData?.mobile ? true : false}
                            onChange={(e) => setInfo({ ...info, mobile: e?.target?.value })}
                            type="number"
                            placeholder='Your phone'
                            className={`w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300 ${userData?.name ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Address*/}
                    <div className='relative w-full flex flex-col gap-3'>
                        <LocationEdit className='w-5 h-5 absolute top-3.5 left-2.5 text-green-700' />
                        <input
                            value={isSearchLoading ? "" : info?.fullAddress || ""}
                            onChange={(e) => setInfo({ ...info, fullAddress: e?.target?.value })}
                            type="text"
                            placeholder={isSearchLoading ? "" : "Your address"}
                            className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300'
                        />
                        {isSearchLoading && (
                            <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-green-700" />
                        )}
                    </div>

                    {/* Detail address && Post code */}
                    <div className='w-full flex flex-row items-center gap-2'>
                        <div className='relative w-full flex flex-col gap-3'>
                            <Calculator className='w-5 h-5 absolute top-3.5 left-2.5 text-green-700' />
                            <input
                                value={isSearchLoading ? "" : info?.city || ""}
                                onChange={(e) => setInfo({ ...info, city: e?.target?.value })}
                                type="text"
                                placeholder={isSearchLoading ? "" : "Your district"}
                                className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300'
                            />
                            {isSearchLoading && (
                                <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-green-700" />
                            )}
                        </div>
                        <div className='relative w-full flex flex-col gap-3'>
                            <StickyNote className='w-5 h-5 absolute top-3.5 left-2.5 text-green-700' />
                            <input
                                value={isSearchLoading ? "" : info?.state || ""}
                                onChange={(e) => setInfo({ ...info, state: e?.target?.value })}
                                type="text"
                                placeholder={isSearchLoading ? "" : "Your ward"}
                                className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300'
                            />
                            {isSearchLoading && (
                                <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-green-700" />
                            )}
                        </div>
                        <div className='relative w-full flex flex-col gap-3'>
                            <Send className='w-5 h-5 absolute top-3.5 left-2.5 text-green-700' />
                            <input
                                value={isSearchLoading ? "" : info?.pinCode || ""}
                                onChange={(e) => setInfo({ ...info, pinCode: e?.target?.value })}
                                type="number"
                                placeholder={isSearchLoading ? "" : "Your postcode"}
                                className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300'
                            />
                            {isSearchLoading && (
                                <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-green-700" />
                            )}
                        </div>
                    </div>

                    {/* Search && Button search */}
                    <form onSubmit={handleSearchMap} className='flex flex-row items-center rounded-md bg-white shadow-md border border-gray-300 relative w-full'>
                        <div className='flex flex-row items-center gap-2 w-full h-full'>
                            <div className='flex flex-row items-center gap-2 w-full h-auto'>
                                <Search className='w-5 h-5 ml-2 text-black' />
                                <input value={searchMap} onChange={(e) => setSearchMap(e?.target?.value)} type="text" id="search" placeholder='Search for a your address' className='w-full outline-none text-gray-700 placeholder:text-gray-400 p-3 focus:outline-none focus:ring-green-500 pr-20' />
                            </div>
                            <div className='absolute top-0 right-0 h-full'>
                                <motion.button disabled={searchMap?.length === 0} type='submit'
                                    className={`p-2 rounded-r-md text-white text-center w-full transition-all duration-300 cursor-pointer h-full hover:scale-105 ${searchMap.length > 0 ? 'bg-green-700 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-400'}`}
                                >
                                    {isSearchLoading ? <Loader2 className='w-10 h-5 animate-spin' /> : 'Search'}
                                </motion.button>
                            </div>
                        </div>
                    </form>

                    {/* Map */}
                    <div className="w-full mt-3 h-[400px] relative border border-gray-300 rounded-md shadow-xl">
                        {position && (
                            <MapViewComponent position={position} setPosition={setPosition} setSearchMap={setSearchMap} />
                        )}

                        {/* Current location */}
                        <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 0.95 }}
                            onClick={handleCurrentLocation}
                            className='absolute bottom-3 right-3 bg-green-700 p-2 rounded-full text-white text-center w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-green-600 shadow-md shadow-green-700 z-10'
                        >
                            <LocateFixed className='w-5 h-5' />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Payment */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='w-full p-3 bg-white shadow-2xl rounded-2xl flex flex-col justify-between items-center h-fit gap-3'
                >
                    {/* Title */}
                    <div className='flex flex-row items-center gap-3'>
                        <DollarSign className='text-green-700' />
                        <h2 className='text-lg font-semibold'>Payment method</h2>
                    </div>

                    {/* Payment method */}
                    <div className='flex flex-col gap-3 justify-between w-full'>
                        {/* Online */}
                        <div onClick={() => setPaymentMethod('online')} className={`w-full border border-gray-300 rounded-md p-2 flex flex-row items-center gap-2 hover:bg-green-200 transition-all duration-200 hover:border-green-600 cursor-pointer ${paymentMethod === 'online' ? 'bg-green-200' : 'bg-white'}`}>
                            <CreditCard className='w-5 h-5 text-green-700' />
                            <span className='text-base text-black'>Pay Online (stripe)</span>
                        </div>

                        {/* Delivery */}
                        <div onClick={() => setPaymentMethod('cod')} className={`w-full border border-gray-300 rounded-md p-2 flex flex-row items-center gap-2 hover:bg-green-200 transition-all duration-200 hover:border-green-600 cursor-pointer ${paymentMethod === 'cod' ? 'bg-green-200' : 'bg-white'}`}>
                            <Truck className='w-5 h-5 text-green-700' />
                            <span className='text-base text-black'>Cash on Delivery</span>
                        </div>

                        {/* Border top */}
                        <div className='w-full h-1 bg-gray-400 rounded'></div>

                        <div className='flex flex-row items-center justify-between'>
                            <p className='text-gray-400 text-sm font-semibold'>Subtotal</p>
                            <p className='text-green-700 font-semibold text-base'>${subTotal}</p>
                        </div>

                        {/* Delivery Fee */}
                        <div className='flex flex-row items-center justify-between'>
                            <p className='text-gray-400 text-sm font-semibold'>Delivery Fee</p>
                            <p className='text-green-700 font-semibold text-base'>${deliveryFee}</p>
                        </div>

                        {/* Border bottom */}
                        <div className='w-full h-1 bg-gray-400 rounded'></div>

                        {/* Final Total */}
                        <div className='flex flex-row items-center justify-between mt-4'>
                            <p className='text-black text-xl font-bold'>Final Total</p>
                            <p className='text-green-700 font-extrabold text-md'>${finalTotal}</p>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.93 }}
                            className={`w-full p-2 text-center ${paymentMethod !== '' ? 'bg-green-600 hover:bg-green-500 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-2xl mt-4  transition-all duration-300 font-medium`}
                            onClick={() => {
                                if (paymentMethod == 'cod') {
                                    handleCod()
                                } else {
                                    handleOnline()
                                }
                            }}
                        >
                            {paymentMethod === 'cod' ? 'Place order' : paymentMethod === 'online' ? 'Pay & Place order' : 'Please payment option !'}
                        </motion.button>

                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Checkout