import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage
import { combineReducers } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import cartSlice from './cartSlice'

// Cấu hình persist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'user'] // Chỉ persist cart và user, bỏ qua các slice khác
}

// Combine reducers
const rootReducer = combineReducers({
    user: userSlice,
    cart: cartSlice
})

// Tạo persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Cấu hình store với persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            }
        })
})

// Tạo persistor
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch