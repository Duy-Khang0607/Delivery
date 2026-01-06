import connectDB from "@/app/lib/db";
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
        console.log({ event })
        console.log("✅ EVENT TYPE:", event.type)

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session

            console.log("✅ session.metadata:", session.metadata)

            const orderId = session?.metadata?.orderId
            if (!orderId) {
                console.error("❌ Missing orderId in metadata")
                return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
            }

            await connectDB()

            const updated = await Orders.findByIdAndUpdate(
                orderId,
                { isPaid: true }
            )

            console.log("✅ Updated order:", updated)

            if (!updated) {
                console.error("❌ Order not found:", orderId)
                return NextResponse.json({ error: "Order not found" }, { status: 404 })
            }
        }

        return NextResponse.json({ received: true }, { status: 200 })
    } catch (error) {
        console.error({ error })
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 500 })
    }

}