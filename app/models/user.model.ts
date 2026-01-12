import mongoose from "mongoose";

// Khai báo kiểu dữ liệu
export interface IUser {
    _id: mongoose.Types.ObjectId;
    name: string;
    password?: string;
    email: string;
    mobile?: number;
    role?: "user" | "admin" | 'deliveryBoy';
    image?: string;
    location?: {
        type: {
            type: StringConstructor;
            enum: string[];
            default: string;
        };
        coordinates: {
            type: NumberConstructor[];
            default: number[]
        }
    };
    socketId: string | null;
    isOnline: Boolean
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
        enum: ['user', 'admin', 'deliveryBoy'],
    },
    image: {
        type: String,
    },

    socketId: {
        type: String,
        default: null
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    }
}, {
    timestamps: true,
});

userSchema.index({ location: "2dsphere" })

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
