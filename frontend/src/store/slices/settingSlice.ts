import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SettingState = {
  isSidebar: boolean
}

const initialState: SettingState = {
  isSidebar: true,
}

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    showSidebar: (state: SettingState, action: PayloadAction<boolean>) => {
      state.isSidebar = action.payload
    },
  },
})

export const { showSidebar } = settingSlice.actions
export default settingSlice.reducer
