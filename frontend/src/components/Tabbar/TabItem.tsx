import clsx from 'clsx'
import { motion } from 'framer-motion'
import { RxCross2 } from 'react-icons/rx'

interface TabProps {
  active?: boolean
  title: string
}
const TabItem: React.FC<TabProps> = ({ active, title }) => {
  return (
    <div
      className={clsx(
        'w-[150px] flex items-center px-3 py-1.5 cursor-pointer justify-between gap-2',
        active ? 'bg-background-100' : 'bg-background-200'
      )}
      title={title}
    >
      <span className="text-nowrap overflow-hidden text-ellipsis text-sm">
        {title}
      </span>
      <motion.button whileHover={{ rotate: 360 }}>
        <RxCross2 />
      </motion.button>
    </div>
  )
}

export default TabItem
