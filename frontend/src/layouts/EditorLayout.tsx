import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Titlebar } from '@/components/Titlebar'
import { Sidebar } from '@/components/Sidebar'
import ChatPanel from '@/components/ChatPanel/ChatPanel'
import { useAppSelector } from '@/store/store'

const EditorLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const isSidebar = useAppSelector((state) => state.setting.isSidebar)

  const toggleChatPanel = () => {
    setIsOpen((prv) => !prv)
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Titlebar toggleChatPanel={toggleChatPanel} isOpen={isOpen} />
      <div className="flex-1 flex h-full overflow-y-auto">
        {isSidebar && <Sidebar />}
        <div className="flex-1">
          <Outlet />
        </div>
        {isOpen && <ChatPanel />}
      </div>
    </div>
  )
}

export default EditorLayout
