import { cn } from '@/lib/utils'
import React, { useCallback, useState } from 'react'
import { Handle, Position } from 'reactflow'

export type Anchor = 'left' | 'top' | 'right' | 'bottom'

type FlowHandlerWrapperProps = {
  parentId: string
  color: string
  anchors?: Anchor[]
}

const ANCHOR_DATA: Record<
  Anchor,
  {
    position: Position
  }
> = {
  left: {
    position: Position.Left,
  },
  top: {
    position: Position.Top,
  },
  right: {
    position: Position.Right,
  },
  bottom: {
    position: Position.Bottom,
  },
}

const FlowHandlers: React.FC<FlowHandlerWrapperProps> = ({
  parentId,
  color,
  anchors,
}) => {
  const [isShowTarget, setIsShowTarget] = useState(false)
  const _anchors: Anchor[] = anchors || ['left', 'top', 'right', 'bottom']

  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    if (event.buttons === 1) {
      setIsShowTarget(true)
    } else {
      setIsShowTarget(false)
    }
  }, [])

  return (
    <>
      {_anchors.map((anchor) => (
        <Handle
          key={anchor}
          type={isShowTarget ? 'target' : 'source'}
          position={ANCHOR_DATA[anchor].position}
          id={`${parentId}_handle_${anchor}_point`}
          className="w-2 h-2 bg-black opacity-0 z-50"
        />
      ))}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+30px)] h-[calc(100%+30px)] group -z-10"
        onMouseEnter={handleMouseEnter}
      >
        {_anchors.map((anchor) => (
          <Handle
            key={anchor}
            id={`${parentId}_handle_${anchor}`}
            type={isShowTarget ? 'target' : 'source'}
            position={ANCHOR_DATA[anchor].position}
            className={cn(
              'absolute w-4 h-4 border !bg-white rounded-full opacity-0 group-hover:opacity-100 z-50'
            )}
            style={{
              borderColor: color,
            }}
          />
        ))}
      </div>
    </>
  )
}

export default FlowHandlers
