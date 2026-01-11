// Import hàm kết nối database từ thư mục lib
import connectDB from "@/app/lib/db";
// Import model DeliveryAssignment - quản lý việc phân công giao hàng
import DeliveryAssignment from "@/app/models/deliveryAssignment";
// Import model Orders - quản lý đơn hàng
import Orders from "@/app/models/orders.model";
// Import model User - quản lý người dùng (bao gồm shipper)
import User from "@/app/models/user.model";
// Import các type của Next.js để xử lý request và response
import { NextRequest, NextResponse } from "next/server";


// Hàm xử lý POST request - cập nhật trạng thái đơn hàng
// req: request từ client, params: chứa orderId từ URL động [orderId]
export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
    try {
        // Kết nối tới MongoDB database
        await connectDB();

        // Lấy orderId từ params (URL parameter)
        const { orderId } = await params

        // Lấy status mới từ body của request
        const { status } = await req.json();

        // Tìm đơn hàng theo ID và populate thông tin user (người đặt hàng)
        const order = await Orders.findById(orderId).populate('user');

        // Nếu không tìm thấy đơn hàng, trả về lỗi 404
        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        // Cập nhật trạng thái đơn hàng với status mới
        order.status = status;

        // Khởi tạo mảng rỗng để chứa thông tin shipper khả dụng
        let deliveryBoysPayload: any = [];

        // Kiểm tra nếu trạng thái là "Out of delivery" (đang giao) VÀ chưa có assignment
        if (status === 'Out of delivery' && !order?.assignment) {
            const { latitude, longitude } = order.address;
            
            // Kiểm tra xem order có địa chỉ hợp lệ không
            if (!order?.address || !order?.address?.latitude || !order?.address?.longitude) {
                return NextResponse.json({ success: false, message: 'Order address is invalid or missing coordinates!' }, { status: 400 });
            }

            // Lấy tọa độ (vĩ độ, kinh độ) từ địa chỉ giao hàng

            if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
                return NextResponse.json({ success: false, message: 'Invalid coordinates!' }, { status: 400 });
            }

            // Tìm các shipper (role = 'delivery') gần vị trí giao hàng
            // Sử dụng $near của MongoDB để tìm theo vị trí địa lý
            const nearbyDeliveryBoys = await User.find({
                role: 'delivery', // CHỈ tìm shipper, không phải tất cả users
                location: {
                    $near: {
                        // Tạo điểm địa lý với tọa độ [kinh độ, vĩ độ]
                        $geometry: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] },
                        // Khoảng cách tối đa 10km (10000 mét)
                        $maxDistance: 10000
                    }
                }
            })

            // Lấy danh sách ID của các shipper gần đó
            const nearByIds = nearbyDeliveryBoys.map((boy: any) => boy?._id);

            // Tìm các shipper đang bận (đã được assign hoặc đang giao)
            // Lấy danh sách ID shipper có trạng thái 'brodcasted' hoặc 'assigned'
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: { $in: ['brodcasted', 'completed'] } // Đã sửa: 'assigned' thay vì 'completed'
            }).distinct('assignedTo'); // Lấy giá trị unique của field assignedTo

            // Tạo Set từ busyIds để tìm kiếm nhanh hơn (O(1))
            const busyIdSet = new Set(busyIds?.map(id => String(id)));

            // Lọc ra các shipper khả dụng (không nằm trong danh sách bận)
            const availableDeliveryBoys = nearbyDeliveryBoys.filter((boy: any) => !busyIdSet.has(String(boy?._id)));

            // Lấy danh sách ID của shipper khả dụng
            const candidates = availableDeliveryBoys?.map(b => b?._id)

            // ĐÃ SỬA: Nếu KHÔNG có shipper khả dụng thì return thông báo
            if (!candidates || candidates.length === 0) {
                await order.save();
                return NextResponse.json({ success: true, message: 'There is no available delivery boys!' }, { status: 200 });
            }

            // Tạo bản ghi DeliveryAssignment mới - phân công giao hàng
            const deliveryAssignment = await DeliveryAssignment.create({
                order: order?._id,                    // ID đơn hàng
                brodcastedTo: candidates,          // Danh sách shipper được broadcast
                status: 'brodcasted',              // Trạng thái: đã broadcast
            });

            // Gán assignment ID vào đơn hàng
            order.assignment = deliveryAssignment?._id;

            // Tạo payload chứa thông tin shipper để trả về client
            deliveryBoysPayload = availableDeliveryBoys?.map(b => ({
                id: b?._id,                              // ID shipper
                name: b?.name,                           // Tên shipper
                mobile: b?.mobile,                       // Số điện thoại
                latitude: b?.location?.coordinates[1],   // Vĩ độ (index 1)
                longitude: b?.location?.coordinates[0],  // Kinh độ (index 0)
            }))

            // Populate thông tin order vào deliveryAssignment
            await deliveryAssignment.populate('order');
        }

        // Lưu đơn hàng đã cập nhật vào database
        await order.save();
        // Populate lại thông tin user
        await order.populate('user');

        // Trả về response thành công với assignment ID và danh sách shipper khả dụng
        return NextResponse.json({ success: true, assigment: order?.assignment?._id, availableDeliveryBoys: deliveryBoysPayload }, { status: 200 });

    } catch (error) {
        // Xử lý lỗi - trả về status 500 nếu có exception
        console.error('Update order status error:', error);
        return NextResponse.json({ success: false, message: 'Update status order failed!', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
