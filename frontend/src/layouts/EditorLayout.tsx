import { Outlet } from 'react-router-dom'

import { Titlebar } from '@/components/Titlebar'
import { Sidebar } from '@/components/Sidebar'
// import ChatPanel from '@/components/ChatPanel/ChatPanel'

const EditorLayout = () => {
  return (
    <div className="flex flex-col flex-1 overflow-clip">
      <Titlebar />
      <div className="flex-1 flex h-full">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
        {/* <ChatPanel /> */}
      </div>
    </div>
  )
}

export default EditorLayout
