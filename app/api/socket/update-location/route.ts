import connectDB from "@/app/lib/db";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const { userId, location } = await req.json()

        // Kiểm tra data trước khi query
        if (!userId || !location) {
            return NextResponse.json({ success: false, message: "Missing userId or location" }, { status: 400 })
        }

        // Update user location
        const user = await User.findByIdAndUpdate(userId, {
            location,
        }, { new: true })

        console.log({ user })

        // Kiểm tra user có tồn tại không
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Location updated" }, { status: 200 })

    } catch (error) {
        console.error('Update location error:', error);
        return NextResponse.json({ success: false, message: "Update location failed!", error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}