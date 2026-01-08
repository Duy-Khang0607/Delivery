'use client'
import React, { useEffect } from 'react'
import { getSocket } from '../lib/socket'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { stat } from 'fs'

const AdminDashboard = () => {

  // const { userData } = useSelector((state: RootState) => state.user)

  // useEffect(() => {
  //   const socket = getSocket()
  //   socket.emit('identity', userData?._id)
  //   console.log({ socket })
  // }, [])


  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard