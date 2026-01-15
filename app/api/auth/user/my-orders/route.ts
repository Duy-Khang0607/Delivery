import { auth } from "@/app/auth";
import connectDB from "@/app/lib/db";
import Orders from "@/app/models/orders.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDB()

        const session = await auth()

        const orders = await Orders.find({ user: session?.user?.id }).populate('user assignedDeliveryBoy').sort({ createdAt: -1 });

        if (!orders) {
            return NextResponse.json({ success: false, message: 'Orders not found' }, { status: 404 });
        }

        return NextResponse.json(orders, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Get all orders errors' }, { status: 500 });
    }
}