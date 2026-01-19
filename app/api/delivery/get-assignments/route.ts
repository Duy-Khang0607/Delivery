import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import Orders from "@/app/models/orders.model";
import connectDB from "@/app/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

export async function GET() {
    try {
        await connectDB();

        const session = await auth();

        if (!session || !session?.user) {
            return NextResponse.json({ success: false, message: 'User is not authenticated' }, { status: 400 });
        }

        const assignments = await DeliveryAssignment.find({ 
            brodcastedTo: session?.user?.id, 
            status: 'brodcasted' 
        }).populate({
            path: 'order',
            model: Orders
        });
        
        return NextResponse.json({ success: true, assignments }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch assignments', error }, { status: 500 });
    }
}