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

    }, [userId])

    return (
        <></>
    )
}

export default GeoUpdater