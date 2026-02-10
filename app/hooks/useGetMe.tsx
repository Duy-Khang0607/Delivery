'use client'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { AppDispatch } from '../redux/store'
import { useToast } from '@/app/components/Toast'
import { useSession } from 'next-auth/react'

const useGetMe = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { data: session, status } = useSession()
    const { showToast } = useToast();

    const fetchGetMe = async () => {
        try {
            const user = await axios.get('/api/me');
            dispatch(setUserData(user?.data?.user))
        } catch (error) {
            console.error({ error })
            // Chỉ hiện toast nếu user đang có session (không hiện khi logout)
            if (session?.user) {
                showToast('Get infomation user failed !', "error");
            }
        }
    }

    useEffect(() => {
        // Chỉ gọi API khi user đã login (có session)
        if (status === 'authenticated' && session?.user) {
            fetchGetMe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, session])
}

export default useGetMe