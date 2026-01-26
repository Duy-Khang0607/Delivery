'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Box, CardSim, Loader2, LocationEdit, Phone, Timer, User } from 'lucide-react';
import { getSocket } from '../lib/socket';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import LiveMap from './LiveMap';
import DeliveryChat from './DeliveryChat';

interface IDeliveryLocation {
    latitude: number;
    longitude: number;
}

const DeliveryBoyDashboard = () => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<any>(null);
    const [userlocation, setUserlocation] = useState<IDeliveryLocation>({
        latitude: 0,
        longitude: 0,
    });
    const [deliverylocation, setDeliverylocation] = useState<IDeliveryLocation>({
        latitude: 0,
        longitude: 0,
    });
    const { userData } = useSelector((state: RootState) => state.user);
    // Mark as delivered
    const [showOTP, setShowOTP] = useState(false);
    const [loadingMarkAsDelivered, setLoadingMarkAsDelivered] = useState(false);

    // Send OTP
    const [otp, setOtp] = useState('');
    const [loadingOTP, setLoadingOTP] = useState(false);
    const [loadingResendOTP, setLoadingResendOTP] = useState(false);

    const getAssignments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/delivery/get-assignments');
            setAssignments(response?.data?.assignments);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleAccept = async (assignmentId: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/delivery/assignment/${assignmentId}/accept-assignment`);
            console.log({ data: response?.data })
        } catch (error) {
            console.error('Error accepting assignment:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleReject = async (orderId: string) => {

    }

    const fetchCurrentOrder = async () => {
        try {
            const response = await axios.get('/api/delivery/current-order');
            setCurrentOrder(response?.data?.assignment);
            setUserlocation({
                latitude: response?.data?.assignment?.order?.address?.latitude,
                longitude: response?.data?.assignment?.order?.address?.longitude,
            })
        } catch (error) {
            console.error('Error fetching current order:', error);
        }
    }

    const sendOTP = async (orderId: string) => {
        setLoadingMarkAsDelivered(true);
        try {
            const response = await axios.post(`/api/delivery/otp/send`, { orderId });
            setShowOTP(true);
            console.log({ data: response?.data })
        } catch (error) {
            console.error('Error sending OTP:', error);
            setShowOTP(false);
            setLoadingMarkAsDelivered(false);
        } finally {
            setLoadingMarkAsDelivered(false);

        }
    }

    const verifyOTP = async (orderId: string, otp: string) => {
        setLoadingOTP(true);
        try {
            const response = await axios.post(`/api/delivery/otp/verify`, { orderId, otp });
            console.log({ data: response?.data })
            setOtp('');
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setLoadingOTP(false);
        }
        finally {
            setLoadingOTP(false);
        }
    }

    useEffect(() => {
        if (!userData?._id) return
        if (!navigator?.geolocation) return

        const watcher = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos?.coords
                setDeliverylocation({
                    latitude,
                    longitude
                })
            },
            (error) => {
                // Xử lý các loại lỗi Geolocation
                const errorMessages: { [key: number]: string } = {
                    1: 'Người dùng từ chối cấp quyền vị trí. Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt.',
                    2: 'Không thể xác định vị trí. Vui lòng kiểm tra GPS/Location services.',
                    3: 'Hết thời gian chờ lấy vị trí. Vui lòng thử lại.'
                };
                console.warn("⚠️ Geolocation error:", errorMessages[error.code] || error.message);
            }, {
            enableHighAccuracy: false,  // Đổi thành false để nhanh hơn và ít lỗi hơn
            maximumAge: 30000,          // Cache vị trí trong 30 giây
            timeout: 15000,             // Tăng timeout lên 15 giây
        }
        )

        return () => navigator.geolocation.clearWatch(watcher)

    }, [userData?._id])

    useEffect(() => {
        getAssignments();
        fetchCurrentOrder();
    }, [userData]);

    useEffect(() => {
        const socket = getSocket()
        socket?.on('new-assignment', (newAssignment) => {
            setAssignments((prev) => [...prev, newAssignment])
        })
        return () => {
            socket.off('new-assignment')
        }
    }, [])

    // Cập nhật vị trí delivery boy
    useEffect(() => {
        const socket = getSocket()
        socket?.on('update-deliveryBoy-location', (data) => {
            setDeliverylocation({
                latitude: data?.location?.coordinates?.[1],
                longitude: data?.location?.coordinates?.[0],
            })
        })

        return () => {
            socket.off('update-deliveryBoy-location')
        }
    }, [])

    if (currentOrder && userlocation) {
        return (
            <div className='w-[90%] md:w-[80%] mt-24 mx-auto space-y-4'>
                {/* Map */}
                <div className='flex flex-col gap-4 border border-gray-300 rounded-md p-4 shadow-md overflow-hidden w-full h-full'>
                    <h1 className='text-green-700 font-extrabold text-2xl md:text-3xl tracking-wide'>Active order</h1>
                    <div className='flex flex-col gap-2'>
                        <p className='mb-4'>Order: #{currentOrder?.order?._id?.slice(-6)}</p>
                        <LiveMap userLocation={userlocation} deliveryLocation={deliverylocation} />
                    </div>
                </div>
                {/* Delivery */}
                <DeliveryChat orderId={currentOrder?.order?._id!} deliveryBoyId={userData?._id!} role="delivery_boy" />

                {/* OTP */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='flex flex-col gap-4 border border-gray-300 rounded-md p-4 shadow-md overflow-hidden w-full h-full'
                >
                    {!currentOrder?.order?.deliveryOTPVerification && !showOTP && (
                        <>
                            {/* Mark as delivered */}
                            <motion.button
                                onClick={() => sendOTP(currentOrder?.order?._id!)}
                                className='bg-green-500 text-white px-4 py-2 rounded-md w-full text-center cursor-pointer hover:bg-green-600 transition-all duration-300 flex items-center justify-center'
                            >
                                {loadingMarkAsDelivered ? <Loader2 className='w-5 h-5 text-white animate-spin' /> : 'Mark as Delivered'}
                            </motion.button>
                        </>
                    )}

                    {showOTP && (
                        <>
                            {/* Input OTP */}
                            <div className='flex flex-col gap-2'>
                                <input type="text" placeholder='Enter OTP' className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300' value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
                                <motion.button
                                    onClick={() => verifyOTP(currentOrder?.order?._id!, otp)}
                                    className={`${otp.length !== 6 ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 cursor-pointer hover:bg-green-600'} text-white px-4 py-2 rounded-md w-full hover:bg-green-600 transition-all duration-300 flex items-center justify-center`}
                                    disabled={otp.length !== 6}
                                >
                                    {loadingOTP ? <Loader2 className='w-5 h-5 text-white animate-spin' /> : 'Verify OTP'}
                                </motion.button>
                                <motion.button
                                    onClick={() => sendOTP(currentOrder?.order?._id!)}
                                    className={`${loadingResendOTP ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 cursor-pointer hover:bg-red-600'} text-white px-4 py-2 rounded-md w-full hover:bg-red-600 transition-all duration-300 flex items-center justify-center`}
                                >
                                    {loadingResendOTP ? <Loader2 className='w-5 h-5 text-white animate-spin' /> : 'Resend OTP'}
                                </motion.button>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        )
    }


    return (
        <div className='w-[90%] md:w-[80%] mt-24 mx-auto'>
            <h1 className='text-green-700 font-extrabold text-2xl md:text-3xl tracking-wide text-center mb-4'>Delivery Boy Dashboard</h1>
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
                <AnimatePresence >
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {assignments?.length > 0 && assignments?.map((orders) => {
                            const { _id, paymentMethod, createdAt, address, assignment } = orders?.order
                            const { fullName, mobile } = orders?.order?.address

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    key={_id} className='w-full rounded-md shadow-md border border-gray-300 p-4 space-y-3 hover:shadow-lg transition-all duration-300 overflow-hidden h-full'>
                                    <div className='flex flex-col md:flex-row justify-between md:items-center gap-2 h-auto md:h-[30px] w-full'>
                                        <div className='flex items-center gap-2'>
                                            <User className='w-5 h-5 text-green-700' />
                                            <span className='text-sm md:text-[17px] w-full font-semibold'>{fullName}</span>
                                        </div>
                                        <div className='hidden xl:block text-right'>
                                            <p className='text-xs md:text-sm text-gray-500'>{new Date(createdAt!).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2 h-auto md:h-[20px]'>
                                        <Phone className='w-5 h-5 text-green-700' />
                                        <span className='text-sm md:text-[16px] w-full'>{mobile}</span>
                                    </div>

                                    <div className='flex items-center gap-2 h-auto md:h-[20px]'>
                                        <CardSim className='w-5 h-5 text-green-700' />
                                        <span className='text-sm md:text-[16px]] w-full'>{paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</span>
                                    </div>

                                    <div className='flex items-center gap-2 h-auto md:h-[20px] xl:hidden'>
                                        <Timer className='w-5 h-5 text-green-700' />
                                        <p className='text-sm md:text-[16px]] w-full'>{new Date(createdAt).toLocaleString()}</p>
                                    </div>

                                    <div className='flex items-center gap-2 h-auto md:h-[100px] lg:h-[90px]'>
                                        <LocationEdit className='w-5 h-5 text-green-700' />
                                        <span className='text-sm md:text-[16px] w-full'>{address?.fullAddress}</span>
                                    </div>

                                    <motion.div className='flex flex-row justify-items-center items-center gap-3'>
                                        <motion.button
                                            whileTap={{ scale: 0.93 }}
                                            whileHover={{ scale: 1.03 }}
                                            onClick={() => handleAccept(assignment)} className='bg-green-500 text-white px-4 py-2 rounded-md w-full cursor-pointer hover:bg-green-600 transition-all duration-300'>Accept</motion.button>
                                        <motion.button
                                            whileTap={{ scale: 0.93 }}
                                            whileHover={{ scale: 1.03 }}
                                            onClick={() => handleReject(_id)} className='bg-red-500 text-white px-4 py-2 rounded-md w-full cursor-pointer hover:bg-red-600 transition-all duration-300'>Reject</motion.button>
                                    </motion.div>
                                </motion.div>
                            )
                        })}
                        {assignments?.length === 0 && (
                            <div className='flex flex-col justify-start h-full'>
                                <p className='text-gray-500 font-semibold text-lg'>No assignments found</p>
                            </div>
                        )}
                    </div>
                </AnimatePresence>
            )
            }
        </div >
    )
}

export default DeliveryBoyDashboard