import clsx from 'clsx'
import { ClockBackIcon } from '../icons/ClockBackIcon'
import { PlayIcon } from '../icons/PlayIcon'
import Breadcrumb from './Breadcrumb'

interface TitlebarProps {
  toggleChatPanel: () => void
  isOpen: boolean
}
const Titlebar: React.FC<TitlebarProps> = ({ isOpen, toggleChatPanel }) => {
  return (
    <div className="px-5 py-3 border-b border-background-300 flex justify-between items-center">
      <span></span>
      <Breadcrumb routes={['Agent name', 'Default Context']} />
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
