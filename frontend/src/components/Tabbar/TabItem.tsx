import clsx from 'clsx'
import { RxCross2 } from 'react-icons/rx'

import IconButton from '@/common/IconButton'

interface TabProps {
  active?: boolean
  title: string
}
const TabItem: React.FC<TabProps> = ({ active, title }) => {
  return (
    <div
      className={clsx(
        'w-[150px] flex items-center px-3 py-1.5 cursor-pointer justify-between gap-2',
        active ? 'bg-background' : ''
      )}
      title={title}
    >
      <span className="text-nowrap overflow-hidden text-ellipsis text-sm">
        {title}
      </span>
      <IconButton>
        <RxCross2 />
      </IconButton>
    </div>
  )
}

export default TabItem
