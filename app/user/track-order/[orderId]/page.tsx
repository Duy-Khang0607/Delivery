'use client'

import { useParams } from "next/navigation"
import axios from "axios"
import { useEffect } from "react"


const TrackOrder = () => {
  const { orderId } = useParams()

  const fetchOrder = async () => {
    const res = await axios.get(`/api/auth/user/get-order/${orderId}`)
    console.log({ res })
  }

  useEffect(() => {
    fetchOrder()
  }, [orderId])
  return (
    <div>TrackOrder</div>
  )
}

export default TrackOrder