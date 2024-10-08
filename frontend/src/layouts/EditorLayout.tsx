import { Outlet } from 'react-router-dom'

import { Titlebar } from '@/components/Titlebar'
import { Sidebar } from '@/components/Sidebar'

const EditorLayout = () => {
  return (
    <div className="flex flex-col w-screen h-screen overflow-clip">
      <Titlebar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default EditorLayout
