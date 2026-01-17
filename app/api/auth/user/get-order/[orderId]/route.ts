import connectDB from "@/app/lib/db"
import Orders from "@/app/models/orders.model"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        await connectDB()

        const { orderId } = await params

        const order = await Orders.findById(orderId).populate('assignedDeliveryBoy')

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, order }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to get order' }, { status: 500 })
    }
}