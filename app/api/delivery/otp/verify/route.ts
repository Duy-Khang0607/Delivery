

import connectDB from "@/app/lib/db"
import { emitEventHandler } from "@/app/lib/emitEventHandler"
import { sendEmail } from "@/app/lib/mailer"
import DeliveryAssignment from "@/app/models/deliveryAssignment.model"
import Orders from "@/app/models/orders.model"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const { orderId, otp } = await req.json()

        if (!orderId || !otp) {
            return NextResponse.json({ success: false, message: "Please send all required fields" }, { status: 400 })
        }

        const order = await Orders.findById(orderId)

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
        }

        if (order.deliveryOTP !== otp) {
            return NextResponse.json({ success: false, message: "Incorrect OTP or expired" }, { status: 400 })
        }

        order.status = 'Delivered'
        order.deliveryOTPVerification = true
        order.deliveredAt = new Date()
        await order.save()

        await emitEventHandler("order-status-updated", { orderId: order?._id, status: order?.status, assignment: order?.assignment })

        await DeliveryAssignment.updateOne(
            { order: orderId },
            { $set: { status: 'completed', assignedTo: null } }
        )

        return NextResponse.json({ success: true, message: "OTP verified successfully" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false, message: "Verification of OTP failed" }, { status: 500 })
    }
}