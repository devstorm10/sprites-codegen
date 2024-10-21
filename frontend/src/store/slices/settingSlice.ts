import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SettingState = {
  isSidebar: boolean
  isPromptbar: boolean
}

const initialState: SettingState = {
  isSidebar: true,
  isPromptbar: false,
}

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    showSidebar: (state: SettingState, action: PayloadAction<boolean>) => {
      state.isSidebar = action.payload
    },
    showPromptbar: (state: SettingState, action: PayloadAction<boolean>) => {
      state.isPromptbar = action.payload
    },
  },
})

export const { showSidebar, showPromptbar } = settingSlice.actions
export default settingSlice.reducer
