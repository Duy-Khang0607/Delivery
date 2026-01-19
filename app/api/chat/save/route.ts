import connectDB from "@/app/lib/db";
import Message from "@/app/models/message.model";
import Orders from "@/app/models/orders.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { roomId, text, senderId, time } = await req.json();

        const room = await Orders.findById(roomId);

        if (!room) {
            return NextResponse.json({ success: false, message: "Room not found" }, { status: 400 });
        }

        const messages = await Message.create({ roomId, text, senderId, time })

        return NextResponse.json({ success: true, message: "Chat message saved successfully", messages }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Save chat message failed" }, { status: 500 });
    }
}