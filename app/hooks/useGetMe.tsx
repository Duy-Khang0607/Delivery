'use client'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { AppDispatch } from '../redux/store'

const useGetMe = () => {
    const dispatch = useDispatch<AppDispatch>()


    const fetchGetMe = async () => {
        try {
            const user = await axios.get('/api/me');
            dispatch(setUserData(user?.data?.user))
            console.log({ user })
        } catch (error) {
            console.log({ error })
        }
    }


    useEffect(() => {
        fetchGetMe()
    }, [])
}

export default useGetMe