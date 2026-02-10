import connectDB from "@/app/lib/db"
import { sendEmail } from "@/app/lib/mailer"
import Orders from "@/app/models/orders.model"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const { orderId } = await req.json()

        const order = await Orders.findById(orderId).populate('user')

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
        }

        const otp = Math.floor(100000 + Math.random() * 900000)

        order.deliveryOTP = otp.toString()
        await order.save()

        await sendEmail(order.user.email, "Your delivery OTP", `<h2> Your delivery OTP is <strong>${otp}</strong></h2>`)

        return NextResponse.json({ success: true, message: "OTP sent successfully" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false, message: "OTP sending failed" }, { status: 500 })
    }
}