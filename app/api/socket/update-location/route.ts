import connectDB from "@/app/lib/db";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const { userId, location } = await req.json()

        const user = await User.findByIdAndUpdate(userId, {
            location,
        }, { new: true })


        if (!user || !location) {
            return NextResponse.json({ success: false, message: "Missing userId or location" }, { status: 400 })
        }

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 400 })
        }

        return NextResponse.json({ success: true,message:"Location updated" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false, message: "Update location failed !" }, { status: 500 })
    }
}