import clsx from 'clsx'

import Breadcrumb from './Breadcrumb'
import { ClockBackIcon } from '../icons/ClockBackIcon'
import { PlayIcon } from '../icons/PlayIcon'
import { useAppSelector } from '@/store/store'
import { searchContextRoute } from '@/store/slices'

interface TitlebarProps {
  toggleChatPanel: () => void
  isOpen: boolean
}
const Titlebar: React.FC<TitlebarProps> = ({ isOpen, toggleChatPanel }) => {
  const activeId = useAppSelector((state) => state.context.activeId)
  const routes = useAppSelector(
    (state) =>
      searchContextRoute(state.context.contexts, activeId || '', []) || []
  )
  const activeRoutes = routes
    .filter(
      (item) =>
        item.type === 'group' ||
        item.type === 'flow' ||
        (item.type === 'flow_node' && item.data?.type === 'prompt')
    )
    .map((item) => ({ id: item.id, title: item.title || '' }))

  return (
    <div className="px-5 py-3 border-b border-background-300 flex justify-between items-center">
      <span></span>
      <Breadcrumb routes={activeRoutes} />
      <div className="flex items-center gap-1">
        <button
          className={clsx(
            'text-text-100 pl-0.5 w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-secondary-100/80',
            isOpen ? 'bg-primary-100' : 'bg-secondary-100'
          )}
          onClick={toggleChatPanel}
        >
          <PlayIcon />
        </button>
        <button className="bg-secondary-100 text-text-100 w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-secondary-100/80">
          <ClockBackIcon />
        </button>
        <button className="bg-secondary-100 text-text-100 h-[36px] px-5 rounded-full hover:bg-secondary-100/80">
          Publish
        </button>
      </div>
    </div>
  )
}

export default Titlebar
