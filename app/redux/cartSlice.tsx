import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IGrocery } from "../models/grocery.model"
import mongoose from "mongoose"

interface ICartSlice {
    cartData: IGrocery[]
}

const initialState: ICartSlice = {
    cartData: []
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<IGrocery>) => {
            state.cartData.push(action.payload)
        },
        increaseQuantity: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
            const item = state.cartData.find(item => item?._id === action.payload)
            if (item) {
                item.quantity = item.quantity + 1;
            }
        },
        decreaseQuantity: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
            const item = state.cartData.find(item => item?._id === action.payload)
            if (item?.quantity && item?.quantity > 1) {
                item.quantity = item.quantity - 1;
            } else {
                state.cartData = state.cartData?.filter(item => item?._id !== action.payload)
            }
        },
    },
})

export const { addToCart, increaseQuantity, decreaseQuantity } = cartSlice.actions
export default cartSlice.reducer