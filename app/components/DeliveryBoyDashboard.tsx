'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Box, CardSim, LocationEdit, Phone, Timer, User } from 'lucide-react';
import { getSocket } from '../lib/socket';

const DeliveryBoyDashboard = () => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const getAssignments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/delivery/get-assignments');
            console.log({ response: response?.data });
            setAssignments(response?.data?.assignments);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleAccept = async (id: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);
            console.log({ response: response?.data });
        } catch (error) {
            console.error('Error accepting assignment:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleReject = async (orderId: string) => {
        // try {
        //     setLoading(true);
        //     const response = await axios.post('/api/delivery/reject-assignment', { orderId });
        //     console.log({ response: response?.data });
        // }
        // } catch (error) {
        //     console.error('Error rejecting assignment:', error);
        //     setLoading(false);
        // } finally {
        //     setLoading(false);
        // }
    }

    useEffect(() => {
        getAssignments();
    }, []);

    useEffect(() => {
        const socket = getSocket()
        socket?.on('new-assignment', (newAssignment) => {
            console.log({ newAssignment })
            setAssignments((prev) => [...prev, newAssignment])
        })
        return () => {
            socket.off('new-assignment')
        }
    }, [])


    return (
        <div className='w-[90%] md:w-[80%] mt-24 mx-auto'>
            <h1 className='text-green-700 font-extrabold text-3xl tracking-wide text-center mb-4' > Delivery Boy Dashboard</h1>
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