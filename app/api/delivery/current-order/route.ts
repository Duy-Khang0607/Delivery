import { auth } from "@/app/auth"
import connectDB from "@/app/lib/db"
import DeliveryAssignment from "@/app/models/deliveryAssignment.model"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
    try {
        await connectDB()

        const session = await auth()

        const deliveryBoyId = session?.user?.id

        const activeAssignment = await DeliveryAssignment.findOne({ assignedTo: deliveryBoyId, status: 'assigned' }).populate({
            path: 'order',
            populate: {
                path: 'address',
            }
        })
        if (!activeAssignment) {
            return NextResponse.json({ success: true, assignment: null, message: 'No active assignment found' }, { status: 200 })
        }

        return NextResponse.json({ success: true, assignment: activeAssignment }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to get current order' }, { status: 500 })
    }
}