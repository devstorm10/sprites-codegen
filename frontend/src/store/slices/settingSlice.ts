import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SettingState = {
  isSidebar: boolean
  isPromptbarExpanded: boolean
  isPromptbarStretched: boolean
}

const initialState: SettingState = {
  isSidebar: true,
  isPromptbarExpanded: false,
  isPromptbarStretched: false,
}

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    showSidebar: (state: SettingState, action: PayloadAction<boolean>) => {
      state.isSidebar = action.payload
    },
    expandPromptbar: (state: SettingState, action: PayloadAction<boolean>) => {
      state.isPromptbarExpanded = action.payload
    },
    stretchPromptbar: (state: SettingState, action: PayloadAction<boolean>) => {
      state.isPromptbarStretched = action.payload
    },
  },
})

export const { showSidebar, expandPromptbar, stretchPromptbar } =
  settingSlice.actions
export default settingSlice.reducer
