import mongoose from "mongoose";

// Khai báo kiểu dữ liệu
export interface IUser {
    _id: mongoose.Types.ObjectId;
    name: string;
    password?: string;
    email: string;
    mobile?: number;
    role?: "user" | "admin" | 'delivery';
    image?: string;
}


const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: Number,
        required: false,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'delivery'],
    },
    image: {
        type: String,
    },
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
