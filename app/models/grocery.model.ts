import mongoose from "mongoose";

export interface IGrocery {
    _id: mongoose.Types.ObjectId,
    name: string,
    category: string,
    price: number,
    unit?: string,
    quantity: number,
    image: string[],
    createdAt: Date,
    updatedAt: Date,
}

const grocerySchema = new mongoose.Schema<IGrocery>({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: false,
    },
    image: {
        type: [String],
        required: true,
    }
}, { timestamps: true });

const Grocery = mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema);

export default Grocery;