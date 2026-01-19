import connectDB from "@/app/lib/db";
import ChatRoom from "@/app/models/chatRoom.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { userId, deliveryBoyId, orderId } = await req.json();

        let room = await ChatRoom.findOne({ orderId })

        if (!room) {
            room = await ChatRoom.create({ userId, deliveryBoyId, orderId })
        }

        return NextResponse.json({ success: true, message: "Chat room created successfully", room }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Create chat room failed" }, { status: 500 });
    }
}