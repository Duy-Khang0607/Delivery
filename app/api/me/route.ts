import { auth } from "@/app/auth";
import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        // Get session
        const session = await auth();

        // Check session
        if (!session || !session?.user) {
            return NextResponse.json({ success: false, message: 'User is not authenticated' }, { status: 400 });
        }

        // Get user database
        const user = await User.findOne({ email: session?.user?.email }).select("-password")

        // Check user
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 400 });
        }

        // Return 200 
        return NextResponse.json({ success: true, user }, { status: 200 });

    } catch (error) {
        console.error({ error })
        // Return 500
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });

    }
}