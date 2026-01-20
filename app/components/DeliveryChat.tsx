'use client'
import { Box, Loader2, Send } from 'lucide-react';
import mongoose from 'mongoose';
import { useEffect, useState } from 'react';
import { getSocket } from '../lib/socket';
import { IMessage } from '../models/message.model';
import axios from 'axios';
import { AnimatePresence, motion } from 'motion/react';


type IProps = {
    orderId: mongoose.Types.ObjectId;
    deliveryBoyId: mongoose.Types.ObjectId;
}


const DeliveryChat = ({ orderId, deliveryBoyId }: IProps) => {
    const [newMessage, setNewMessage] = useState('');
    const [message, setMessage] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState(false);


    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            setLoading(true);
            e.preventDefault();
            if (!newMessage.trim()) return;

            const socket = getSocket()
            const messageData = {
                roomId: orderId.toString(),
                text: newMessage,
                senderId: deliveryBoyId.toString(),
                time: new Date().toLocaleDateString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }),
            }

            // CHỈ EMIT message, KHÔNG listen ở đây
            socket?.emit("send-message", messageData)
            setNewMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const fetchMessages = async () => {
        if (!orderId) return;

        try {
            setLoading(true);
            const res = await axios.post(`/api/chat/messages`, { roomId: orderId.toString() })
            if (res?.data?.success) {
                setMessage(res?.data?.messages)
            }
        } catch (error: any) {
            console.error('Error fetching messages:', error?.response?.data?.message || error?.message || 'Unknown error')
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    // Join room & Listen for incoming messages
    useEffect(() => {
        if (!orderId) return;

        const socket = getSocket()
        socket?.emit("join-room", { roomId: orderId?.toString() })

        // LISTENER được đặt Ở ĐÂY - chỉ 1 lần duy nhất khi component mount hoặc orderId thay đổi
        const handleMessage = (message: IMessage) => {
            if (message?.roomId?.toString() === orderId.toString()) {
                setMessage((prev) => [...prev, message])
            }
        }

        socket?.on("send-message", handleMessage)

        // CLEANUP: Remove listener khi component unmount hoặc orderId thay đổi
        return () => {
            socket?.off("send-message", handleMessage)
        }
    }, [orderId])

    // Fetch initial messages
    useEffect(() => {
        fetchMessages()
    }, [orderId])


    return (
        <div className='w-full rounded-md shadow-md border border-gray-300 p-4 overflow-hidden min-h-[300px] mt-5 relative'>
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
                    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                >
                    <Loader2 className='w-10 h-10 text-green-700 mb-5 animate-spin' />
                </motion.div>
            ) : (
                <>
                    <div className='w-full border border-gray-500 mb-4'></div>

                    <div className='w-full h-full flex flex-row items-center justify-center gap-2'>
                        <form className='w-full flex flex-row items-center justify-center gap-2' onSubmit={sendMessage}>
                            <input type="text" placeholder='Your message' className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                            <button disabled={newMessage.length === 0} className={`w-auto text-white rounded-md p-2 cursor-pointer transition-all duration-300 hover:bg-green-800 ${newMessage.length > 0 ? 'bg-green-700' : 'bg-gray-500'}`}>
                                <Send className='w-5 h-5' />
                            </button>
                        </form>
                    </div>

                    <div className='w-full max-h-[500px] overflow-y-auto mt-2 space-y-3 md:max-h-[200px]'>
                        <AnimatePresence mode='wait'>
                            {message?.map((item, index) => (
                                <motion.div
                                    key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.4 }}
                                    className={`flex flex-col mt-2 space-y-2 ${item?.senderId.toString() === deliveryBoyId.toString() ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-4 py-2 max-w-[80%] ${item?.senderId.toString() === deliveryBoyId.toString() ? 'bg-green-500' : 'bg-gray-500'} rounded-md shadow-md text-left ${item?.senderId.toString() === deliveryBoyId.toString() ? 'text-right' : 'text-left'}`}>
                                        <p className='text-sm text-white font-semibold'>{item?.text}</p>
                                    </div>
                                    <p className='text-xs text-gray-500 text-right'>{item?.time}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}

        </div >
    )
}

export default DeliveryChat