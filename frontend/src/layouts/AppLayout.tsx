import { Outlet } from 'react-router-dom'

import { Tabbar } from '@/components/Tabbar'

const AppLayout = () => {
  return (
    <div className="w-screen h-screen overflow-clip">
      <Tabbar />
      <Outlet />
    </div>
  )
}

export default AppLayout
