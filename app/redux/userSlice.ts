import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUser } from "../models/user.model"

interface IUserSlice {
    userData: IUser | null
}

const initialState: IUserSlice = {
    userData: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<IUser | null>) => {
            // State ở đây là gì và Action cũng vậy
            state.userData = action.payload
        },
    },
})

export const { setUserData } = userSlice.actions
export default userSlice.reducer