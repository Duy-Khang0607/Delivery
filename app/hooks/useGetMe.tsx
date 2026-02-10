'use client'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { AppDispatch } from '../redux/store'
import { useToast } from '@/app/components/Toast'

const useGetMe = () => {
    const dispatch = useDispatch<AppDispatch>()

    const { showToast } = useToast();

    const fetchGetMe = async () => {
        try {
            const user = await axios.get('/api/me');
            dispatch(setUserData(user?.data?.user))
        } catch (error) {
            console.error({ error })
            showToast('Get infomation user failed !', "error");
        }
    }

    useEffect(() => {
        fetchGetMe()
    }, [])
}

export default useGetMe