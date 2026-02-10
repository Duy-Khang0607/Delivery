import axios from "axios"

export async function emitEventHandler(event: string, data: any, socketId?: string) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`, {
            event,
            data,
            socketId
        })
        return response.data
    } catch (error) {
        console.error({ error })
        return null
    }

}