'use client'

import { useEffect } from "react"
import { getSocket } from "../lib/socket"


const GeoUpdater = ({ userId }: { userId: string }) => {

    let socket = getSocket()

    socket.emit('identity', userId)


    useEffect(() => {
        if (!userId) return
        if (!navigator?.geolocation) return

        const watcher = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos?.coords
                socket.emit("update-location", {
                    userId,
                    lat: latitude,
                    long: longitude
                })
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

        return () => navigator.geolocation.clearWatch(watcher)

    }, [userId])

    return (
        <></>
    )
}

export default GeoUpdater