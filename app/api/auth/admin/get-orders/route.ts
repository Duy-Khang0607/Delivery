import connectDB from "@/app/lib/db";
import Orders from "@/app/models/orders.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDB()

        const orders = await Orders.find({}).populate('user assignedDeliveryBoy').sort({ createdAt: -1 });

        if (!orders) {
            return NextResponse.json({ success: false, message: 'Not found orders items' }, { status: 400 });
        }
        return NextResponse.json(orders, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Get failed order items' }, { status: 500 });
    }
}