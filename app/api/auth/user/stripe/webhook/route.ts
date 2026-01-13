import connectDB from "@/app/lib/db";
import { emitEventHandler } from "@/app/lib/emitEventHandler";
import Orders from "@/app/models/orders.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET!)


export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature") as string
    const rawBody = await req.text()
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!
        )

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session

            const orderId = session?.metadata?.orderId
            if (!orderId) {
                return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
            }

            await connectDB()

            const updated = await Orders.findByIdAndUpdate(
                orderId,
                { isPaid: true },
                { new: true } // Trả về document sau khi update
            )

            if (!updated) {
                return NextResponse.json({ error: "Order not found" }, { status: 404 })
            }

            // Gọi event socket khi order thanh toán thành công
            await emitEventHandler("new-order", updated)
        }

        return NextResponse.json({ received: true }, { status: 200 })
    } catch (error) {
        console.error({ error })
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 500 })
    }

}