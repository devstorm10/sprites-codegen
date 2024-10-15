import { Outlet } from 'react-router-dom'

import { Titlebar } from '@/components/Titlebar'
import { Sidebar } from '@/components/Sidebar'
import ChatPanel from '@/components/ChatPanel/ChatPanel'
import { useState } from 'react'

const EditorLayout = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChatPanel = () => {
    setIsOpen((prv) => !prv)
  }

  return (
    <div className="flex flex-col flex-1 overflow-clip">
      <Titlebar toggleChatPanel={toggleChatPanel} isOpen={isOpen} />
      <div className="flex-1 flex h-full">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
        {isOpen && <ChatPanel />}
      </div>
    </div>
  )
}

export default EditorLayout
