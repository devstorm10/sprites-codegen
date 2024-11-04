import { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { Titlebar } from '@/components/Titlebar'
import { Sidebar } from '@/components/Sidebar'
import ChatPanel from '@/components/ChatPanel/ChatPanel'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { createActiveTab, findContextNodeById } from '@/store/slices'

const EditorLayout = () => {
  const dispatch = useAppDispatch()
  const { agent_id } = useParams()

  const [isOpen, setIsOpen] = useState(false)
  const isSidebar = useAppSelector((state) => state.setting.isSidebar)
  const contexts = useAppSelector((state) => state.context.contexts)

  const toggleChatPanel = () => {
    setIsOpen((prv) => !prv)
  }

  useEffect(() => {
    const agent = findContextNodeById(contexts, agent_id || '')
    if (agent) {
      dispatch(createActiveTab({ id: agent.id, title: agent.title || '' }))
    }
  }, [agent_id, dispatch])

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
