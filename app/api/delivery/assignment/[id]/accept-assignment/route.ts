import { auth } from "@/app/auth"
import connectDB from "@/app/lib/db"
import DeliveryAssignment from "@/app/models/deliveryAssignment.model"
import Orders from "@/app/models/orders.model"
import { NextRequest, NextResponse } from "next/server"
import { emitEventHandler } from "@/app/lib/emitEventHandler"


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB()

        const { id } = await params

        const session = await auth()

        const deliveryBoyId = session?.user?.id

        if (!deliveryBoyId) {
            return NextResponse.json({ success: false, message: "Delivery boy not found" }, { status: 404 })
        }

        const assignment = await DeliveryAssignment.findById(id)

        if (!assignment) {
            return NextResponse.json({ success: false, message: "Assignment not found" }, { status: 404 })
        }

        if (assignment.status !== 'brodcasted') {
            return NextResponse.json({ success: false, message: "Assignment expired" }, { status: 400 })
        }

        const alreadyAssigned = await DeliveryAssignment.findOne({ assignedTo: deliveryBoyId, status: { $nin: ['brodcasted', 'completed'] } })

        if (alreadyAssigned) {
            return NextResponse.json({ success: false, message: "You are already assigned to another assignment" }, { status: 400 })
        }

        assignment.assignedTo = deliveryBoyId
        assignment.status = 'assigned'
        assignment.accpectedAt = new Date()
        await assignment.save()

        const order = await Orders.findById(assignment?.order)

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
        }

        order.assignedDeliveryBoy = deliveryBoyId
        await order.save()

        await order.populate('user assignedDeliveryBoy');
        // Gọi event socket khi accpect order
        await emitEventHandler('order-assigned', { orderId: order?._id, assignmentDeliveryBoy: order?.assignedDeliveryBoy })

        await DeliveryAssignment.updateMany({
            _id: { $ne: assignment?._id },
            brodcastedTo: deliveryBoyId,
            status: 'brodcasted'
        }, {
            $pull: {
                brodcastedTo: deliveryBoyId
            }
        })

        return NextResponse.json({ success: true, assignment, message: "Order accepted successfully" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false, message: "API Accept Assignment Failed" }, { status: 500 })
    }
}