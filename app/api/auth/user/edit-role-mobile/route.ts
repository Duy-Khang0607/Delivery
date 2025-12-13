import { auth } from "@/app/auth";
import connectDB from "@/app/lib/db";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    try {
        // connect DB
        await connectDB();

        // get body
        const { mobile, role } = await req.json();

        // get user id from session
        const session = await auth();

        // update user
        const user = await User?.findOneAndUpdate({ email: session?.user?.email }, { mobile, role }, { new: true });

        // Trả lỗi nếu userr không tồn taj
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Trả lỗi thành công
        return NextResponse.json({ success: true, message: 'User updated successfully', user }, { status: 200 });

    } catch (error) {
        // Trả lỗi lỗi hệ thống
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}