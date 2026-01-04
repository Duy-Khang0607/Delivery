import connectDB from "@/app/lib/db";
import Orders from "@/app/models/orders.model";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    try {
        // connect DB
        await connectDB();

        // get body
        const { userId, items, paymentMethod, totalAmount, address } = await req.json();

        // Check req
        if (!userId || !Array.isArray(items) || items?.length === 0 || !paymentMethod || totalAmount == null || !address) {
            return NextResponse.json({ success: false, message: 'Please send all creaditals' }, { status: 400 });
        }

        if (!address.fullName || !address.mobile || !address.fullAddress) {
            return NextResponse.json(
                { success: false, message: "Address is missing required fields" },
                { status: 400 }
            );
        }

        // find user
        const user = await User?.findById(userId);

        // Trả lỗi nếu userr không tồn taj
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Create order
        const newOrder = await Orders.create({
            user: userId,
            items,
            paymentMethod,
            totalAmount,
            address
        })

        // Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
            cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel`,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Delivery App Order Payment',
                        },
                        unit_amount: totalAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: { orderId: newOrder._id.toString() }
        });

        return NextResponse.json({ url: session?.url }, { status: 200 })

    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);
        // Trả lỗi lỗi hệ thống
        return NextResponse.json({ success: false, message: 'Order Payment error' }, { status: 500 });
    }
}