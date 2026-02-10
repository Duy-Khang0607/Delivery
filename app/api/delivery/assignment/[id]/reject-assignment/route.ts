import { auth } from "@/app/auth";
import connectDB from "@/app/lib/db";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        /**
         * Các bước để 1 delivery (nhân viên giao hàng) reject (từ chối) 1 đơn hàng trên hệ thống:
         * 
         * 1. Delivery đăng nhập và truy cập dashboard, nhìn thấy danh sách các assignment (phân công giao hàng) mới.
         * 2. Delivery xem chi tiết assignment, nếu không thể nhận đơn, nhấn nút "Reject/Từ chối".
         * 3. Giao diện frontend sẽ gửi request (POST) lên API reject-assignment kèm theo id assignment.
         * 4. Backend nhận request, thực hiện:
         *    a) Kết nối database.
         *    b) Lấy id assignment từ params.
         *    c) Lấy status mong muốn (ví dụ: 'rejected') từ request body.
         *    d) Tìm assignment tương ứng trong database.
         *    e) Nếu không tìm thấy assignment, trả về lỗi.
         *    f) Nếu tìm thấy, cập nhật trường status assignment thành 'rejected'.
         *    g) Lưu assignment lại database.
         *    h) Trả về response thành công, thông báo assignment đã bị từ chối.
         * 5. Frontend nhận kết quả và cập nhật lại UI, loại bỏ assignment vừa bị từ chối khỏi danh sách.
         * 6. (Có thể) Thông báo nhanh cho admin/manager hoặc ghi log để theo dõi lý do delivery từ chối đơn.
         */

        await connectDB()

        const { id } = await Promise.resolve(params)

        const { status } = await req.json()

        const session = await auth()

        const deliveryBoyId = session?.user?.id

        if (!deliveryBoyId) {
            return NextResponse.json({ success: false, message: "Delivery boy not found" }, { status: 404 });
        }

        const assignment = await DeliveryAssignment.findById(id)


        if (!assignment) {
            return NextResponse.json({ success: false, message: "Assignment not found" }, { status: 404 })
        }

        assignment.status = status
        await assignment.save()


        return NextResponse.json({ success: true, assignment, message: "Assignment rejected successfully" }, { status: 200 })
    } catch (error) {
        console.error('Error rejecting assignment:', error)
        return NextResponse.json({ success: false, message: "Failed to reject assignment" }, { status: 500 })
    }
}