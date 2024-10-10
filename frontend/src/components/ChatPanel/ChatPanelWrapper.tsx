import { motion, PanInfo } from 'framer-motion'
import { PropsWithChildren, useCallback, useState } from 'react'

const MIN_WIDTH = 400
const MAX_WIDTH = 850

const ChatPanelWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(MIN_WIDTH)

  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent, info: PanInfo) => {
      const updatedWidth = Math.min(
        Math.max(MIN_WIDTH, sidebarWidth - info.delta.x),
        MAX_WIDTH
      )
      setSidebarWidth(updatedWidth)
    },
    [sidebarWidth]
  )

  return (
    <div className="flex">
      <motion.div
        className="w-1 cursor-col-resize bg-transparent"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={handleDrag}
        dragElastic={0}
        variants={{
          drag: { backgroundColor: '#0B99FF' },
          hover: { backgroundColor: '#0B99FF' },
        }}
        whileDrag="drag"
        whileHover="hover"
      />
      <div
        style={{ width: sidebarWidth }}
        className="border-l flex flex-col overflow-clip bg-muted"
      >
        {children}
      </div>
    </div>
  )
}

export default ChatPanelWrapper
