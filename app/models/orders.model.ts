import mongoose from "mongoose";

export interface IOrder {
    _id: mongoose.Types.ObjectId,
    user: mongoose.Types.ObjectId,
    items: [
        {
            grocery: mongoose.Types.ObjectId,
            name: string,
            price: string,
            unit: string,
            image: string[],
            quantity: string,
        }
    ]
    totalAmount: number,
    paymentMethod: 'cod' | 'online',
    address: {
        fullName: string,
        mobile: number,
        city: string,
        state: string,
        pincode: string,
        fullAddress: string,
        latitude: number,
        longitude: number
    },
    status: 'Pending' | 'Out of delivery' | 'Delivered',
    createdAt?: Date,
    updatedAt?: Date,
    isPaid: Boolean,
    assignedDeliveryBoy?: mongoose.Types.ObjectId,
    assignment?: mongoose.Types.ObjectId
    deliveryOTP?: string | null,
    deliveryOTPVerification: boolean,
    deliveredAt?: Date | null,

}

const orderSchema = new mongoose.Schema<IOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            grocery: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Grocery',
                required: true
            },
            name: String,
            price: String,
            unit: String,
            image: [String],
            quantity: Number
        }
    ],
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        default: 'cod'
    },
    totalAmount: Number,
    address: {
        fullName: String,
        mobile: Number,
        city: String,
        state: String,
        pincode: String,
        fullAddress: String,
        latitude: Number,
        longitude: Number
    },
    status: {
        type: String,
        enum: ['Pending', 'Out of delivery', 'Delivered'],
        default: 'Pending'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryAssignment",
        default: null
    },
    assignedDeliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    deliveryOTP: {
        type: String,
        default: null
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    deliveryOTPVerification: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Orders = mongoose.models.Orders || mongoose.model("Orders", orderSchema);

export default Orders;