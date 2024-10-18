import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import contextReducer from './slices/contextSlice'
import flowReducer from './slices/flowSlice'
import settingReducer from './slices/settingSlice'

const store = configureStore({
  reducer: {
    context: contextReducer,
    flow: flowReducer,
    setting: settingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
