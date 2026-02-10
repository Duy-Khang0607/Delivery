import { auth } from "@/app/auth";
import connectDB from "@/app/lib/db";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user = await User.find({ role: 'admin' });

        if (!user) {
            return NextResponse.json({ success: false, message: 'No admin found', adminExists: false }, { status: 400 });
        }


        return NextResponse.json({ success: true, message: 'Admin found', adminExists: true }, { status: 200 });


    } catch (error) {
        console.error({ error })
        // Return 500
        return NextResponse.json({ success: false, message: 'Check for admin failed', adminExists: false }, { status: 500 });

    }
}