import connectDB from "@/app/lib/db";
import { emitEventHandler } from "@/app/lib/emitEventHandler";
import Orders from "@/app/models/orders.model";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";



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

        // Gọi event socket khi order thanh toán thành công
        await emitEventHandler("new-order", newOrder)

        // Trả order thành công
        return NextResponse.json({ success: true, message: 'Create new order successfully', newOrder }, { status: 201 });

    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);
        // Trả lỗi lỗi hệ thống
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}