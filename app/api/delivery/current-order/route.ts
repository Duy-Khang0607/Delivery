import Orders from "@/app/models/orders.model"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const orderId = searchParams.get('orderId')
        if (!orderId) {
            return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 })
        }
        const order = await Orders.findById(orderId).populate('user items address')
        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, order }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Get current order error' }, { status: 500 })
    }
}