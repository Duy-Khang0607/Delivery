import connectDB from "@/app/lib/db";
import Orders from "@/app/models/orders.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET!)

export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature")
    const rawBody = await req.text()
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        console.error({ error })
    }

    if (event?.type === "checkout.session.completed") {
        const session = event?.data?.object
        await connectDB()
        await Orders.findByIdAndUpdate(session?.metadata?.orderId, {
            isPaid: true
        })
    }

    return NextResponse.json({ success: true, message: 'Updated successfully', recieved: true }, { status: 200 });
}