import connectDB from "@/app/lib/db";
import ChatRoom from "@/app/models/chatRoom.model";
import Message from "@/app/models/message.model";
import Orders from "@/app/models/orders.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { roomId } = await req.json();

        let room = await Orders.findById(roomId);

        if (!room) {
            return NextResponse.json({ success: false, message: "Room not found" }, { status: 400 });
        }

        const messages = await Message.find({ roomId });

        return NextResponse.json({ success: true, message: "Chat messages fetched successfully", messages }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Get messages failed" }, { status: 500 });
    }
}