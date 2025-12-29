import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IGrocery } from "../models/grocery.model"

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
    },
})

export const { addToCart } = cartSlice.actions
export default cartSlice.reducer